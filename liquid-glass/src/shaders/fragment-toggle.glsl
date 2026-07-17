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
uniform vec3 u_togKnobColor;
uniform float u_togKnobSolidity;

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
  vec2 offset,
  float factor
) {
  vec4 pixel = vec4(1.0);

  float bgR = texture(tex1, v_uv + offset * (1.0 - (N_R - 1.0) * factor)).r;
  float bgG = texture(tex1, v_uv + offset * (1.0 - (N_G - 1.0) * factor)).g;
  float bgB = texture(tex1, v_uv + offset * (1.0 - (N_B - 1.0) * factor)).b;

  float blurR = texture(tex2, v_uv + offset * (1.0 - (N_R - 1.0) * factor)).r;
  float blurG = texture(tex2, v_uv + offset * (1.0 - (N_G - 1.0) * factor)).g;
  float blurB = texture(tex2, v_uv + offset * (1.0 - (N_B - 1.0) * factor)).b;

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

  vec3 glassColor = u_togKnobColor;

  if (knobCoverage > 0.001) {
    vec2 res1x = u_resolution / u_dpr;

    // Central-difference normal of the knob SDF, physical px taps.
    vec2 normal = normalize(
      vec2(
        knobSDF(gl_FragCoord.xy + vec2(1.0, 0.0)) - knobSDF(gl_FragCoord.xy - vec2(1.0, 0.0)),
        knobSDF(gl_FragCoord.xy + vec2(0.0, 1.0)) - knobSDF(gl_FragCoord.xy - vec2(0.0, 1.0))
      )
    );

    // cssInside: depth inside the knob in css px (positive inside, 0 at the edge).
    float cssInside = -knobDist / u_dpr;
    // Same normalized-distance convention as fragment-main's `merged`.
    float mergedEquiv = knobDist / u_resolution.y;

    // Refraction edge factor (lens physics), same formula as the button's STEP<=9 branch.
    float x_R_ratio = 1.0 - cssInside / u_togRefThickness;
    float thetaI = safeAsin(pow(x_R_ratio, 2.0));
    float thetaT = safeAsin(1.0 / u_refFactor * sin(thetaI));
    float edgeFactor = -1.0 * tan(thetaT - thetaI);
    if (cssInside >= u_togRefThickness) {
      edgeFactor = 0.0;
    }

    vec4 blurredPixel;

    if (edgeFactor <= 0.0) {
      // Deep interior: magnified/blurred track color, no edge refraction.
      blurredPixel = texture(u_blurredBg, v_uv);
      glassColor = mix(blurredPixel, vec4(u_tint.r, u_tint.g, u_tint.b, 1.0), u_tint.a * 0.8).rgb;
    } else {
      float edgeH = cssInside / u_togRefThickness;

      blurredPixel = getTextureDispersion(
        u_bg,
        u_blurredBg,
        u_blurEdge > 0 ? 1.0 : edgeH,
        -normal *
          edgeFactor *
          u_togRefStrength *
          u_dpr *
          vec2(
            u_resolution.y / (res1x.x * u_dpr), /* resolution independent */
            1.0
          ),
        u_refDispersion
      );

      vec4 baseColor = mix(
        blurredPixel,
        vec4(u_tint.r, u_tint.g, u_tint.b, 1.0),
        u_tint.a * 0.8
      );

      // Fresnel brightening near the rim.
      float fresnelFactor = clamp(
        pow(
          1.0 +
            mergedEquiv * res1x.y / 1500.0 * pow(500.0 / u_refFresnelRange, 2.0) +
            u_refFresnelHardness,
          5.0
        ),
        0.0,
        1.0
      );

      vec3 fresnelTintLCH = SRGB_TO_LCH(
        mix(vec3(1.0), vec3(u_tint.r, u_tint.g, u_tint.b), u_tint.a * 0.5)
      );
      fresnelTintLCH.x += 20.0 * fresnelFactor * u_refFresnelFactor;
      fresnelTintLCH.x = clamp(fresnelTintLCH.x, 0.0, 100.0);

      baseColor = mix(
        baseColor,
        vec4(LCH_TO_SRGB(fresnelTintLCH), 1.0),
        fresnelFactor * u_refFresnelFactor * 0.7
      );

      // Directional specular glare.
      float glareGeoFactor = clamp(
        pow(
          1.0 +
            mergedEquiv * res1x.y / 1500.0 * pow(500.0 / u_glareRange, 2.0) +
            u_glareHardness,
          5.0
        ),
        0.0,
        1.0
      );

      float glareAngle = (vec2ToAngle(normal) - PI / 4.0 + u_glareAngle) * 2.0;
      int glareFarside = 0;
      if (
        glareAngle > PI * (2.0 - 0.5) && glareAngle < PI * (4.0 - 0.5) ||
        glareAngle < PI * (0.0 - 0.5)
      ) {
        glareFarside = 1;
      }
      float glareAngleFactor =
        (0.5 + sin(glareAngle) * 0.5) *
        (glareFarside == 1
          ? 1.2 * u_glareOppositeFactor
          : 1.2) *
        u_glareFactor;
      glareAngleFactor = clamp(pow(glareAngleFactor, 0.1 + u_glareConvergence * 2.0), 0.0, 1.0);

      vec3 glareTintLCH = SRGB_TO_LCH(
        mix(blurredPixel.rgb, vec3(u_tint.r, u_tint.g, u_tint.b), u_tint.a * 0.5)
      );
      glareTintLCH.x += 150.0 * glareAngleFactor * glareGeoFactor;
      glareTintLCH.y += 30.0 * glareAngleFactor * glareGeoFactor;
      glareTintLCH.x = clamp(glareTintLCH.x, 0.0, 120.0);

      baseColor = mix(
        baseColor,
        vec4(LCH_TO_SRGB(glareTintLCH), 1.0),
        glareAngleFactor * glareGeoFactor
      );

      glassColor = baseColor.rgb;
    }

    // Directional glass rim: dark C-band on the far edge, bright highlight where it catches light.
    float rimDistance = abs(cssInside);
    if (rimDistance < 2.8) {
      float rim = 1.0 - smoothstep(0.0, 2.8, rimDistance);
      vec2 lightDirection = normalize(vec2(-0.7, 0.7));
      float rimLight = pow(max(dot(normal, lightDirection), 0.0), 2.0);
      float rimShade = pow(max(dot(normal, -lightDirection), 0.0), 2.0);
      float darkRimOpacity = rim * (0.10 + 0.22 * rimShade);
      glassColor = mix(glassColor, vec3(0.06), darkRimOpacity);
      glassColor = mix(glassColor, vec3(1.0), rim * 0.38 * rimLight);
    }
  }

  // STAGE 2: glass material replaces the solid fill; u_togKnobSolidity crossfades solid <-> glass.
  vec3 finalKnobColor = mix(glassColor, u_togKnobColor, u_togKnobSolidity);
  outColor.rgb = mix(outColor.rgb, finalKnobColor, knobCoverage);

  fragColor = outColor;
}
