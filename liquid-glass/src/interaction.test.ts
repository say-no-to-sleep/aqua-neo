import {
  buttonJellyConfig,
  createJellyConfig,
  ellipseFromPull,
  homeCanvas,
  iconColorForRgb,
  rubberBand,
  rubberBand2D,
  tetherTarget,
} from './interaction';

const home = homeCanvas(800, 600, 2);
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
