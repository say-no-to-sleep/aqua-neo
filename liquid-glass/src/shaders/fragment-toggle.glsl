#version 300 es

precision highp float;

#define PI (3.14159265359)

const float N_R = 1.0 - 0.02;
const float N_G = 1.0;
const float N_B = 1.0 + 0.02;

in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_prevPass;
uniform sampler2D u_bg;
uniform sampler2D u_blurredBg;
uniform vec2 u_resolution;
uniform float u_dpr;

// Required by lib/sdf.glsl's mainSDF (unused here — knob uses roundedRectSDF only).
uniform int u_showShape1;
uniform float u_shapeWidth;
uniform float u_shapeHeight;
uniform float u_shapeAngle;
uniform float u_mergeRate;

uniform vec2 u_togKnobCenter;
uniform vec2 u_togKnobSize;
uniform float u_togKnobStretch;
uniform float u_togContentScale;
uniform float u_togContentScaleX;
uniform vec3 u_togKnobColor;
uniform float u_togKnobSolidity;
uniform float u_togKnobShadowFactor;
uniform float u_shadowExpand;
uniform vec2 u_shadowPosition;

// Knob-specific glass tuning (see defaults.ts toggleDefaults.glass).
uniform float u_togRefThickness; // css px — rim band thickness
uniform float u_togRefStrength; // refraction UV-offset strength (analog of button's 0.05)

// Reused from the button's glass material (same values pushed to both passes).
uniform vec4 u_tint;
uniform float u_refFactor;
uniform float u_refDispersion;
uniform float u_refFresnelRange;
uniform float u_refFresnelFactor;
uniform float u_refFresnelHardness;
uniform float u_glareRange;
uniform float u_glareConvergence;
uniform float u_glareOppositeFactor;
uniform float u_glareFactor;
uniform float u_glareHardness;
uniform float u_glareAngle;
uniform int u_blurEdge;

#include './lib/sdf.glsl'
#include './lib/math.glsl'
#include './lib/color.glsl'

float vec2ToAngle(vec2 v) {
  float angle = atan(v.y, v.x);
  if (angle < 0.0) angle += 2.0 * PI;
  return angle;
}

vec4 getTextureDispersion(
  sampler2D tex1,
  sampler2D tex2,
  float mixRate,
  vec2 sampleUv,
  vec2 offset,
  float factor
) {
  vec4 pixel = vec4(1.0);

  float bgR = texture(tex1, sampleUv + offset * (1.0 - (N_R - 1.0) * factor)).r;
  float bgG = texture(tex1, sampleUv + offset * (1.0 - (N_G - 1.0) * factor)).g;
  float bgB = texture(tex1, sampleUv + offset * (1.0 - (N_B - 1.0) * factor)).b;

  float blurR = texture(tex2, sampleUv + offset * (1.0 - (N_R - 1.0) * factor)).r;
  float blurG = texture(tex2, sampleUv + offset * (1.0 - (N_G - 1.0) * factor)).g;
  float blurB = texture(tex2, sampleUv + offset * (1.0 - (N_B - 1.0) * factor)).b;

  pixel.r = mix(bgR, blurR, mixRate);
  pixel.g = mix(bgG, blurG, mixRate);
  pixel.b = mix(bgB, blurB, mixRate);

  return pixel;
}

float knobSDF(vec2 p) {
  return roundedRectSDF(
    p,
    u_togKnobCenter,
    u_togKnobSize.x * u_togKnobStretch,
    u_togKnobSize.y,
    u_togKnobSize.y * 0.5,
    2.0
  );
}

