interface Vec2 {
  x: number
  y: number
}

interface Rect {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

interface Circle {
  x: number
  y: number
  radius: number
}
interface OBB {
  center: [number, number];
  halfExtents: [number, number];
  rotation: number;
}

interface AABB {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
