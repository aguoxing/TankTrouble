// import { Vec } from '@/types/game/tank'

// function checkRectRectCollision(angle1: number, center1: Vec, W1: number, H1: number, angle2: number, center2: Vec, W2: number, H2: number): boolean {
//   const units1: [Vec, Vec] = getUnitVectors(angle1)
//   const units2: [Vec, Vec] = getUnitVectors(angle2)
//   const axis1: Vec = units1[0]
//   const axis2: Vec = units1[1]
//   const axis3: Vec = units2[0]
//   const axis4: Vec = units2[1]
//   const v: Vec = center1.subtract(center2)
//   let projV: number = Math.abs(v.dot(axis1))
//   let projRadius: number = (Math.abs(axis3.dot(axis1)) * H2) / 2 + (Math.abs(axis4.dot(axis1)) * W2) / 2
//   if (projRadius + H1 / 2 <= projV) return false
//   projV = Math.abs(v.dot(axis2))
//   projRadius = (Math.abs(axis3.dot(axis2)) * H2) / 2 + (Math.abs(axis4.dot(axis2)) * W2) / 2
//   if (projRadius + W1 / 2 <= projV) return false

//   projV = Math.abs(v.dot(axis3))
//   projRadius = (Math.abs(axis1.dot(axis3)) * H1) / 2 + (Math.abs(axis2.dot(axis3)) * W1) / 2
//   if (projRadius + H2 / 2 <= projV) return false
//   projV = Math.abs(v.dot(axis4))
//   projRadius = (Math.abs(axis1.dot(axis4)) * H1) / 2 + (Math.abs(axis2.dot(axis4)) * W1) / 2
//   if (projRadius + W2 / 2 <= projV) return false
//   return true
// }

export function deg2Rad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function rad2deg(rad: number): number {
  return (rad * 180) / Math.PI
}

// function getUnitVectors(angleDeg: number): Vec[] {
//   const angleRad = deg2Rad(angleDeg)
//   const v1: Vec = { x: Math.cos(angleRad), y: -Math.sin(angleRad) }
//   const v2: Vec = { x: Math.sin(angleRad), y: Math.cos(angleRad) }
//   return [v1, v2]
// }

export function generateRandomCode(num: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < num; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters[randomIndex]
  }
  return code
}
