/** Studio default parameters from liquid-glass-studio Controls.tsx */
export const defaults = {
  refThickness: 20,
  refFactor: 1.4,
  refDispersion: 7,
  refFresnelRange: 30,
  refFresnelHardness: 20,
  refFresnelFactor: 20,
  glareRange: 30,
  glareHardness: 20,
  glareFactor: 90,
  glareConvergence: 50,
  glareOppositeFactor: 80,
  glareAngle: -45,
  blurRadius: 12,
  blurEdge: true,
  tint: { r: 255, g: 255, b: 255, a: 0 },
  shadowExpand: 28,
  shadowFactor: 26,
  shadowPosition: { x: 0, y: -12 },
  bgType: 3,
  shapeWidth: 200,
  shapeHeight: 200,
  shapeRadius: 100,
  shapeRoundness: 2,
  mergeRate: 0.05,
  showShape1: false,
  step: 9,
  // Stage layout, css px. Button sits above canvas center, toggle below it.
  layout: {
    buttonLift: 130,
    toggleDrop: 90,
  },
} as const;

/**
 * iOS-26-style toggle geometry + spring feel. Sizes are css px (shaders scale by u_dpr);
 * colors are pre-divided to 0-1 rgb(a) so they can go straight into uniforms.
 */
export const toggleDefaults = {
  trackWidth: 190,
  trackHeight: 84,
  knobWidth: 110,
  knobHeight: 70,
  knobInset: 7,
  expandedKnobWidth: 178,
  expandedKnobHeight: 118,
  barWidth: 5,
  barHeight: 30,
  ringDiameter: 30,
  ringStroke: 5,
  tapSlop: 6,
  rubberBandPx: 10,
  onColor: [0x34 / 255, 0xc7 / 255, 0x59 / 255] as const,
  offColor: [0x39 / 255, 0x39 / 255, 0x3d / 255] as const,
  knobColor: [1, 1, 1] as const,
  ringColor: [235 / 255, 235 / 255, 240 / 255, 0.55] as const,
  // Drag-follow spring lives on toggleJellyConfig.followSpring (src/toggle.ts) — same numbers
  // as the button's followSpring precedent, kept with the jelly config instead of duplicated here.
  /** Snap to the nearest end on release. */
  settleSpring: { mass: 1, tension: 380, friction: 26 },
  /** Puff up on press — slight overshoot. */
  expandSpring: { mass: 1, tension: 550, friction: 30 },
  /** Shrink back after release. */
  contractSpring: { mass: 1, tension: 300, friction: 24 },
  trackMixSpring: { mass: 1, tension: 300, friction: 26 },
  indicatorAlphaSpring: { mass: 1, tension: 500, friction: 34 },
  /** Knob liquid-glass material (STAGE 2). Reuses the button's u_ref/u_glare uniforms
   * for shared look, plus these knob-specific overrides. */
  glass: {
    /** Rim band thickness in css px — thicker than the button's 20 so the knob's
     * dark C-shaped edge bands read clearly at its smaller size (video reference). */
    refThickness: 30,
    /** Refraction UV-offset strength — analog of fragment-main's hardcoded 0.05. */
    refStrength: 0.05,
  },
} as const;
