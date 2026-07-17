import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Controller } from '@react-spring/web';
import { loadTextureFromURL, MultiPassRenderer } from './utils/GLUtils';
import { computeGaussianKernelByRadius } from './utils';
import { defaults, toggleDefaults } from './defaults';
import {
  buttonHome,
  ellipseFromPull,
  hitTestCircle,
  iconColorForRgb,
  buttonJellyConfig,
  tetherTarget,
  toggleHome,
} from './interaction';
import {
  barCenterOffsetX,
  glassContentScale,
  glassContentScaleX,
  hitTestToggle,
  knobCenterOffsetX,
  knobDeformation,
  knobSize,
  prospectiveState,
  releaseTarget,
  ringCenterOffsetX,
  tFromDrag,
  toggleJellyConfig,
} from './toggle';

import VertexShader from './shaders/vertex.glsl';
import FragmentBgShader from './shaders/fragment-bg.glsl';
import FragmentBgVblurShader from './shaders/fragment-bg-vblur.glsl';
import FragmentBgHblurShader from './shaders/fragment-bg-hblur.glsl';
import FragmentMainShader from './shaders/fragment-main.glsl';
import FragmentToggleShader from './shaders/fragment-toggle.glsl';

function Button() {
  const captureExpandedOff =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('capture') === 'expanded-off';
  const initialToggle = captureExpandedOff ? 0 : 1;
  const initialExpand = captureExpandedOff ? 1 : 0;
  const [pictureBackground, setPictureBackground] = useState(!captureExpandedOff);
  const pictureBackgroundRef = useRef(!captureExpandedOff);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const rendererRef = useRef<MultiPassRenderer | null>(null);
  const blurWeightsRef = useRef(computeGaussianKernelByRadius(defaults.blurRadius));
  const canvasInfoRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
  });

  const pressScaleSpringRef = useRef(
    new Controller({
      scale: 1,
      config: buttonJellyConfig.pressSpring,
    }),
  );

  /** Moving mass in canvas GL px (y-up); shape1 anchors the blob at home. */
  const posSpringRef = useRef(
    new Controller({
      x: (window.innerWidth * (window.devicePixelRatio || 1)) / 2,
      y: (window.innerHeight * (window.devicePixelRatio || 1)) / 2,
      config: buttonJellyConfig.followSpring,
    }),
  );

  const interactionRef = useRef({
    isDown: false,
    pointerId: null as number | null,
    downX: 0,
    downY: 0,
  });
  /** Toggle knob position, 0 = OFF/left … 1 = ON/right. Starts ON per the reference video. */
  const toggleTSpringRef = useRef(
    new Controller({ t: initialToggle, config: toggleDefaults.settleSpring }),
  );
  /** 0 = resting pill, 1 = pressed/expanded. */
  const toggleExpandSpringRef = useRef(
    new Controller({ expand: initialExpand, config: toggleDefaults.contractSpring }),
  );
  /** 0 = gray track, 1 = green track. */
  const toggleTrackMixSpringRef = useRef(
    new Controller({ mix: initialToggle, config: toggleDefaults.trackMixSpring }),
  );
  const toggleIndicatorAlphaSpringRef = useRef(
    new Controller({ alpha: captureExpandedOff ? 0 : 1, config: toggleDefaults.indicatorAlphaSpring }),
  );
  /** Committed (resting) state, and bookkeeping for the in-flight gesture. */
  const toggleStateRef = useRef(!captureExpandedOff);
  /** Last commanded t-spring goal, including rubber-banded endpoint pressure. */
  const toggleTargetTRef = useRef(initialToggle);
  /** Last prospective (>midpoint) state used to retarget trackMix — avoids re-starting every frame. */
  const toggleProspectiveRef = useRef(!captureExpandedOff);
  const toggleMotionRef = useRef({
    time: performance.now(),
    scaleX: 1,
  });
  const toggleInteractionRef = useRef({
    isDown: false,
    pointerId: null as number | null,
    downX: 0,
    downY: 0,
    downState: !captureExpandedOff,
  });
  const toggleA11yRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const applySize = () => {
      const info = {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      };
      canvasInfoRef.current = info;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = info.width * info.dpr;
        canvas.height = info.height * info.dpr;
      }
      // Keep resting mass at new center if not interacting
      if (!interactionRef.current.isDown) {
        const home = buttonHome(info.width, info.height, info.dpr);
        posSpringRef.current.set({ x: home.x, y: home.y });
      }
    };
    window.addEventListener('resize', applySize);
    applySize();
    return () => window.removeEventListener('resize', applySize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    const renderer = new MultiPassRenderer(canvas, [
      { name: 'bgPass', shader: { vertex: VertexShader, fragment: FragmentBgShader } },
      {
        name: 'vBlurPass',
        shader: { vertex: VertexShader, fragment: FragmentBgVblurShader },
        inputs: { u_prevPassTexture: 'bgPass' },
      },
      {
        name: 'hBlurPass',
        shader: { vertex: VertexShader, fragment: FragmentBgHblurShader },
        inputs: { u_prevPassTexture: 'vBlurPass' },
      },
      {
        name: 'mainPass',
        shader: { vertex: VertexShader, fragment: FragmentMainShader },
        inputs: { u_blurredBg: 'hBlurPass', u_bg: 'bgPass' },
      },
      {
        name: 'togglePass',
        shader: { vertex: VertexShader, fragment: FragmentToggleShader },
        inputs: { u_prevPass: 'mainPass', u_bg: 'bgPass', u_blurredBg: 'hBlurPass' },
        outputToScreen: true,
      },
    ]);

    rendererRef.current = renderer;
    let backgroundTexture: WebGLTexture | null = null;
    let backgroundRatio = 1;
    let disposed = false;

    loadTextureFromURL(gl, '/alpine-lake-background.png?v=27')
      .then(({ texture, ratio }) => {
        if (disposed) {
          gl.deleteTexture(texture);
          return;
        }
        backgroundTexture = texture;
        backgroundRatio = ratio;
      })
      .catch((error) => console.error('Failed to load background photo', error));

    const info = canvasInfoRef.current;
    const w0 = info.width * info.dpr;
    const h0 = info.height * info.dpr;
    gl.viewport(0, 0, Math.round(w0), Math.round(h0));
    renderer.resize(w0, h0);
    renderer.setUniform('u_resolution', [w0, h0]);

    const home = buttonHome(info.width, info.height, info.dpr);
    posSpringRef.current.set({ x: home.x, y: home.y });

    const releaseInteraction = () => {
      const ix = interactionRef.current;
      if (!ix.isDown) return;
      ix.isDown = false;
      ix.pointerId = null;

      const ci = canvasInfoRef.current;
      const h = buttonHome(ci.width, ci.height, ci.dpr);

      pressScaleSpringRef.current.start({
        scale: 1,
        config: buttonJellyConfig.releaseSpring,
      });
      posSpringRef.current.start({
        x: h.x,
        y: h.y,
        config: buttonJellyConfig.homeSpring,
      });
    };

    /** Commit t/trackMix to a final resting side and sync the a11y switch. */
    const settleToggleTo = (finalOn: boolean) => {
      toggleStateRef.current = finalOn;
      toggleProspectiveRef.current = finalOn;
      toggleTargetTRef.current = finalOn ? 1 : 0;
      toggleTSpringRef.current.start({
        t: finalOn ? 1 : 0,
        config: toggleDefaults.settleSpring,
      });
      toggleTrackMixSpringRef.current.start({
        mix: finalOn ? 1 : 0,
        config: toggleDefaults.trackMixSpring,
      });
      toggleA11yRef.current?.setAttribute('aria-checked', String(finalOn));
    };

    const releaseToggleInteraction = (isTap: boolean) => {
      const ix = toggleInteractionRef.current;
      if (!ix.isDown) return;
      ix.isDown = false;
      ix.pointerId = null;

      const finalOn = releaseTarget(toggleTSpringRef.current.get().t, isTap, ix.downState);
      settleToggleTo(finalOn);

      toggleExpandSpringRef.current.start({ expand: 0, config: toggleDefaults.contractSpring });
      toggleIndicatorAlphaSpringRef.current.start({
        alpha: 1,
        config: toggleDefaults.indicatorAlphaSpring,
      });
    };

    /** Keyboard activation: no real down/up pair, so hold the puffed pose briefly before settling. */
    const triggerToggleTap = () => {
      const tix = toggleInteractionRef.current;
      if (tix.isDown) return;
      const downState = toggleStateRef.current;
      // Borrow the pointer gesture's isDown flag as a lock — blocks re-entrant taps (double
      // Enter within the hold window) and defers to a real pointer gesture if one starts.
      tix.isDown = true;
      toggleExpandSpringRef.current.start({ expand: 1, config: toggleDefaults.expandSpring });
      toggleIndicatorAlphaSpringRef.current.start({
        alpha: 0,
        config: toggleDefaults.indicatorAlphaSpring,
      });
      window.setTimeout(() => {
        if (tix.pointerId !== null) return; // a real pointer gesture took over meanwhile
        tix.isDown = false;
        settleToggleTo(!downState);
        toggleExpandSpringRef.current.start({ expand: 0, config: toggleDefaults.contractSpring });
        toggleIndicatorAlphaSpringRef.current.start({
          alpha: 1,
          config: toggleDefaults.indicatorAlphaSpring,
        });
      }, 140);
    };

    const onToggleA11yKeyDown = (e: KeyboardEvent) => {
      if (captureExpandedOff) return;
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      e.preventDefault();
      triggerToggleTap();
    };
    const a11yButton = toggleA11yRef.current;
    a11yButton?.addEventListener('keydown', onToggleA11yKeyDown);

    const onPointerDown = (e: PointerEvent) => {
      if (captureExpandedOff) return;
      const canvasInfo = canvasInfoRef.current;

      // Toggle's hit area takes priority over the button's.
      if (hitTestToggle(e.clientX, e.clientY, canvasInfo.width, canvasInfo.height)) {
        e.preventDefault();
        canvas.setPointerCapture(e.pointerId);

        const tix = toggleInteractionRef.current;
        tix.isDown = true;
        tix.pointerId = e.pointerId;
        tix.downX = e.clientX;
        tix.downY = e.clientY;
        tix.downState = toggleStateRef.current;

        toggleExpandSpringRef.current.start({ expand: 1, config: toggleDefaults.expandSpring });
        toggleIndicatorAlphaSpringRef.current.start({
          alpha: 0,
          config: toggleDefaults.indicatorAlphaSpring,
        });
        return;
      }

      if (!hitTestCircle(e.clientX, e.clientY, canvasInfo.width, canvasInfo.height)) {
        return;
      }

      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);

      const ix = interactionRef.current;
      ix.isDown = true;
      ix.pointerId = e.pointerId;
      ix.downX = e.clientX;
      ix.downY = e.clientY;
      pressScaleSpringRef.current.start({
        scale: buttonJellyConfig.pressScale,
        config: buttonJellyConfig.pressSpring,
      });

    };

    const onPointerMove = (e: PointerEvent) => {
      const tix = toggleInteractionRef.current;
      if (tix.isDown && tix.pointerId === e.pointerId) {
        const dxCss = e.clientX - tix.downX;
        const t0 = tix.downState ? 1 : 0;
        const t = tFromDrag(t0, dxCss, toggleDefaults);
        toggleTargetTRef.current = t;
        toggleTSpringRef.current.start({ t, config: toggleJellyConfig.followSpring });

        const prospective = prospectiveState(t);
        if (prospective !== toggleProspectiveRef.current) {
          toggleProspectiveRef.current = prospective;
          toggleTrackMixSpringRef.current.start({
            mix: prospective ? 1 : 0,
            config: toggleDefaults.trackMixSpring,
          });
        }
        return;
      }

      const ix = interactionRef.current;
      if (!ix.isDown || ix.pointerId !== e.pointerId) return;

      const dxFromDown = e.clientX - ix.downX;
      const dyFromDown = e.clientY - ix.downY;
      const canvasInfo = canvasInfoRef.current;
      const target = tetherTarget(
        dxFromDown,
        dyFromDown,
        canvasInfo.width,
        canvasInfo.height,
        canvasInfo.dpr,
        buttonJellyConfig.tetherScalePx,
      );
      posSpringRef.current.start({
        ...target,
        config: buttonJellyConfig.followSpring,
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      const tix = toggleInteractionRef.current;
      if (tix.isDown && tix.pointerId === e.pointerId) {
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {
          /* already released */
        }
        const moved = Math.hypot(e.clientX - tix.downX, e.clientY - tix.downY);
        releaseToggleInteraction(moved < toggleDefaults.tapSlop);
        return;
      }

      const ix = interactionRef.current;
      if (!ix.isDown || ix.pointerId !== e.pointerId) return;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      releaseInteraction();
    };

    const onPointerCancel = (e: PointerEvent) => {
      const tix = toggleInteractionRef.current;
      if (tix.isDown && tix.pointerId === e.pointerId) {
        releaseToggleInteraction(false);
        return;
      }

      const ix = interactionRef.current;
      if (!ix.isDown || ix.pointerId !== e.pointerId) return;
      releaseInteraction();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);
    canvas.style.touchAction = 'none';
    canvas.style.cursor = 'pointer';

    let raf: number | null = null;
    let lastCanvasInfo: typeof info | null = null;
    let contrastFrame = 0;
    const iconPixels = new Uint8Array(3 * 3 * 4);

    const render = () => {
      raf = requestAnimationFrame(render);

      const active = rendererRef.current;
      if (!active) return;

      const canvasInfo = canvasInfoRef.current;
      const w = canvasInfo.width * canvasInfo.dpr;
      const h = canvasInfo.height * canvasInfo.dpr;

      if (
        !lastCanvasInfo ||
        lastCanvasInfo.width !== canvasInfo.width ||
        lastCanvasInfo.height !== canvasInfo.height ||
        lastCanvasInfo.dpr !== canvasInfo.dpr
      ) {
        gl.viewport(0, 0, Math.round(w), Math.round(h));
        active.resize(w, h);
        lastCanvasInfo = { ...canvasInfo };
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const pressScale = pressScaleSpringRef.current.get().scale;
      const pos = posSpringRef.current.get();
      const baseSize = defaults.shapeWidth * pressScale;

      // Rear mass trails the front at rearFollow, so the back edge advances too
      // and the blob stretches only by the remaining fraction (stays stiff).
      const homePos = buttonHome(canvasInfo.width, canvasInfo.height, canvasInfo.dpr);
      const k = buttonJellyConfig.rearFollow;
      const rearX = homePos.x + (pos.x - homePos.x) * k;
      const rearY = homePos.y + (pos.y - homePos.y) * k;
      const dx = pos.x - rearX;
      const dy = pos.y - rearY;
      const { width: shapeWidth, height: shapeHeight } = ellipseFromPull(
        baseSize,
        Math.hypot(dx, dy) / canvasInfo.dpr,
      );
      const center = [rearX + dx / 2, rearY + dy / 2];
      const icon = iconRef.current;
      if (icon) {
        icon.style.left = `${center[0] / canvasInfo.dpr}px`;
        icon.style.top = `${canvasInfo.height - center[1] / canvasInfo.dpr}px`;
        const angle = Math.atan2(-dy, dx);
        const scaleX = shapeWidth / defaults.shapeWidth;
        const scaleY = shapeHeight / defaults.shapeHeight;
        icon.style.transform =
          `translate(-50%, -50%) rotate(${angle}rad) ` +
          `scale(${scaleX}, ${scaleY}) rotate(${-angle}rad)`;
      }

      // --- Toggle: read springs, derive knob/indicator geometry, push u_tog* uniforms ---
      const toggleHomePos = toggleHome(canvasInfo.width, canvasInfo.height, canvasInfo.dpr);
      const t = toggleTSpringRef.current.get().t;
      const expand = toggleExpandSpringRef.current.get().expand;
      const trackMix = toggleTrackMixSpringRef.current.get().mix;
      const indicatorAlpha = toggleIndicatorAlphaSpringRef.current.get().alpha;

      const now = performance.now();
      const motion = toggleMotionRef.current;
      const elapsed = Math.min((now - motion.time) / 1000, 1 / 15);
      const deformation = toggleInteractionRef.current.isDown
        ? knobDeformation(toggleTargetTRef.current, toggleDefaults)
        : { scaleX: 1 };
      const blend = 1 - Math.exp(-toggleDefaults.jelly.response * elapsed);
      motion.scaleX += (deformation.scaleX - motion.scaleX) * blend;
      motion.time = now;

      const knobBox = knobSize(expand, toggleDefaults);
      const knobCenter = [
        toggleHomePos.x + knobCenterOffsetX(t, toggleDefaults) * canvasInfo.dpr,
        toggleHomePos.y,
      ];
      const barCenter = [
        toggleHomePos.x + barCenterOffsetX(toggleDefaults) * canvasInfo.dpr,
        toggleHomePos.y,
      ];
      const ringCenter = [
        toggleHomePos.x + ringCenterOffsetX(toggleDefaults) * canvasInfo.dpr,
        toggleHomePos.y,
      ];

      active.setUniforms({
        u_resolution: [w, h],
        u_dpr: canvasInfo.dpr,
        u_blurWeights: blurWeightsRef.current,
        u_blurRadius: defaults.blurRadius,
        u_shadowExpand: defaults.shadowExpand,
        u_shadowFactor: defaults.shadowFactor / 100,
        u_shadowPosition: [-defaults.shadowPosition.x, -defaults.shadowPosition.y],
        u_mouse: center,
        u_mouseSpring: center,
        u_shape1Pos: [rearX, rearY],
        u_shapeWidth: shapeWidth,
        u_shapeHeight: shapeHeight,
        u_shapeAngle: Math.atan2(dy, dx),
        u_mergeRate: defaults.mergeRate,
        u_pressed: Math.max(
          0,
          Math.min(1, (pressScale - 1) / (buttonJellyConfig.pressScale - 1)),
        ),
        u_glareAngle: (defaults.glareAngle * Math.PI) / 180,
        u_showShape1: 0,
        u_togCenter: [toggleHomePos.x, toggleHomePos.y],
        u_togTrackSize: [toggleDefaults.trackWidth, toggleDefaults.trackHeight],
        u_togTrackMix: trackMix,
        u_togOnColor: toggleDefaults.onColor,
        u_togOffColor: toggleDefaults.offColor,
        u_togBarCenter: barCenter,
        u_togBarAlpha: indicatorAlpha * trackMix,
        u_togRingCenter: ringCenter,
        u_togRingColor: toggleDefaults.ringColor,
        u_togRingAlpha: indicatorAlpha * (1 - trackMix) * toggleDefaults.ringColor[3],
        u_togKnobCenter: knobCenter,
        u_togKnobSize: [knobBox.width, knobBox.height],
        u_togKnobStretch: motion.scaleX,
        u_togContentScale: glassContentScale(expand, toggleDefaults),
        u_togContentScaleX: glassContentScaleX(expand, t, toggleDefaults),
        u_togKnobColor: toggleDefaults.knobColor,
        // Solid white at rest, crossfades to clear glass as the knob expands (press),
        // and back to frosted/solid as it contracts (release) — the crossfade over the
        // blurred background is what reads as "frost" mid-contraction.
        u_togKnobSolidity: Math.max(0, Math.min(1, 1 - expand)),
        u_togKnobShadowFactor: 0.1 + 0.2 * expand,
      });

      active.render({
        bgPass: {
          u_bgType: pictureBackgroundRef.current ? 12 : defaults.bgType,
          ...(backgroundTexture ? { u_bgTexture: backgroundTexture } : {}),
          u_bgTextureRatio: backgroundRatio,
          u_bgTextureReady: backgroundTexture ? 1 : 0,
        },
        mainPass: {
          u_tint: [
            defaults.tint.r / 255,
            defaults.tint.g / 255,
            defaults.tint.b / 255,
            defaults.tint.a,
          ],
          u_refThickness: defaults.refThickness,
          u_refFactor: defaults.refFactor,
          u_refDispersion: 0,
          u_refFresnelRange: defaults.refFresnelRange,
          u_refFresnelHardness: defaults.refFresnelHardness / 100,
          u_refFresnelFactor: defaults.refFresnelFactor / 100,
          u_glareRange: defaults.glareRange,
          u_glareHardness: defaults.glareHardness / 100,
          u_glareConvergence: defaults.glareConvergence / 100,
          u_glareOppositeFactor: defaults.glareOppositeFactor / 100,
          u_glareFactor: defaults.glareFactor / 100,
          u_blurEdge: defaults.blurEdge ? 1 : 0,
          STEP: defaults.step,
        },
        togglePass: {
          u_tint: [
            defaults.tint.r / 255,
            defaults.tint.g / 255,
            defaults.tint.b / 255,
            defaults.tint.a,
          ],
          u_togRefThickness: toggleDefaults.glass.refThickness,
          u_togRefStrength: toggleDefaults.glass.refStrength,
          u_refFactor: defaults.refFactor,
          u_refDispersion: 0,
          u_refFresnelRange: defaults.refFresnelRange,
          u_refFresnelHardness: defaults.refFresnelHardness / 100,
          u_refFresnelFactor: defaults.refFresnelFactor / 100,
          u_glareRange: defaults.glareRange,
          u_glareHardness: defaults.glareHardness / 100,
          u_glareConvergence: defaults.glareConvergence / 100,
          u_glareOppositeFactor: defaults.glareOppositeFactor / 100,
          u_glareFactor: defaults.glareFactor / 100,
          u_blurEdge: defaults.blurEdge ? 1 : 0,
        },
      });

      if (icon && !interactionRef.current.isDown && ++contrastFrame % 3 === 0) {
        const sampleX = Math.max(1, Math.min(Math.round(w) - 2, Math.round(center[0])));
        const sampleY = Math.max(1, Math.min(Math.round(h) - 2, Math.round(center[1])));
        gl.readPixels(sampleX - 1, sampleY - 1, 3, 3, gl.RGBA, gl.UNSIGNED_BYTE, iconPixels);
        let red = 0;
        let green = 0;
        let blue = 0;
        for (let i = 0; i < iconPixels.length; i += 4) {
          red += iconPixels[i];
          green += iconPixels[i + 1];
          blue += iconPixels[i + 2];
        }
        icon.style.color = iconColorForRgb(red / 9, green / 9, blue / 9);
      }
    };

    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      a11yButton?.removeEventListener('keydown', onToggleA11yKeyDown);
      pressScaleSpringRef.current.stop();
      posSpringRef.current.stop();
      toggleTSpringRef.current.stop();
      toggleExpandSpringRef.current.stop();
      toggleTrackMixSpringRef.current.stop();
      toggleIndicatorAlphaSpringRef.current.stop();
      if (backgroundTexture) gl.deleteTexture(backgroundTexture);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [captureExpandedOff]);

  return (
    <div className="button-stage">
      {!captureExpandedOff && (
        <label className="background-switch">
          <input
            type="checkbox"
            checked={pictureBackground}
            onChange={(event) => {
              pictureBackgroundRef.current = event.target.checked;
              setPictureBackground(event.target.checked);
            }}
          />
          <span>Picture</span>
        </label>
      )}
      <canvas ref={canvasRef} aria-label="Edit" role="button" />
      <svg
        ref={iconRef}
        className="button-icon"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M18 6H9a4 4 0 0 0-4 4v13a4 4 0 0 0 4 4h13a4 4 0 0 0 4-4v-9" />
        <path d="m14 22 2.8-.6L27 11.2a2.3 2.3 0 0 0-3.2-3.2L13.6 18.2Z" />
      </svg>
      <button
        ref={toggleA11yRef}
        type="button"
        role="switch"
        aria-checked={captureExpandedOff ? 'false' : 'true'}
        aria-label="Liquid glass toggle"
        className="toggle-hit"
        style={{
          top: `calc(50% + ${defaults.layout.toggleDrop}px)`,
          width: `${toggleDefaults.trackWidth}px`,
          height: `${toggleDefaults.trackHeight}px`,
        }}
      />
    </div>
  );
}

export default Button;
