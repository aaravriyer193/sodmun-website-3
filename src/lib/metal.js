/* ------------------------------------------------------------------
   Liquid metal: a chrome physical material lit by a studio environment,
   with animated noise on the normals (and optionally the vertices) so
   reflections ripple like mercury.
------------------------------------------------------------------- */
import * as THREE from 'three';

export const NOISE = /* glsl */ `
vec3 lm_mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 lm_mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 lm_perm(vec4 x){return lm_mod289(((x*34.0)+1.0)*x);}
vec4 lm_tis(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float lm_snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=lm_mod289(i);
  vec4 p=lm_perm(lm_perm(lm_perm(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=lm_tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

/** Studio environment: dark floor, bright softboxes, a green bounce. */
export function studioEnvironment(renderer, { photos = [], tint = '#1d8a4a', bright = 1 } = {}) {
  const W = 2048;
  const H = 1024;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#d9dedb');
  sky.addColorStop(0.42, '#7d8681');
  sky.addColorStop(0.5, '#1b201d');
  sky.addColorStop(1, '#050605');
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);

  // faint photos around the horizon so the chrome carries the story
  photos.forEach((img, i) => {
    if (!img?.width) return;
    const w = W / Math.max(photos.length, 1);
    g.globalAlpha = 0.5;
    g.drawImage(img, i * w, H * 0.3, w, H * 0.22);
  });
  g.globalAlpha = 1;

  const box = (x, y, w, h, a = 1, col = '255,255,255') => {
    const grd = g.createLinearGradient(x, y, x, y + h);
    grd.addColorStop(0, `rgba(${col},0)`);
    grd.addColorStop(0.2, `rgba(${col},${a})`);
    grd.addColorStop(0.8, `rgba(${col},${a})`);
    grd.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = grd;
    g.fillRect(x, y, w, h);
  };
  box(W * 0.06, H * 0.08, W * 0.1, H * 0.34, bright);
  box(W * 0.38, H * 0.02, W * 0.26, H * 0.12, bright);
  box(W * 0.7, H * 0.12, W * 0.05, H * 0.36, bright * 0.9);
  box(W * 0.86, H * 0.2, W * 0.08, H * 0.2, bright * 0.7);
  box(W * 0.25, H * 0.28, W * 0.5, H * 0.03, bright * 0.8);
  const t = new THREE.Color(tint);
  box(0, H * 0.52, W, H * 0.08, 0.55, `${(t.r * 255) | 0},${(t.g * 255) | 0},${(t.b * 255) | 0}`);

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  tex.dispose();
  pmrem.dispose();
  return env;
}

/**
 * @param {object} o
 * @param {number} o.ripple   strength of normal ripples
 * @param {number} o.displace vertex displacement (needs dense geometry)
 * @param {object} o.inject   { uniforms, head, body } extra GLSL run after the
 *                            lit colour is known; vLmPos / vLmN are object space
 */
export function liquidMetal({ color = '#e9ecea', roughness = 0.08, ripple = 0.25, displace = 0, scale = 1.6, speed = 0.35, envMapIntensity = 1.15, inject = null } = {}) {
  const mat = new THREE.MeshPhysicalMaterial({
    color, metalness: 1, roughness, envMapIntensity,
    clearcoat: 0.6, clearcoatRoughness: 0.08,
  });
  const uniforms = {
    uTime: { value: 0 },
    uRipple: { value: ripple },
    uDisplace: { value: displace },
    uScale: { value: scale },
    uSpeed: { value: speed },
    ...(inject?.uniforms || {}),
  };
  mat.userData.uniforms = uniforms;
  // programs are cached by this key, so materials with different GLSL must differ
  const key = 'lm:' + (inject ? (inject.head || '') + (inject.body || '') : '');
  mat.customProgramCacheKey = () => key;
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
uniform float uTime; uniform float uDisplace; uniform float uScale; uniform float uSpeed;
varying vec3 vLmPos; varying vec3 vLmN;
${NOISE}`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
vLmPos = position; vLmN = objectNormal;
#ifdef USE_INSTANCING
vLmPos = (instanceMatrix * vec4(position, 1.0)).xyz;
#endif
if (uDisplace > 0.0) {
  float n = lm_snoise(position * uScale + vec3(0.0, uTime * uSpeed, uTime * uSpeed * 0.6));
  n += 0.5 * lm_snoise(position * uScale * 2.1 - vec3(uTime * uSpeed * 0.8));
  transformed += normal * n * uDisplace;
}`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
uniform float uTime; uniform float uRipple; uniform float uScale; uniform float uSpeed;
varying vec3 vLmPos; varying vec3 vLmN;
${NOISE}
${inject?.head || ''}`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
if (uRipple > 0.0) {
  vec3 q = vLmPos * uScale * 1.7 + vec3(0.0, uTime * uSpeed, -uTime * uSpeed * 0.7);
  float e = 0.06;
  float n0 = lm_snoise(q);
  vec3 grad = vec3(lm_snoise(q + vec3(e,0,0)) - n0, lm_snoise(q + vec3(0,e,0)) - n0, lm_snoise(q + vec3(0,0,e)) - n0) / e;
  normal = normalize(normal + (viewMatrix * vec4(grad, 0.0)).xyz * uRipple * 0.18);
}`)
      .replace('#include <opaque_fragment>', `#include <opaque_fragment>
${inject?.body || ''}`);
  };
  return mat;
}

/** Advance every liquid material's clock. */
export function tickMetal(materials, t) {
  materials.forEach((m) => { if (m.userData.uniforms) m.userData.uniforms.uTime.value = t; });
}
