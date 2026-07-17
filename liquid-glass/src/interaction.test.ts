import {
  buttonHome,
  buttonJellyConfig,
  createJellyConfig,
  ellipseFromPull,
  homeCanvas,
  iconColorForRgb,
  rubberBand,
  tetherTarget,
  toggleHome,
} from './interaction';
import {
  glassContentScale,
  glassContentScaleX,
  hitTestToggle,
  knobCenterOffsetX,
  knobDeformation,
  tFromDrag,
  travelPx,
} from './toggle';
import { toggleDefaults } from './defaults';

const canvasCenter = homeCanvas(800, 600, 2);
const home = buttonHome(800, 600, 2);
const untouched = tetherTarget(0, 0, 800, 600, 2);
const pulled = tetherTarget(200, 0, 800, 600, 2);
const pulledFar = tetherTarget(2000, 0, 800, 600, 2);
const softer = createJellyConfig({ drag: 0.02, tension: 400, friction: 30 });

if (untouched.x !== home.x || untouched.y !== home.y) throw new Error('press moved before drag');
if (pulled.x <= home.x) throw new Error('tether did not move');
if (pulledFar.x <= pulled.x) throw new Error('tether hit a hard limit');
if (Math.abs(pulledFar.x - home.x - (pulled.x - home.x) * 10) > 1e-9) {
  throw new Error('tether is not linear');
}
const iphoneBase = 179;
const iphoneFrontTravel = 2622 * buttonJellyConfig.dragGain;
const iphonePull = iphoneFrontTravel * (1 - buttonJellyConfig.rearFollow);
const iphoneEllipse = ellipseFromPull(iphoneBase, iphonePull);
const iphoneCenterTravel = iphoneFrontTravel * (1 + buttonJellyConfig.rearFollow) / 2;
if (
  Math.abs(iphoneEllipse.height - 150) > 0.25 ||
  Math.abs(iphoneEllipse.width - 206) > 0.25 ||
  Math.abs(iphoneCenterTravel - 29.5) > 0.25
) {
  throw new Error('full-screen pull no longer matches the measured iPhone silhouette');
}
if (
  buttonJellyConfig.dragGain !== 0.01635 ||
  buttonJellyConfig.rearFollow !== 0.375 ||
  buttonJellyConfig.crossCompression !== 1.08 ||
  buttonJellyConfig.followSpring.tension !== 1200 ||
  buttonJellyConfig.followSpring.friction !== 70
) {
  throw new Error('Button jelly preset changed');
}
if (softer.dragGain !== 0.02 || softer.followSpring.friction !== 30) {
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

// Toggle liquid deformation: end pressure squeezes horizontally without changing height.
const pressuredKnob = knobDeformation(
  1 + toggleDefaults.jelly.fullPressurePx / (travel * 2),
  toggleDefaults,
);
if (pressuredKnob.scaleX !== 1 - toggleDefaults.jelly.horizontalCompression) {
  throw new Error('overscrolled toggle did not squeeze horizontally');
}
if (
  glassContentScale(-1, toggleDefaults) !== 1 ||
  glassContentScale(0, toggleDefaults) !== 1 ||
  glassContentScale(0.5, toggleDefaults) !== 0.885 ||
  glassContentScale(1, toggleDefaults) !== 0.77 ||
  glassContentScale(2, toggleDefaults) !== 0.77
) {
  throw new Error('glass content scale did not clamp and interpolate correctly');
}
if (
  glassContentScaleX(0, 0.5, toggleDefaults) !== 1 ||
  glassContentScaleX(1, -0.5, toggleDefaults) !== 0.77 ||
  glassContentScaleX(1, 0, toggleDefaults) !== 0.77 ||
  glassContentScaleX(1, 0.25, toggleDefaults) !== 0.885 ||
  glassContentScaleX(1, 0.5, toggleDefaults) !== 1 ||
  glassContentScaleX(1, 0.75, toggleDefaults) !== 0.885 ||
  glassContentScaleX(1, 1, toggleDefaults) !== 0.77 ||
  glassContentScaleX(1, 1.5, toggleDefaults) !== 0.77 ||
  glassContentScaleX(0.5, 0, toggleDefaults) !== 0.885 ||
  glassContentScaleX(0.5, 0.5, toggleDefaults) !== 1
) {
  throw new Error('glass content X scale did not stay open through mid-travel');
}
const nearStartContentScale = glassContentScaleX(1, 0.05, toggleDefaults);
const nearEndContentScale = glassContentScaleX(1, 0.95, toggleDefaults);
if (
  Math.abs(nearStartContentScale - 0.77644) > 1e-9 ||
  Math.abs(nearEndContentScale - 0.77644) > 1e-9 ||
  nearStartContentScale !== nearEndContentScale
) {
  throw new Error('glass content X scale did not ease symmetrically at endpoints');
}
