/* ------------------------------------------------------------------
   Legacy — one continuous, scroll-scrubbed shot, no cuts:

   I    a laptop opens on a video call (SODMUN I started on a call)
   II   it shuts, the camera pulls out, and the laptop melts into a pool
        that 400 people rise out of
   III  the camera dives into the crowd to two delegates mid-argument
   IV   it swings back out as the crowd snaps into a square of 800
   V    a pool of liquid metal swallows the square and rises into a
        gavel's block; the gavel strikes face-down, springs back, and
        SODMUN V rises into the gap
------------------------------------------------------------------- */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { ScrollTrigger, gsap, $, $$, range, smooth, lerp, clamp, reduceMotion, isTouch } from '../lib/shell.js';
import { sound } from '../lib/sound.js';
import { sceneControls } from './controls.js';
import { liquidMetal, studioEnvironment, tickMetal } from '../lib/metal.js';
import { typeGeometry } from '../lib/shapes.js';
import { crowdGeometry, debater, argue } from './figure.js';
import PEOPLE from '../data/people.json';

const CROWD = 400;
const SIDE = 28; // 28 × 28 = 784, the square of ~800
const TOTAL = SIDE * SIDE;
const SPACING = 0.5;
const ease = { in: (t) => t * t * t, out: (t) => 1 - (1 - t) ** 3, inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2) };
const rand = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const pretty = (id) => id.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

/* ---------------- floor: black, with a soft glow under the action ---------------- */
const FLOOR_FRAG = /* glsl */ `
varying vec3 vW;
uniform float uGlow;
void main() {
  float d = length(vW.xz);
  gl_FragColor = vec4(vec3(0.05, 0.14, 0.09) * exp(-d * 0.28) * (0.3 + uGlow), 1.0);
}`;

/* ---------------- the call on the laptop screen ---------------- */
function callScreen(atlasImg) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 660;
  const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const ids = PEOPLE.ids.slice(0, 9);
  const [cw, ch] = PEOPLE.cell;
  let speaker = 4;
  const draw = () => {
    g.fillStyle = '#04100a';
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = '#0c2117';
    g.fillRect(0, 0, c.width, 46);
    g.fillStyle = '#cfeedd';
    g.font = '500 20px "Geist Variable", sans-serif';
    g.fillText('SODMUN I · Secretariat call', 22, 30);
    g.fillStyle = '#6fe3a2';
    g.beginPath(); g.arc(c.width - 30, 23, 6, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#7fd9a5';
    g.font = '13px "Geist Variable", sans-serif';
    g.fillText('REC  00:42:17', c.width - 150, 28);
    const pad = 12;
    const tw = (c.width - pad * 4) / 3;
    const th = (c.height - 46 - pad * 4 - 52) / 3;
    ids.forEach((id, i) => {
      const x = pad + (i % 3) * (tw + pad);
      const y = 46 + pad + Math.floor(i / 3) * (th + pad);
      g.fillStyle = '#0a1b12';
      g.fillRect(x, y, tw, th);
      const k = PEOPLE.ids.indexOf(id);
      const sx = (k % PEOPLE.cols) * cw;
      const sy = Math.floor(k / PEOPLE.cols) * ch;
      const s = th / ch * 1.25;
      if (atlasImg?.width) g.drawImage(atlasImg, sx, sy, cw, ch, x + tw / 2 - cw * s / 2, y + th - ch * s + th * 0.25, cw * s, ch * s);
      g.fillStyle = 'rgba(4,16,10,.75)';
      g.fillRect(x, y + th - 24, tw, 24);
      g.fillStyle = '#d8f1e3';
      g.font = '13px "Geist Variable", sans-serif';
      g.fillText(pretty(id), x + 10, y + th - 8);
      if (i === speaker) {
        g.strokeStyle = '#6fe3a2';
        g.lineWidth = 4;
        g.strokeRect(x + 2, y + 2, tw - 4, th - 4);
      }
    });
    // control bar
    const by = c.height - 44;
    ['Mute', 'Video', 'Share', 'Motion', 'Leave'].forEach((label, i) => {
      const w = 92;
      const x = c.width / 2 - (5 * (w + 10)) / 2 + i * (w + 10);
      g.fillStyle = i === 4 ? '#1f4a33' : '#11291c';
      g.beginPath(); g.roundRect(x, by, w, 30, 15); g.fill();
      g.fillStyle = '#d8f1e3';
      g.font = '13px "Geist Variable", sans-serif';
      g.fillText(label, x + w / 2 - g.measureText(label).width / 2, by + 20);
    });
    tex.needsUpdate = true;
  };
  draw();
  return { tex, next: () => { speaker = (speaker + 1 + Math.floor(Math.random() * 3)) % 9; draw(); } };
}

