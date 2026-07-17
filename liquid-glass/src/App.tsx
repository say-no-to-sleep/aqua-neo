import { useEffect, useLayoutEffect, useRef } from 'react';
import { Controller } from '@react-spring/web';
import { loadTextureFromURL, MultiPassRenderer } from './utils/GLUtils';
import { computeGaussianKernelByRadius } from './utils';
import { defaults } from './defaults';
import {
  ellipseFromPull,
  hitTestCircle,
  homeCanvas,
  iconColorForRgb,
  buttonJellyConfig,
  tetherTarget,
} from './interaction';

import VertexShader from './shaders/vertex.glsl';
import FragmentBgShader from './shaders/fragment-bg.glsl';
import FragmentBgVblurShader from './shaders/fragment-bg-vblur.glsl';
import FragmentBgHblurShader from './shaders/fragment-bg-hblur.glsl';
import FragmentMainShader from './shaders/fragment-main.glsl';

function Button() {
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
  const rippleRef = useRef({ x: 0, y: 0, startedAt: -Infinity });

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
        const home = homeCanvas(info.width, info.height, info.dpr);
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
        outputToScreen: true,
      },
    ]);

    rendererRef.current = renderer;
    let backgroundTexture: WebGLTexture | null = null;
    let backgroundRatio = 1;
    let disposed = false;

    loadTextureFromURL(gl, '/alpine-lake-background.png')
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

    const home = homeCanvas(info.width, info.height, info.dpr);
    posSpringRef.current.set({ x: home.x, y: home.y });

    const releaseInteraction = () => {
      const ix = interactionRef.current;
      if (!ix.isDown) return;
      ix.isDown = false;
      ix.pointerId = null;

      const ci = canvasInfoRef.current;
      const h = homeCanvas(ci.width, ci.height, ci.dpr);

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

    const onPointerDown = (e: PointerEvent) => {
      const canvasInfo = canvasInfoRef.current;
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
      rippleRef.current = {
        x: e.clientX * canvasInfo.dpr,
        y: (canvasInfo.height - e.clientY) * canvasInfo.dpr,
        startedAt: performance.now(),
      };

      pressScaleSpringRef.current.start({
        scale: buttonJellyConfig.pressScale,
        config: buttonJellyConfig.pressSpring,
      });

    };

    const onPointerMove = (e: PointerEvent) => {
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
      const rippleAge = (performance.now() - rippleRef.current.startedAt) / 1000;
      const pos = posSpringRef.current.get();
      const baseSize = defaults.shapeWidth * pressScale;

      // Rear mass trails the front at rearFollow, so the back edge advances too
      // and the blob stretches only by the remaining fraction (stays stiff).
      const homePos = homeCanvas(canvasInfo.width, canvasInfo.height, canvasInfo.dpr);
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

      active.setUniforms({
        u_resolution: [w, h],
        u_dpr: canvasInfo.dpr,
        u_blurWeights: blurWeightsRef.current,
        u_blurRadius: defaults.blurRadius,
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
        u_rippleOrigin: [rippleRef.current.x, rippleRef.current.y],
        u_rippleAge: rippleAge < 0.7 ? rippleAge : -1,
        u_glareAngle: (defaults.glareAngle * Math.PI) / 180,
        u_showShape1: 0,
      });

      active.render({
        bgPass: {
          u_bgType: defaults.bgType,
          ...(backgroundTexture ? { u_bgTexture: backgroundTexture } : {}),
          u_bgTextureRatio: backgroundRatio,
          u_bgTextureReady: backgroundTexture ? 1 : 0,
          u_shadowExpand: defaults.shadowExpand,
          u_shadowFactor: defaults.shadowFactor / 100,
          u_shadowPosition: [-defaults.shadowPosition.x, -defaults.shadowPosition.y],
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
          u_refDispersion: defaults.refDispersion,
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
      pressScaleSpringRef.current.stop();
      posSpringRef.current.stop();
      if (backgroundTexture) gl.deleteTexture(backgroundTexture);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  return (
    <div className="button-stage">
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
    </div>
  );
}

export default Button;
