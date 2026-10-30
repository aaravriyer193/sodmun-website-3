/* ------------------------------------------------------------------
   A drop of liquid metal that follows the pointer. Used by the home
   CTA and the About page.
------------------------------------------------------------------- */
import * as THREE from 'three';
import { gsap, ScrollTrigger, lerp, reduceMotion, isTouch } from './shell.js';
import { liquidMetal, studioEnvironment, tickMetal } from './metal.js';

export function metalBlob(canvas, { trigger = canvas.parentElement, radius = 1.5, distance = 7, x = 0, dark = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = dark ? 0.55 : 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer, { tint: '#bfe8d0', bright: 1.1 });
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  // a darker steel when text has to sit on top of it
  const mat = liquidMetal({ color: dark ? '#56665d' : '#e6f3eb', roughness: dark ? 0.12 : 0.05, ripple: 0.3, displace: 0.32, scale: 0.9, speed: 0.4, envMapIntensity: dark ? 0.9 : 1.7 });
  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, isTouch ? 48 : 96), mat);
  scene.add(blob);
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? distance * 1.35 : distance;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth - 0.5; mouse.ty = e.clientY / innerHeight - 0.5; });
  let visible = false;
  let scrollK = 0;
  ScrollTrigger.create({ trigger, start: 'top bottom', end: 'bottom top', onToggle: (st) => { visible = st.isActive; }, onUpdate: (st) => { scrollK = st.progress; } });
  gsap.ticker.add(() => {
    if (!visible) return;
    const t = performance.now() / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    blob.rotation.y = t * 0.15 + mouse.x * 0.8;
    blob.rotation.x = mouse.y * 0.6;
    blob.position.x = x + mouse.x * 0.6;
    blob.position.y = -mouse.y * 0.4 + lerp(-0.5, 0.5, scrollK);
    mat.userData.uniforms.uDisplace.value = 0.22 + 0.18 * Math.sin(t * 0.6) ** 2;
    tickMetal([mat], reduceMotion ? 0 : t);
    renderer.render(scene, camera);
  });
  return { blob, mat };
}