/* ================================================================== */
export function initLegacy({ atlas }) {
  const section = $('#legacy');
  const canvas = $('.legacy__gl', section);
  const chapters = $$('.legacy__chapters li', section);
  const rail = $('.legacy__rail i', section);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#000');
  scene.fog = new THREE.Fog('#000', 10, 34);
  scene.environment = studioEnvironment(renderer, { tint: '#bfe8d0', bright: 1.15 });
  const camera = new THREE.PerspectiveCamera(42, 1, 0.15, 90);

  scene.add(new THREE.HemisphereLight('#e3f5ea', '#020403', 0.7));
  const key = new THREE.DirectionalLight('#ffffff', 1.4);
  key.position.set(4, 9, 6);
  scene.add(key);

  const metals = [];
  const chrome = (o = {}) => { const m = liquidMetal({ color: '#e6f3eb', roughness: 0.07, envMapIntensity: 1.6, ...o }); metals.push(m); return m; };

  /* ---------- floor ---------- */
  const floorMat = new THREE.ShaderMaterial({
    uniforms: { uGlow: { value: 0 } },
    vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: FLOOR_FRAG,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /* ---------- laptop ---------- */
  const laptop = new THREE.Group();
  scene.add(laptop);
  const LW = 1.5;
  const LD = 1.0;
  const LT = 0.05;
  const base = new THREE.Mesh(new RoundedBoxGeometry(LW, LT, LD, 4, 0.025), chrome({ ripple: 0.08 }));
  base.position.y = LT / 2;
  laptop.add(base);
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(LW * 0.86, LD * 0.5), new THREE.MeshStandardMaterial({ color: '#0b1510', roughness: 0.6, metalness: 0.2 }));
  keys.rotation.x = -Math.PI / 2;
  keys.position.set(0, LT + 0.001, -0.08);
  laptop.add(keys);
  const pivot = new THREE.Group();
  pivot.position.set(0, LT, -LD / 2);
  laptop.add(pivot);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(LW, 0.035, LD, 4, 0.016), chrome({ ripple: 0.08 }));
  lid.position.set(0, 0.0175, LD / 2);
  pivot.add(lid);
  const screen = callScreen(atlas.image);
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(LW * 0.92, LD * 0.86), new THREE.MeshBasicMaterial({ map: screen.tex, toneMapped: false }));
  screenMesh.rotation.x = Math.PI / 2;
  screenMesh.position.set(0, -0.0015, LD / 2);
  pivot.add(screenMesh);
  const screenGlow = new THREE.PointLight('#9be8bd', 0, 4);
  screenGlow.position.set(0, 0.5, 0.4);
  laptop.add(screenGlow);

  /* ---------- people ---------- */
  // satin figures in a few pale greens; they turn to liquid metal as they melt
  const pMat = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.42, metalness: 0.15, clearcoat: 0.4, clearcoatRoughness: 0.3, envMapIntensity: 1 });
  const people = new THREE.InstancedMesh(crowdGeometry(), pMat, TOTAL);
  people.frustumCulled = false;
  const TONES = ['#eef6f1', '#d6ebde', '#b8dcc6', '#9cc9ae', '#7fb597', '#f4f5f3'].map((c) => new THREE.Color(c));
  for (let i = 0; i < TOTAL; i++) people.setColorAt(i, TONES[Math.floor(rand(i, 9) * TONES.length)]);
  scene.add(people);

  // the two delegates arguing: jointed mannequins in dark satin, at slim podiums
  const debaterMat = new THREE.MeshPhysicalMaterial({ color: '#2b3d33', roughness: 0.38, metalness: 0.15, clearcoat: 0.6, clearcoatRoughness: 0.25, envMapIntensity: 1.1 });
  const podiumMat = chrome({ ripple: 0, roughness: 0.16 });
  const debaters = [debater(debaterMat), debater(debaterMat)];
  debaters.forEach((d) => {
    const podium = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.62, 48).translate(0, 0.31, 0.26), podiumMat);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.025, 48).translate(0, 0.632, 0.26), podiumMat);
    d.add(podium, top);
    scene.add(d);
  });

  // layouts
  const crowd = [];
  crowd.push(new THREE.Vector3(-0.75, 0, 0), new THREE.Vector3(0.75, 0, 0)); // the two debaters
  for (let i = 2; i < CROWD; i++) {
    const k = i - 2;
    const r = 1.35 + Math.sqrt(k / (CROWD - 2)) * 7.2;
    const a = k * 2.39996;
    crowd.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
  }
  const grid = [];
  for (let z = 0; z < SIDE; z++) for (let x = 0; x < SIDE; x++) grid.push(new THREE.Vector3((x - (SIDE - 1) / 2) * SPACING, 0, (z - (SIDE - 1) / 2) * SPACING));
  // each of the 400 takes the nearest free slot in the square
  const slotOf = new Array(TOTAL).fill(-1);
  const taken = new Uint8Array(TOTAL);
  for (let i = 0; i < CROWD; i++) {
    let best = -1;
    let bd = Infinity;
    for (let j = 0; j < TOTAL; j++) {
      if (taken[j]) continue;
      const d = grid[j].distanceToSquared(crowd[i]);
      if (d < bd) { bd = d; best = j; }
    }
    taken[best] = 1;
    slotOf[i] = best;
  }
  let fill = CROWD;
  for (let j = 0; j < TOTAL; j++) if (!taken[j]) slotOf[fill++] = j;
  const people$ = Array.from({ length: TOTAL }, (_, i) => {
    const slot = grid[slotOf[i]];
    return {
      crowd: crowd[i] || null,
      slot,
      dist: slot.length(),
      delay: rand(i, 4),
      height: 0.9 + rand(i, 5) * 0.2,
      width: 0.92 + rand(i, 6) * 0.14,
    };
  });

  /* ---------- gavel ---------- */
  // The pool and the gavel's block are one object: a flat disc of liquid
  // metal that spreads, draws back in, then thickens up into the block.
  const blockMat = chrome({ ripple: 0, roughness: 0.2 });
  const blockProfile = [[0, 0], [1, 0], [1, 0.42], [0.965, 0.5], [0.79, 0.52], [0.765, 0.95], [0.735, 1], [0, 1]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  const pool = new THREE.Mesh(new THREE.LatheGeometry(blockProfile, 128), blockMat);
  pool.position.y = 0.004;
  scene.add(pool);
  // the laptop melts into this, and the first crowd rises out of it
  // starts as the laptop's own rectangle and rounds off into a circle as it spreads
  const puddleGeo = new THREE.CircleGeometry(1, 160);
  const puddlePos = puddleGeo.attributes.position;
  const rim = Array.from({ length: puddlePos.count }, (_, i) => Math.atan2(puddlePos.getY(i), puddlePos.getX(i)));
  const shapePuddle = (round, radius) => {
    for (let i = 1; i < puddlePos.count; i++) {
      const a = rim[i];
      const c = Math.cos(a);
      const s = Math.sin(a);
      // distance to the laptop's edge (LW × LD) in this direction
      const box = Math.min((LW / 2) / Math.max(Math.abs(c), 1e-4), (LD / 2) / Math.max(Math.abs(s), 1e-4));
      const r = lerp(box, radius, round);
      puddlePos.setXY(i, c * r, s * r);
    }
    puddlePos.needsUpdate = true;
  };
  const puddle = new THREE.Mesh(puddleGeo, chrome({ ripple: 0.0, roughness: 0.22 }));
  puddle.rotation.x = -Math.PI / 2;
  puddle.position.y = 0.02;
  scene.add(puddle);

  // the gavel pivots at the end of its handle, behind the block, so the
  // round face of the head comes down flat on the block
  const BLOCK_TOP = 0.42;
  const BLOCK_R = 1.35;
  const HEAD_H = 0.9;
  const ARM = 2.4;
  const gMat = chrome({ ripple: 0.2 });
  const head = new THREE.Group();
  head.add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, HEAD_H, 64), gMat));
  [-1, 1].forEach((sgn) => {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.1, 64), gMat);
    cap.position.y = sgn * (HEAD_H / 2 - 0.05);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.305, 0.022, 12, 64), gMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = sgn * 0.18;
    head.add(cap, band);
  });
  head.position.z = ARM;
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.08, ARM - 0.3, 32), gMat);
  handle.rotation.x = Math.PI / 2;
  handle.position.z = (ARM - 0.3) / 2;
  const gavel = new THREE.Group(); // swings about its pivot
  gavel.add(head, handle);
  gavel.position.z = -ARM;
  const gavelRoot = new THREE.Group(); // sits over the block, handle angled away to the back-right
  gavelRoot.add(gavel);
  gavelRoot.rotation.y = 0.85;
  gavelRoot.position.y = BLOCK_TOP + HEAD_H / 2;
  scene.add(gavelRoot);

  const shock = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 128), new THREE.MeshBasicMaterial({ color: '#bff0d4', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  shock.rotation.x = -Math.PI / 2;
  shock.position.y = BLOCK_TOP + 0.01;
  scene.add(shock);

  const word = new THREE.Mesh(typeGeometry('five', { width: 3.4, depth: 0.3, bevel: 0.02, segments: 12 }), chrome({ ripple: 0.3 }));
  scene.add(word);

  /* ---------- camera path ---------- */
  const KEYS = [
    [0.0, [0, 1.6, 3.4], [0, 0.4, 0]],
    [0.09, [0, 1.05, 2.2], [0, 0.55, -0.3]],
    [0.15, [0.15, 0.85, 1.55], [0, 0.6, -0.45]],
    [0.2, [0.8, 2.2, 4.2], [0, 0.3, 0]],
    [0.26, [2.4, 4.4, 7.6], [0, 0.2, 0]],
    [0.33, [4.2, 7.2, 11.5], [0, 0, 0]],
    [0.41, [2.6, 1.7, 5.4], [0, 0.7, 0]],
    [0.48, [0.95, 0.95, 1.95], [0, 0.7, 0]],
    [0.56, [-1.7, 1.05, 1.3], [0, 0.7, 0]],
    [0.65, [-7.5, 6.5, -5], [0, 0, 0]],
    [0.75, [0.01, 17.5, 10.5], [0, 0, 0]],
    [0.83, [0, 6.5, 9.5], [0, 0.4, 0]],
    [0.91, [0, 2.2, 6.4], [0, 0.9, 0]],
    [1.0, [0, 1.75, 6.6], [0, 1.2, 0]],
  ];
  const posCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k[1])), false, 'catmullrom', 0.35);
  const lookCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k[2])), false, 'catmullrom', 0.35);
  const curveT = (u) => {
    let i = 0;
    while (i < KEYS.length - 2 && u > KEYS[i + 1][0]) i++;
    const f = smooth(range(u, KEYS[i][0], KEYS[i + 1][0]));
    return (i + f) / (KEYS.length - 1);
  };
  const look = new THREE.Vector3();

  let fit = 1;
  const resize = () => {
    const w = section.clientWidth || window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    fit = Math.max(1, 1.15 / camera.aspect);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  /* ---------- per-frame ---------- */
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const v = new THREE.Vector3();
  const s3 = new THREE.Vector3();
  const e3 = new THREE.Euler();
  let target = 0;
  let p = 0;
  let active = false;
  let lastSpeaker = 0;
  let struck = false;
  let lastChapter = -1;

  const render = (time) => {
    const t = time / 1000;
    p += (target - p) * 0.12;
    if (Math.abs(target - p) < 0.00005) p = target;
    const u = p;

    /* camera */
    const ct = curveT(u);
    posCurve.getPoint(ct, camera.position);
    lookCurve.getPoint(ct, look);
    camera.position.multiplyScalar(lerp(1, fit, smooth(range(u, 0.2, 0.3)) * (1 - smooth(range(u, 0.4, 0.48))) + smooth(range(u, 0.6, 0.7))));
    // a hand-held breath, never a cut
    camera.position.x += Math.sin(t * 0.7) * 0.03;
    camera.position.y += Math.sin(t * 0.9 + 1) * 0.02;
    const hitK = Math.max(0, 1 - Math.abs(u - 0.9) / 0.012);
    camera.position.y += (rand(Math.floor(t * 60)) - 0.5) * 0.12 * hitK;
    camera.fov = lerp(42, 50, smooth(range(u, 0.6, 0.75))) - smooth(range(u, 0.8, 1)) * 10;
    camera.updateProjectionMatrix();
    camera.lookAt(look);

    /* I — laptop opens on a call */
    const open = smooth(range(u, 0.015, 0.09)) * (1 - smooth(range(u, 0.15, 0.19)));
    pivot.rotation.x = -1.86 * open;
    screenMesh.material.color.setScalar(0.25 + 0.75 * smooth(range(u, 0.05, 0.1)) * (1 - range(u, 0.16, 0.19)));
    screenGlow.intensity = 3 * open;
    if (u < 0.2 && t - lastSpeaker > 0.9) { screen.next(); lastSpeaker = t; }
    // II — shut, it melts down into a pool of liquid metal that runs out
    // across the floor; the crowd surfaces from it, then it drains away
    const melt = smooth(range(u, 0.188, 0.215));
    laptop.scale.set(1, Math.max(0.001, 1 - melt), 1);
    laptop.visible = u < 0.215;
    base.material.userData.uniforms.uRipple.value = 0.08 + melt * 0.6;
    const flood = lerp(0.9, 9.2, smooth(range(u, 0.215, 0.27)));
    shapePuddle(smooth(range(u, 0.195, 0.23)), flood);
    puddle.scale.setScalar(Math.max(0.001, 1 - smooth(range(u, 0.31, 0.36))));
    puddle.visible = u > 0.19 && u < 0.36;

    /* people */
    const gridK = smooth(range(u, 0.58, 0.72));
    const shake = smooth(range(u, 0.4, 0.46)) * (1 - smooth(range(u, 0.58, 0.64)));
    // V: a pool of liquid metal spreads across the square, swallowing it,
    // then draws back into the gavel's block
    const spread = smooth(range(u, 0.755, 0.82));
    const meltR = lerp(0.01, 11.5, spread);
    const poolR = meltR - smooth(range(u, 0.82, 0.865)) * (11.5 - BLOCK_R);
    const molten = smooth(range(u, 0.74, 0.8));
    pMat.metalness = lerp(0.15, 1, molten);
    pMat.roughness = lerp(0.42, 0.08, molten);
    for (let i = 0; i < TOTAL; i++) {
      const pp = people$[i];
      let scale = 1;
      let yaw = 0;
      if (i < CROWD) {
        // surface from the pool, right where they will stand, as it reaches them
        const e = u < 0.3 ? clamp((flood - pp.crowd.length() - 0.15) / 1.1) : 1;
        v.copy(pp.crowd);
        v.y = lerp(-1.05, 0, ease.out(e));
        scale = e > 0 ? 1 : 0;
        // the crowd faces the middle, where the argument is
        yaw = Math.atan2(-pp.crowd.x, -pp.crowd.z);
        if (gridK > 0) {
          const g = ease.inOut(clamp(gridK * 1.3 - pp.delay * 0.3));
          v.lerp(pp.slot, g);
          yaw = lerp(yaw, 0, g);
        }
        if (shake > 0) v.y += Math.abs(Math.sin(t * 5 + i)) * 0.02 * shake;
      } else {
        v.copy(pp.slot);
        scale = ease.out(range(u, 0.62 + pp.delay * 0.1, 0.65 + pp.delay * 0.1));
      }
      // melt where the pool has reached (the front only ever advances)
      const m = clamp((meltR - pp.dist) / 1.1);
      const squash = ease.out(m);
      if (m >= 1) scale = 0; // fully melted: gone into the pool
      if (i >= 2 && (v.x - camera.position.x) ** 2 + (v.z - camera.position.z) ** 2 < 0.36 && camera.position.y < 2) scale = 0; // never fill the lens
      // melted figures sink flat beneath the pool's surface
      const sy = pp.height * (1 - squash);
      const sxz = pp.width * (1 + squash * 0.35);
      m4.compose(v, q.setFromEuler(e3.set(0, yaw, 0)), s3.set(sxz * scale, Math.max(sy * scale, 0.0001), sxz * scale));
      if (i < 2) {
        // the debaters are drawn separately, with arms
        const d = debaters[i];
        const side = i === 0 ? 1 : -1;
        d.position.copy(v);
        d.position.x += side * (Math.sin(t * 9 + i) * 0.02) * shake;
        d.scale.set(sxz * scale * 1.06, Math.max(sy * scale * 1.06, 0.0001), sxz * scale * 1.06);
        d.rotation.y = lerp(yaw, side > 0 ? Math.PI / 2 : -Math.PI / 2, shake);
        argue(d, t, shake, i * 1.7);
        m4.compose(v, q, s3.set(0.0001, 0.0001, 0.0001));
      }
      people.setMatrixAt(i, m4);
    }
    people.instanceMatrix.needsUpdate = true;
    people.visible = u > 0.21 && u < 0.87;
    debaters.forEach((d) => { d.visible = people.visible; });

    /* pool → block → gavel → SODMUN V */
    const rise = smooth(range(u, 0.86, 0.885));
    pool.scale.set(Math.max(0.01, poolR), lerp(0.012, BLOCK_TOP, rise), Math.max(0.01, poolR));
    pool.visible = u > 0.755;
    blockMat.roughness = lerp(0.2, 0.08, rise);

    // gavel: lowers in raised, strikes face-down at 0.9, springs back up
    const inK = smooth(range(u, 0.85, 0.875));
    const strike = ease.in(range(u, 0.882, 0.9));
    const rebound = ease.out(range(u, 0.9, 0.93));
    const angle = u < 0.9 ? lerp(-0.95, 0, strike) : lerp(0, -0.58, rebound);
    gavel.rotation.x = angle + Math.sin(t * 1.2) * 0.012 * rebound;
    gavelRoot.position.y = BLOCK_TOP + HEAD_H / 2 + (1 - inK) * 3;
    gavelRoot.visible = u > 0.845;
    if (u > 0.899 && !struck) { sound.knock(); struck = true; }
    if (u < 0.88) struck = false;
    const ring = range(u, 0.9, 0.95);
    shock.scale.setScalar(1 + ring * 6);
    shock.material.opacity = (1 - ring) * (u > 0.9 ? 0.7 : 0);
    floorMat.uniforms.uGlow.value = (1 - ring) * (u > 0.9 ? 1.5 : 0) + 0.2;

    // SODMUN V rises out of the block into the gap the rebound leaves
    const up = ease.out(range(u, 0.91, 0.975));
    word.visible = u > 0.905;
    word.position.set(0, lerp(BLOCK_TOP, 1.1, up), 0.35);
    word.scale.setScalar(lerp(0.2, 1, up));
    word.material.userData.uniforms.uRipple.value = 0.1 + (1 - up) * 2;

    tickMetal(metals, t);

    /* captions */
    const ch = u < 0.19 ? 0 : u < 0.38 ? 1 : u < 0.58 ? 2 : u < 0.77 ? 3 : 4;
    if (ch !== lastChapter) {
      chapters.forEach((li, i) => li.classList.toggle('is-active', i === ch));
      lastChapter = ch;
    }
    rail.style.transform = `scaleX(${u.toFixed(4)})`;

    renderer.render(scene, camera);
  };

  gsap.ticker.add(() => { if (active) render(performance.now()); });
  if (import.meta.env.DEV) window.__legacySeek = (x) => { target = x; p = x; active = true; };

  if (reduceMotion) { target = p = 1; active = true; render(performance.now()); active = false; return; }

  const st = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${window.innerHeight * (isTouch ? 9 : 11)}`,
    pin: '.legacy__stage',
    scrub: true,
    onUpdate: (st) => { target = st.progress; },
  });
  sceneControls(st, $('.legacy__stage', section), { seconds: 32, skipLabel: 'Skip scene' });
  // only draw while any of the section is on screen
  ScrollTrigger.create({ trigger: section, start: 'top bottom', end: 'bottom top', onToggle: (st) => { active = st.isActive; } });
}
