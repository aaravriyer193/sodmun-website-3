/* ------------------------------------------------------------------
   3D geometry for the brand: the traced logo and Zarathustra type.
------------------------------------------------------------------- */
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import LOGO from '../data/logo-paths.json';
import TYPE from '../data/type-paths.json';

const area = (pts) => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  }
  return a / 2;
};

const inside = ([x, y], pts) => {
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};

/** Even-odd polygons → shapes with holes. */
function polysToShapes(polys) {
  const items = polys.map((pts) => ({ pts, a: Math.abs(area(pts)) })).sort((a, b) => b.a - a.a);
  items.forEach((it, i) => {
    it.parents = items.slice(0, i).filter((o) => inside(it.pts[0], o.pts));
    it.depth = it.parents.length;
  });
  const shapes = new Map();
  items.forEach((it) => {
    const v = it.pts.map(([x, y]) => new THREE.Vector2(x, y));
    if (it.depth % 2 === 0) {
      if (THREE.ShapeUtils.isClockWise(v)) v.reverse();
      shapes.set(it, new THREE.Shape(v));
    } else {
      const parent = it.parents[it.parents.length - 1];
      if (!THREE.ShapeUtils.isClockWise(v)) v.reverse();
      shapes.get(parent)?.holes.push(new THREE.Path(v));
    }
  });
  return [...shapes.values()];
}

const extrude = (shapes, depth, bevel, curveSegments = 6) => new THREE.ExtrudeGeometry(shapes, {
  depth, curveSegments, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.7, bevelSegments: 3,
});

/** The logo as two meshes' worth of geometry (ring + globe), 2 units across. */
export function logoGeometry({ depth = 0.14, bevel = 0.012, centred = true } = {}) {
  const ring = extrude(polysToShapes(LOGO.ring), depth, bevel);
  const globe = extrude(polysToShapes(LOGO.globe), depth * 0.8, bevel);
  if (centred) [ring, globe].forEach((g) => g.translate(0, 0, -depth / 2));
  return { ring, globe };
}

/** Extruded Zarathustra word, centred, `width` units wide. */
export function typeGeometry(key, { width = 4, depth = 0.25, bevel = 0.02, segments = 10 } = {}) {
  const { d, box } = TYPE[key];
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const s = width / (box[2] - box[0]);
  const geo = extrude(shapes, depth / s, bevel / s, segments);
  geo.scale(s, s, s);
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  geo.translate(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, -(bb.min.z + bb.max.z) / 2);
  return geo;
}

/**
 * "SODMUN V" as one geometry per letter, extruded from z = 0 to `depth`,
 * centred on the word. Returns [{ geo, box: [x0, y0, x1, y1] }].
 */
export function letterGeometries({ width = 6.4, depth = 1, bevel = 0.012 } = {}) {
  const [bx0, by0, bx1, by1] = TYPE.five.box;
  const s = width / (bx1 - bx0);
  const cx = (bx0 + bx1) / 2;
  const cy = (by0 + by1) / 2;
  const loader = new SVGLoader();
  return TYPE.letters.map(({ d, box }) => {
    const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`);
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const geo = extrude(shapes, depth / s, bevel / s, 10);
    geo.translate(-cx, -cy, 0);
    geo.scale(s, s, s);
    return { geo, box: [(box[0] - cx) * s, (box[1] - cy) * s, (box[2] - cx) * s, (box[3] - cy) * s] };
  });
}

export { mergeGeometries };
