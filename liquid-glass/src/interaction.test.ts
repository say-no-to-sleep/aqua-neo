import {
  buttonHome,
  buttonJellyConfig,
  createJellyConfig,
  ellipseFromPull,
  homeCanvas,
  iconColorForRgb,
  rubberBand,
  rubberBand2D,
  tetherTarget,
  toggleHome,
} from './interaction';
import { hitTestToggle, knobCenterOffsetX, tFromDrag, travelPx } from './toggle';
import { toggleDefaults } from './defaults';

const canvasCenter = homeCanvas(800, 600, 2);
const home = buttonHome(800, 600, 2);
const untouched = tetherTarget(0, 0, 800, 600, 2);
const pulled = tetherTarget(200, 0, 800, 600, 2);
const pulledFar = tetherTarget(2000, 0, 800, 600, 2);
const diagonal = rubberBand2D(30, 40, 36);
const ellipse = ellipseFromPull(200, 80);
const softer = createJellyConfig({ drag: 20, tension: 400, friction: 30 });

if (untouched.x !== home.x || untouched.y !== home.y) throw new Error('press moved before drag');
if (pulled.x <= home.x) throw new Error('tether did not move');
// unbounded: keeps growing past the old cap...
if (pulledFar.x <= pulled.x) throw new Error('tether hit a hard limit');
// ...but sublinear: slope keeps decreasing
if (rubberBand(400, 36) - rubberBand(200, 36) >= rubberBand(200, 36) - rubberBand(0, 36)) {
  throw new Error('tether is not slowing down');
}
if (Math.abs(Math.hypot(diagonal.x, diagonal.y) - 36 * Math.log1p(50 / 36)) > 1e-9) {
  throw new Error('2D tether changed drag direction');
}
if (ellipse.width !== 280 || ellipse.height !== 200) throw new Error('pull is not an oval');
if (buttonJellyConfig.tetherScalePx !== 8 || buttonJellyConfig.followSpring.tension !== 720) {
  throw new Error('Button jelly preset changed');
}
if (softer.tetherScalePx !== 20 || softer.followSpring.friction !== 30) {
  throw new Error('custom jelly strength was ignored');
}
if (iconColorForRgb(0, 0, 0) !== 'rgb(255 255 255)') throw new Error('dark contrast failed');
if (iconColorForRgb(255, 255, 255) !== 'rgb(0 0 0)') throw new Error('light contrast failed');

// Layout: button lifted above canvas center, toggle dropped below it.
const toggle = toggleHome(800, 600, 2);
if (home.y === canvasCenter.y) throw new Error('button did not move off canvas center');
if (toggle.x !== canvasCenter.x) throw new Error('toggle drifted horizontally off canvas center');
if (toggle.y >= canvasCenter.y) throw new Error('toggle is not below canvas center');

// Toggle geometry + drag mapping.
const travel = travelPx(toggleDefaults);
if (knobCenterOffsetX(0, toggleDefaults) !== -travel) throw new Error('OFF knob is not at -travel');
if (knobCenterOffsetX(1, toggleDefaults) !== travel) throw new Error('ON knob is not at +travel');
if (tFromDrag(1, 0, toggleDefaults) !== 1) throw new Error('drag origin should not move t');
if (tFromDrag(1, -travel * 2, toggleDefaults) !== 0) {
  throw new Error('full-span drag did not reach the other end');
}
const linearOvershoot = 1 + 10000 / (travel * 2);
if (tFromDrag(1, 10000, toggleDefaults) >= linearOvershoot) {
  throw new Error('drag overshoot is not rubber-banded');
}
if (!hitTestToggle(400, 300 + 90, 800, 600)) throw new Error('toggle hit test missed its own center');
if (hitTestToggle(400, 300 - 90, 800, 600)) throw new Error('toggle hit test reached up to the button');
