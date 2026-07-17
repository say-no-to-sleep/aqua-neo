#version 300 es

precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_dpr;
uniform vec2 u_mouse;
uniform vec2 u_mouseSpring;
uniform vec2 u_shape1Pos;
uniform float u_time;
uniform float u_mergeRate;
uniform float u_shapeWidth;
uniform float u_shapeHeight;
uniform float u_shapeAngle;
uniform float u_shapeRadius;
uniform float u_shapeRoundness;
uniform float u_shadowExpand;
uniform float u_shadowFactor;
uniform vec2 u_shadowPosition;
uniform int u_bgType;
uniform sampler2D u_bgTexture;
uniform float u_bgTextureRatio;
uniform int u_bgTextureReady;
uniform int u_showShape1;

// Toggle: track + indicators + knob shadow. All u_tog* are pushed as global uniforms.
uniform vec2 u_togCenter;
uniform vec2 u_togTrackSize;
uniform float u_togTrackMix;
uniform vec3 u_togOnColor;
uniform vec3 u_togOffColor;
uniform vec2 u_togBarCenter;
uniform float u_togBarAlpha;
uniform vec2 u_togRingCenter;
uniform vec4 u_togRingColor;
uniform float u_togRingAlpha;
uniform vec2 u_togKnobCenter;
uniform vec2 u_togKnobSize;
uniform float u_togKnobStretch;
uniform float u_togKnobShadowFactor;

float chessboard(vec2 uv, float size, int mode) {
  float yBars = step(size * 2.0, mod(uv.y * 2.0, size * 4.0));
  float xBars = step(size * 2.0, mod(uv.x * 2.0, size * 4.0));

  if (mode == 0) {
    return yBars;
  } else if (mode == 1) {
    return xBars;
  } else {
    return abs(yBars - xBars);
  }
}

float halfColor(vec2 uv) {
  if (uv.y > 0.5) {
    return 1.0;
  } else {
    return 0.0;
  }
}

#include './lib/sdf.glsl'

float sdgMin(float a, float b) {
  return a < b
    ? a
    : b;
}

// 输入：原始 uv、canvas 宽高比、纹理宽高比
// 输出：变换后的 uv，可直接用于 texture 采样
vec2 getCoverUV(vec2 uv, float canvasAspect, float textureAspect) {
  if (canvasAspect > textureAspect) {
    // canvas 更宽，纹理竖向拉伸
    float scale = textureAspect / canvasAspect;
    uv.y = uv.y * scale + 0.5 - 0.5 * scale;
  } else {
    // canvas 更高，纹理横向拉伸
    float scale = canvasAspect / textureAspect;
    uv.x = uv.x * scale + 0.5 - 0.5 * scale;
  }
  return uv;
}

