/* ------------------------------------------------------------------
   People for the legacy film. One unit ≈ 1.75 m; feet at y = 0.
   crowdGeometry(): a still figure merged into one geometry (instanced).
   debater():       the same body with jointed arms, head and torso.
------------------------------------------------------------------- */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const SHOULDER = { x: 0.15, y: 0.8 };
// arms end mid-thigh, as real arms do (they were reaching the knees)
const UPPER = 0.17;
const FORE = 0.145;

const tube = (rTop, rBottom, h, y, x = 0, z = 0) => new THREE.CylinderGeometry(rTop, rBottom, h, 14).translate(x, y, z);
const ball = (r, x, y, z = 0, sx = 1, sy = 1, sz = 1) => new THREE.SphereGeometry(r, 18, 14).scale(sx, sy, sz).translate(x, y, z);

/** Jacket-and-trousers silhouette: chest wider than waist, flattened front to back. */
function torsoGeometry() {
  const profile = [[0, 0.5], [0.1, 0.505], [0.112, 0.55], [0.108, 0.62], [0.122, 0.7], [0.142, 0.77], [0.152, 0.805], [0.128, 0.84], [0.055, 0.857], [0, 0.86]]
    .map(([r, y]) => new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(profile, 24).scale(1, 1, 0.62);
}

function legGeometry(x) {
  return mergeGeometries([
    tube(0.052, 0.042, 0.27, 0.385, x), // thigh
    ball(0.042, x, 0.255), // knee
    tube(0.04, 0.032, 0.23, 0.14, x), // shin
    new THREE.CapsuleGeometry(0.03, 0.07, 4, 8).rotateX(Math.PI / 2).scale(1.15, 0.8, 1).translate(x, 0.024, 0.025), // shoe
  ]);
}

function headGeometry() {
  return mergeGeometries([
    tube(0.028, 0.032, 0.06, 0.885), // neck
    ball(0.064, 0, 0.962, 0.004, 0.92, 1.12, 1), // head
  ]);
}

const hairGeometry = () => new THREE.SphereGeometry(0.067, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42).scale(0.94, 1.1, 1.02).rotateX(-0.35).translate(0, 0.966, -0.004);

function armGeometry(side) {
  // hanging straight, very slightly away from the body
  const x = side * SHOULDER.x;
  const tilt = side * 0.06;
  return mergeGeometries([
    ball(0.042, x, SHOULDER.y - 0.01),
    tube(0.036, 0.03, UPPER, SHOULDER.y - UPPER / 2 - 0.02, x),
    tube(0.03, 0.024, FORE, SHOULDER.y - UPPER - FORE / 2 - 0.03, x),
    ball(0.024, x, SHOULDER.y - UPPER - FORE - 0.06, 0, 0.75, 1.15, 0.55),
  ]).rotateZ(tilt);
}

/** Everything in one geometry, for the instanced crowd. */
export function crowdGeometry() {
  return mergeGeometries([
    legGeometry(-0.058), legGeometry(0.058),
    torsoGeometry(), headGeometry(), hairGeometry(),
    armGeometry(-1), armGeometry(1),
  ]);
}

/**
 * A clean, jointed mannequin in one finish: smooth capsules and ball joints.
 * userData: { torso, head, shoulders: [l, r], elbows: [l, r] }
 */
export function debater(mat) {
  const cap = (r, len) => new THREE.CapsuleGeometry(r, len, 8, 20);
  const joint = (r) => new THREE.SphereGeometry(r, 20, 14);
  const g = new THREE.Group();
  // legs and hips (still)
  const legs = [];
  [-1, 1].forEach((side) => {
    const x = side * 0.06;
    legs.push(
      cap(0.048, 0.2).translate(x, 0.385, 0),
      joint(0.043).translate(x, 0.27, 0),
      cap(0.038, 0.19).translate(x, 0.155, 0),
      cap(0.03, 0.06).rotateX(Math.PI / 2).translate(x, 0.03, 0.02),
    );
  });
  legs.push(joint(0.1).scale(1.25, 0.7, 0.85).translate(0, 0.5, 0));
  g.add(new THREE.Mesh(mergeGeometries(legs), mat));
  // torso pivots at the waist
  const torso = new THREE.Group();
  torso.position.y = 0.52;
  g.add(torso);
  torso.add(new THREE.Mesh(mergeGeometries([
    cap(0.085, 0.08).translate(0, 0.07, 0), // waist
    cap(0.115, 0.13).scale(1.25, 1, 0.78).translate(0, 0.2, 0), // chest
    cap(0.028, 0.03).translate(0, 0.33, 0), // neck
  ]), mat));
  const head = new THREE.Group();
  head.position.y = 0.36;
  head.add(new THREE.Mesh(joint(0.066).scale(0.9, 1.18, 0.98).translate(0, 0.07, 0.005), mat));
  torso.add(head);
  const shoulders = [];
  const elbows = [];
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.155, 0.27, 0);
    shoulder.add(new THREE.Mesh(joint(0.04), mat));
    shoulder.add(new THREE.Mesh(cap(0.033, 0.13).translate(0, -0.09, 0), mat));
    const elbow = new THREE.Group();
    elbow.position.y = -0.175;
    elbow.add(new THREE.Mesh(joint(0.03), mat));
    elbow.add(new THREE.Mesh(cap(0.027, 0.11).translate(0, -0.075, 0), mat));
    elbow.add(new THREE.Mesh(joint(0.026).scale(0.8, 1.25, 0.6).translate(0, -0.165, 0), mat)); // hand
    shoulder.add(elbow);
    torso.add(shoulder);
    shoulders.push(shoulder);
    elbows.push(elbow);
  });
  g.userData = { torso, head, shoulders, elbows };
  return g;
}

/**
 * Pose a debater mid-argument at a lectern. k is how heated it is (0..1).
 * One hand rests on the lectern; the other gestures from the elbow,
 * the way people actually argue a point.
 */
export function argue(d, t, k, seed = 0) {
  const { torso, head, shoulders, elbows } = d.userData;
  const beat = Math.sin(t * 5.2 + seed * 2.1);
  const jab = Math.max(0, Math.sin(t * 3.4 + seed));
  torso.rotation.x = k * (0.09 + 0.04 * jab); // leaning over the lectern
  torso.rotation.y = k * 0.1 * Math.sin(t * 1.3 + seed);
  head.rotation.x = k * (-0.08 + 0.06 * Math.sin(t * 6 + seed));
  head.rotation.y = k * 0.12 * Math.sin(t * 0.9 + seed);
  // resting hand on the lectern
  shoulders[0].rotation.x = -k * 0.55;
  shoulders[0].rotation.z = -k * 0.12;
  elbows[0].rotation.x = -k * 0.75;
  // gesturing hand: elbow bent, forearm up, beating out the point
  shoulders[1].rotation.x = -k * (0.7 + 0.25 * jab);
  shoulders[1].rotation.z = k * 0.2;
  elbows[1].rotation.x = -k * (1.35 + 0.35 * beat);
}