void main() {
  vec4 outColor = texture(u_prevPass, v_uv);
  float knobDist = knobSDF(gl_FragCoord.xy);
  float knobCoverage = 1.0 - smoothstep(-u_dpr, u_dpr, knobDist);
  vec2 knobShadowCenter = u_togKnobCenter - u_shadowPosition * u_dpr;
  float knobShadowShape = roundedRectSDF(
    gl_FragCoord.xy,
    knobShadowCenter,
    u_togKnobSize.x * u_togKnobStretch,
    u_togKnobSize.y,
    u_togKnobSize.y * 0.5,
    2.0
  );
  float knobOutside = smoothstep(-u_dpr, u_dpr, knobDist);
  float knobShadowDistance = max(knobShadowShape, 0.0) / u_dpr;
  float knobContactRing = exp(-pow(knobShadowDistance / 14.0, 2.0)) * 0.11;
  float knobAmbientHalo = exp(-pow(knobShadowDistance / u_shadowExpand, 2.0)) * 0.035;
  float knobShadow = (knobContactRing + knobAmbientHalo) * knobOutside *
    clamp(u_togKnobShadowFactor / 0.3, 0.0, 1.0);
  outColor.rgb = mix(outColor.rgb, vec3(0.04), clamp(knobShadow, 0.0, 0.16));
  vec3 glassColor = u_togKnobColor;
  vec2 surfaceNormal = vec2(0.0, 1.0);
  float cssInside = -knobDist / u_dpr;
  float bevel = 0.0;

  if (knobCoverage > 0.001) {
    vec2 res1x = u_resolution / u_dpr;
    surfaceNormal = normalize(
      vec2(
        knobSDF(gl_FragCoord.xy + vec2(1.0, 0.0)) - knobSDF(gl_FragCoord.xy - vec2(1.0, 0.0)),
        knobSDF(gl_FragCoord.xy + vec2(0.0, 1.0)) - knobSDF(gl_FragCoord.xy - vec2(0.0, 1.0))
      )
    );
    float depth = clamp(cssInside / u_togRefThickness, 0.0, 1.0);
    bevel = 1.0 - smoothstep(0.0, 1.0, depth);
    float x_R_ratio = 1.0 - cssInside / u_togRefThickness;
    float thetaI = safeAsin(pow(x_R_ratio, 2.0));
    float thetaT = safeAsin(1.0 / u_refFactor * sin(thetaI));
    float edgeFactor = -1.0 * tan(thetaT - thetaI);
    if (cssInside >= u_togRefThickness) edgeFactor = 0.0;

    vec2 knobCenterUv = u_togKnobCenter / u_resolution;
    vec2 contentScale = max(vec2(u_togContentScaleX, u_togContentScale), vec2(0.001));
    vec2 sampleUv = knobCenterUv + (v_uv - knobCenterUv) / contentScale;
    vec4 refracted;
    if (edgeFactor <= 0.0) {
      refracted = texture(u_blurredBg, sampleUv);
    } else {
      refracted = getTextureDispersion(
        u_bg,
        u_blurredBg,
        u_blurEdge > 0 ? 1.0 : depth,
        sampleUv,
        -surfaceNormal *
          edgeFactor *
          u_togRefStrength *
          u_dpr *
          vec2(
            u_resolution.y / (res1x.x * u_dpr), /* resolution independent */
            1.0
          ),
        u_refDispersion
      );
    }

    float smokeOpacity = mix(0.20, 0.10, smoothstep(0.0, 1.0, depth));
    vec3 smokeTint = mix(vec3(112.0 / 255.0), u_tint.rgb, depth);
    glassColor = mix(refracted.rgb, smokeTint, smokeOpacity);
    float vertical = abs(surfaceNormal.y);
    glassColor = mix(glassColor, vec3(0.025), bevel * pow(abs(surfaceNormal.x), 2.0) * 0.10);
    glassColor = mix(glassColor, vec3(1.0), bevel * pow(vertical, 2.0) * 0.10);
    glassColor = mix(
      glassColor,
      vec3(1.0),
      (1.0 - smoothstep(0.0, 2.8, max(cssInside, 0.0))) * pow(vertical, 12.0) * 0.14
    );
  }

  float glassPhase = 1.0 - u_togKnobSolidity;
  vec3 finalKnobColor = mix(glassColor, u_togKnobColor, u_togKnobSolidity);
  outColor.rgb = mix(outColor.rgb, finalKnobColor, knobCoverage);
  float outlineDistance = abs(knobDist) / u_dpr;
  float outline = 1.0 - smoothstep(0.0, 2.0, outlineDistance);
  float outlineLight = pow(abs(surfaceNormal.y), 2.0);
  outColor.rgb = mix(
    outColor.rgb,
    vec3(0.0),
    outline * mix(0.50, 0.26, outlineLight) * glassPhase
  );
  float outerGlint = outline * pow(abs(surfaceNormal.y), 12.0) * 0.14 * glassPhase;
  outColor.rgb = mix(outColor.rgb, vec3(1.0), outerGlint);

  fragColor = outColor;
}