void main() {
  vec2 u_resolution1x = u_resolution.xy / u_dpr;
  // float chessboardBg = chessboard(gl_FragCoord.xy, 14.0);
  vec3 bgColor = vec3(1.0);

  if (u_bgType <= 0) {
    // chessboard
    bgColor = vec3(1.0 - chessboard(gl_FragCoord.xy / u_dpr, 20.0, 2) / 4.0);
  } else if (u_bgType <= 1) {
    if (v_uv.x < 0.5 && v_uv.y > 0.5) {
      bgColor = vec3(chessboard(gl_FragCoord.xy / u_dpr, 10.0, 0));
    } else if (v_uv.x > 0.5 && v_uv.y < 0.5) {
      bgColor = vec3(chessboard(gl_FragCoord.xy / u_dpr, 10.0, 1));
    } else if (v_uv.x < 0.5 && v_uv.y < 0.5) {
      bgColor = vec3(0.0);
    }
  } else if (u_bgType <= 2) {
    bgColor = vec3(halfColor(gl_FragCoord.xy / u_resolution) * 0.6 + 0.3);
  } else if (u_bgType <= 11) {
    if (u_bgTextureReady != 1) {
      // chessboard
      bgColor = vec3(1.0 - chessboard(gl_FragCoord.xy / u_dpr, 20.0, 2) / 4.0);
    } else {
      vec2 uv = getCoverUV(v_uv, u_resolution.x / u_resolution.y, u_bgTextureRatio);

      // 不需要判断越界，CLAMP_TO_EDGE 会自动处理
      bgColor = texture(u_bgTexture, uv).rgb;
    }
  }

  // float chessboardBg = 1.0 - chessboard(gl_FragCoord.xy / u_dpr, 10.0) / 4.0;
  // float halfColorBg = halfColor(gl_FragCoord.xy / u_resolution);

  // Toggle track (green/gray crossfade) + on/off indicators, drawn into the background.
  float togTrackDist = roundedRectSDF(
    gl_FragCoord.xy,
    u_togCenter,
    u_togTrackSize.x,
    u_togTrackSize.y,
    u_togTrackSize.y * 0.5,
    2.0
  );
  float togTrackFill = 1.0 - smoothstep(-u_dpr, u_dpr, togTrackDist);
  vec3 togTrackColor = mix(u_togOffColor, u_togOnColor, u_togTrackMix);
  bgColor = mix(bgColor, togTrackColor, togTrackFill);

  // "|" bar (exposed when ON) and "○" ring (exposed when OFF) — alpha is fully JS-driven.
  float togBarDist = roundedRectSDF(gl_FragCoord.xy, u_togBarCenter, 5.0, 30.0, 2.5, 2.0);
  float togBarFill = (1.0 - smoothstep(-u_dpr, u_dpr, togBarDist)) * u_togBarAlpha;
  bgColor = mix(bgColor, vec3(1.0), togBarFill);

  float togRingDist = abs(length(gl_FragCoord.xy - u_togRingCenter) - 15.0 * u_dpr) - 2.5 * u_dpr;
  float togRingFill = (1.0 - smoothstep(-u_dpr, u_dpr, togRingDist)) * u_togRingAlpha;
  bgColor = mix(bgColor, u_togRingColor.rgb, togRingFill);

  // draw shadow
  // center of shape 1
  vec2 p1 =
    (vec2(0, 0) - u_shape1Pos + vec2(u_shadowPosition.x * u_dpr, u_shadowPosition.y * u_dpr)) /
    u_resolution.y;
  // center of shape 2
  vec2 p2 =
    (vec2(0, 0) - u_mouseSpring + vec2(u_shadowPosition.x * u_dpr, u_shadowPosition.y * u_dpr)) /
    u_resolution.y;
  float shadowShape = mainSDF(p1, p2, gl_FragCoord.xy);
  vec2 originalP1 = (vec2(0, 0) - u_shape1Pos) / u_resolution.y;
  vec2 originalP2 = (vec2(0, 0) - u_mouseSpring) / u_resolution.y;
  float originalShape = mainSDF(originalP1, originalP2, gl_FragCoord.xy);
  float outside = smoothstep(-1.0 / u_resolution1x.y, 1.0 / u_resolution1x.y, originalShape);
  float shadowDistance = max(shadowShape, 0.0) * u_resolution1x.y;
  float shadow = exp(-shadowDistance / u_shadowExpand) * 0.6 * u_shadowFactor * outside;

  // Knob shadow — same exp-falloff/offset recipe, using the knob's own pill SDF (physical px).
  vec2 knobShadowCenter = u_togKnobCenter - vec2(u_shadowPosition.x * u_dpr, u_shadowPosition.y * u_dpr);
  float knobShadowShape = roundedRectSDF(
    gl_FragCoord.xy,
    knobShadowCenter,
    u_togKnobSize.x * u_togKnobStretch,
    u_togKnobSize.y,
    u_togKnobSize.y * 0.5,
    2.0
  );
  float knobOriginalShape = roundedRectSDF(
    gl_FragCoord.xy,
    u_togKnobCenter,
    u_togKnobSize.x * u_togKnobStretch,
    u_togKnobSize.y,
    u_togKnobSize.y * 0.5,
    2.0
  );
  float knobOutside = smoothstep(-u_dpr, u_dpr, knobOriginalShape);
  float knobShadowDistance = max(knobShadowShape, 0.0) / u_dpr;
  float knobShadow =
    exp(-knobShadowDistance / u_shadowExpand) * 0.6 * u_togKnobShadowFactor * knobOutside;

  shadow = max(shadow, knobShadow);

  fragColor = vec4(mix(bgColor, vec3(0.04), clamp(shadow, 0.0, 0.22)), 1.0);
}
