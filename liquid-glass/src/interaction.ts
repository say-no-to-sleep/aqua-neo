import { defaults } from './defaults';

export type JellyStrength = {
  drag: number;
  tension: number;
  friction: number;
};

export function createJellyConfig({
  drag = 0.01635,
  tension = 1200,
  friction = 70,
}: Partial<JellyStrength> = {}) {
  return {
    pressScale: 1.1,
    /** Leading-edge travel per css px of pointer travel. */
    dragGain: drag,
    /** Rear mass follows this fraction of the front's displacement (1 = rigid, 0 = frozen back). */
    rearFollow: 0.375,
    /** Perpendicular compression per css px of elongation. */
    crossCompression: 1.08,
    pressSpring: { mass: 1, tension: 380, friction: 22 },
    releaseSpring: { mass: 1, tension: 220, friction: 14 },
    /** Follow finger while held — snappy but not rigid. */
    followSpring: { mass: 1, tension, friction },
    /** Snap home on release — bouncy settle. */
    homeSpring: { mass: 1, tension: 260, friction: 16 },
  } as const;
}

/** Approved Button jelly feel. Keep this preset stable; create another for other components. */
export const buttonJellyConfig = createJellyConfig();

export function hitTestCircle(
  clientX: number,
  clientY: number,
  canvasWidthCss: number,
  canvasHeightCss: number,
  radiusCss: number = defaults.shapeWidth / 2,
): boolean {
  const cx = canvasWidthCss / 2;
  // Button sits buttonLift above canvas center — "up" is a smaller client Y.
  const cy = canvasHeightCss / 2 - defaults.layout.buttonLift;
  const dx = clientX - cx;
  const dy = clientY - cy;
  return dx * dx + dy * dy <= radiusCss * radiusCss;
}

/** Stiff rubber-band: slope 1 near 0, unbounded but ever-slowing (slope scale/(scale+d)). */
export function rubberBand(offset: number, scale: number): number {
  if (scale <= 0) return 0;
  return scale * Math.log1p(offset / scale);
}

export function homeCanvas(widthCss: number, heightCss: number, dpr: number) {
  return {
    x: (widthCss * dpr) / 2,
    y: (heightCss * dpr) / 2,
  };
}

/** Button's resting center, canvas GL px (y-up) — canvas center lifted up by buttonLift. */
export function buttonHome(widthCss: number, heightCss: number, dpr: number) {
  const c = homeCanvas(widthCss, heightCss, dpr);
  return { x: c.x, y: c.y + defaults.layout.buttonLift * dpr };
}

/** Toggle's resting center, canvas GL px (y-up) — canvas center dropped down by toggleDrop. */
export function toggleHome(widthCss: number, heightCss: number, dpr: number) {
  const c = homeCanvas(widthCss, heightCss, dpr);
  return { x: c.x, y: c.y - defaults.layout.toggleDrop * dpr };
}

export function ellipseFromPull(baseSize: number, pull: number) {
  const stretch = Math.max(0, pull);
  return {
    width: baseSize + stretch,
    height: Math.max(1, baseSize - stretch * buttonJellyConfig.crossCompression),
  };
}

export function iconColorForRgb(red: number, green: number, blue: number) {
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance < 0.5 ? 'rgb(255 255 255)' : 'rgb(0 0 0)';
}

/**
 * Target mass position: home + Apple's measured linear drag response.
 * Returns canvas GL pixels.
 */
export function tetherTarget(
  dragX: number,
  dragY: number,
  widthCss: number,
  heightCss: number,
  dpr: number,
  dragGain: number = buttonJellyConfig.dragGain,
): { x: number; y: number } {
  const home = buttonHome(widthCss, heightCss, dpr);
  return { x: home.x + dragX * dpr * dragGain, y: home.y - dragY * dpr * dragGain };
}
