import { defaults } from './defaults';

export type JellyStrength = {
  drag: number;
  tension: number;
  friction: number;
};

export function createJellyConfig({
  drag = 8,
  tension = 720,
  friction = 46,
}: Partial<JellyStrength> = {}) {
  return {
    pressScale: 1.1,
    /** CSS-px scale of the tether curve — travel is unbounded but slows past this. */
    tetherScalePx: drag,
    /** Rear mass follows this fraction of the front's displacement (1 = rigid, 0 = frozen back). */
    rearFollow: 0.2,
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
  const cy = canvasHeightCss / 2;
  const dx = clientX - cx;
  const dy = clientY - cy;
  return dx * dx + dy * dy <= radiusCss * radiusCss;
}

/** Stiff rubber-band: slope 1 near 0, unbounded but ever-slowing (slope scale/(scale+d)). */
export function rubberBand(offset: number, scale: number): number {
  if (scale <= 0) return 0;
  return scale * Math.log1p(offset / scale);
}

export function rubberBand2D(
  dx: number,
  dy: number,
  limit: number,
): { x: number; y: number } {
  const dist = Math.hypot(dx, dy);
  if (dist < 1e-6) return { x: 0, y: 0 };
  const scaled = rubberBand(dist, limit);
  const s = scaled / dist;
  return { x: dx * s, y: dy * s };
}

export function homeCanvas(widthCss: number, heightCss: number, dpr: number) {
  return {
    x: (widthCss * dpr) / 2,
    y: (heightCss * dpr) / 2,
  };
}

export function ellipseFromPull(baseSize: number, pull: number) {
  return { width: baseSize + Math.max(0, pull), height: baseSize };
}

export function iconColorForRgb(red: number, green: number, blue: number) {
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance < 0.5 ? 'rgb(255 255 255)' : 'rgb(0 0 0)';
}

/**
 * Target mass position: home + rubber-banded drag from pointer-down.
 * Returns canvas GL pixels.
 */
export function tetherTarget(
  dragX: number,
  dragY: number,
  widthCss: number,
  heightCss: number,
  dpr: number,
  tetherScalePx: number = buttonJellyConfig.tetherScalePx,
): { x: number; y: number } {
  const home = homeCanvas(widthCss, heightCss, dpr);
  const band = rubberBand2D(
    dragX * dpr,
    -dragY * dpr,
    tetherScalePx * dpr,
  );
  return { x: home.x + band.x, y: home.y + band.y };
}
