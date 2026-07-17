import { defaults, toggleDefaults } from './defaults';
import { createJellyConfig, rubberBand } from './interaction';

type ToggleGeometry = typeof toggleDefaults;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Distinct follow feel for the toggle knob — buttonJellyConfig stays untouched (JELLY_EFFECT.md). */
export const toggleJellyConfig = createJellyConfig({ drag: 6, tension: 700, friction: 40 });

/** Knob travel from track center to either resting end, css px. */
export function travelPx(G: ToggleGeometry): number {
  return G.trackWidth / 2 - G.knobInset - G.knobWidth / 2;
}

/** Knob center's horizontal offset from track center, css px. t: 0 = OFF/left, 1 = ON/right. */
export function knobCenterOffsetX(t: number, G: ToggleGeometry): number {
  const travel = travelPx(G);
  return lerp(-travel, travel, t);
}

/**
 * Drag delta (css px since pointer-down) -> knob t. Linear across [0,1]; beyond either end the
 * excess is rubber-banded (reuses interaction.ts's log tether, scaled by G.rubberBandPx).
 */
export function tFromDrag(t0: number, dxCss: number, G: ToggleGeometry): number {
  const span = travelPx(G) * 2;
  const raw = t0 + dxCss / span;
  if (raw >= 0 && raw <= 1) return raw;
  const over = raw < 0 ? -raw : raw - 1;
  const banded = rubberBand(over * span, G.rubberBandPx) / span;
  return raw < 0 ? -banded : 1 + banded;
}

/** Which end the knob is currently closer to. */
export function prospectiveState(t: number): boolean {
  return t > 0.5;
}

/** Where a released gesture should settle: a tap flips the pre-gesture state; a drag goes to the nearest end. */
export function releaseTarget(t: number, isTap: boolean, downState: boolean): boolean {
  return isTap ? !downState : prospectiveState(t);
}

/** Knob box at a given expand phase (0 = resting pill, 1 = pressed/expanded). */
export function knobSize(expand: number, G: ToggleGeometry): { width: number; height: number } {
  return {
    width: lerp(G.knobWidth, G.expandedKnobWidth, expand),
    height: lerp(G.knobHeight, G.expandedKnobHeight, expand),
  };
}

/** Horizontal liquid squeeze only while pressing beyond either end. */
export function knobDeformation(
  tTarget: number,
  G: ToggleGeometry,
): { scaleX: number } {
  const overscrollT = Math.max(0, -tTarget, tTarget - 1);
  const overscrollCss = overscrollT * travelPx(G) * 2;
  const pressure = Math.min(overscrollCss / G.jelly.fullPressurePx, 1);
  return {
    scaleX: 1 - pressure * G.jelly.horizontalCompression,
  };
}

/** Press expansion drives the independent concentric background squeeze inside the glass. */
export function glassContentScale(expand: number, G: ToggleGeometry): number {
  return lerp(1, G.glass.contentScale, Math.max(0, Math.min(1, expand)));
}

/** Keep the projected track open through mid-travel while preserving endpoint concentricity. */
export function glassContentScaleX(expand: number, t: number, G: ToggleGeometry): number {
  const clampedT = Math.max(0, Math.min(1, t));
  const endpointWeight = Math.abs(2 * clampedT - 1);
  return lerp(1, glassContentScale(expand, G), endpointWeight);
}

/** Fixed bar/ring centers, css px offset from track center — sit in the region the knob uncovers. */
export function barCenterOffsetX(G: ToggleGeometry): number {
  const knobInnerEdgeAtOn = travelPx(G) - G.knobWidth / 2;
  return (-G.trackWidth / 2 + knobInnerEdgeAtOn) / 2;
}

export function ringCenterOffsetX(G: ToggleGeometry): number {
  return -barCenterOffsetX(G);
}

/** Hit test for the toggle's rounded-rect area (+slop), in css client space. Takes priority over the button. */
export function hitTestToggle(
  clientX: number,
  clientY: number,
  canvasWidthCss: number,
  canvasHeightCss: number,
  G: ToggleGeometry = toggleDefaults,
  slopCss: number = 8,
): boolean {
  const cx = canvasWidthCss / 2;
  // Toggle sits toggleDrop below canvas center — "down" is a larger client Y.
  const cy = canvasHeightCss / 2 + defaults.layout.toggleDrop;
  const halfW = G.trackWidth / 2 + slopCss;
  const halfH = G.trackHeight / 2 + slopCss;
  return Math.abs(clientX - cx) <= halfW && Math.abs(clientY - cy) <= halfH;
}
