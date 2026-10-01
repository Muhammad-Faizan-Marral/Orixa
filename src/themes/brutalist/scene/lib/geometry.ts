import { BufferGeometry, Matrix4, Vector3 } from "three";

/**
 * Purane three (r86) me `geometry.vertices[i].y -= 10` hota tha. Modern BufferGeometry me
 * index ki jagah position rule se vertices badalte hain (faces ke vertices duplicate hote hain).
 */
export function reshape(geom: BufferGeometry, fn: (v: Vector3) => void): BufferGeometry {
  const pos = geom.getAttribute("position");
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    fn(v);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geom.computeVertexNormals();
  geom.computeBoundingSphere();
  return geom;
}

export const mul = (a: Matrix4, b: Matrix4) => new Matrix4().multiplyMatrices(a, b);