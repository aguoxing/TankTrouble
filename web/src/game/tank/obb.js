// 创建 OBB 类
class OBB {
  constructor(x, y, w, h, angle) {
    this.x = x // 中心点 x 坐标
    this.y = y // 中心点 y 坐标
    this.w = w // 宽度
    this.h = h // 高度
    this.angle = angle // 旋转角度
    this.halfWidth = w / 2
    this.halfHeight = h / 2
  }

  // 检查是否与另一个 OBB 相交
  isIntersecting(other) {
    // 将每个 OBB 视为矩形，并旋转回原始方向
    const thisRect = this.toRect()
    const otherRect = other.toRect()

    // 检查矩形是否相交
    if (
      thisRect.x + thisRect.w < otherRect.x ||
      otherRect.x + otherRect.w < thisRect.x ||
      thisRect.y + thisRect.h < otherRect.y ||
      otherRect.y + otherRect.h < thisRect.y
    ) {
      return false
    }

    // 旋转 OBB，使其对齐并检查是否相交
    const thisVertices = this.getVertices()
    const otherVertices = other.getVertices()
    return this.checkVerticesOverlap(thisVertices, otherVertices) || this.checkVerticesOverlap(otherVertices, thisVertices)
  }

  // 将 OBB 转换为矩形，以便进行相交检测
  toRect() {
    const angle = -this.angle // 取反以旋转回原始方向
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x1 = this.x + cos * -this.halfWidth - sin * -this.halfHeight
    const y1 = this.y + sin * -this.halfWidth + cos * -this.halfHeight
    const x2 = this.x + cos * this.halfWidth - sin * -this.halfHeight
    const y2 = this.y + sin * this.halfWidth + cos * -this.halfHeight
    const x3 = this.x + cos * this.halfWidth - sin * this.halfHeight
    const y3 = this.y + sin * this.halfWidth + cos * this.halfHeight
    const x4 = this.x + cos * -this.halfWidth - sin * this.halfHeight
    const y4 = this.y + sin * -this.halfWidth + cos * this.halfHeight
    const minX = Math.min(x1, x2, x3, x4)
    const maxX = Math.max(x1, x2, x3, x4)
    const minY = Math.min(y1, y2, y3, y4)
    const maxY = Math.max(y1, y2, y3, y4)
    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY
    }
  }

  // 获取 OBB 的顶点，以便进行相交检测
  getVertices() {
    const angle = -this.angle // 取反以旋
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x1 = this.x + cos * -this.halfWidth - sin * -this.halfHeight
    const y1 = this.y + sin * -this.halfWidth + cos * -this.halfHeight
    const x2 = this.x + cos * this.halfWidth - sin * -this.halfHeight
    const y2 = this.y + sin * this.halfWidth + cos * -this.halfHeight
    const x3 = this.x + cos * this.halfWidth - sin * this.halfHeight
    const y3 = this.y + sin * this.halfWidth + cos * this.halfHeight
    const x4 = this.x + cos * -this.halfWidth - sin * this.halfHeight
    const y4 = this.y + sin * -this.halfWidth + cos * this.halfHeight
    return [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x3, y: y3 },
      { x: x4, y: y4 }
    ]
  }

  // 检查两个顶点集合是否相交
  checkVerticesOverlap(vertices1, vertices2) {
    for (let i = 0; i < vertices1.length; i++) {
      const vertex1 = vertices1[i]
      const vertex2 = vertices1[(i + 1) % vertices1.length]
      const edge = { x: vertex2.x - vertex1.x, y: vertex2.y - vertex1.y }
      const perpendicular = { x: -edge.y, y: edge.x }
      const projection1 = this.projectVertices(vertices1, perpendicular)
      const projection2 = this.projectVertices(vertices2, perpendicular)
      if (projection1.max < projection2.min || projection2.max < projection1.min) {
        return false
      }
    }
    return true
  }

  // 在给定轴上，返回顶点集合的投影
  projectVertices(vertices, axis) {
    let min = Infinity
    let max = -Infinity
    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i]
      const dotProduct = vertex.x * axis.x + vertex.y * axis.y
      if (dotProduct < min) {
        min = dotProduct
      }
      if (dotProduct > max) {
        max = dotProduct
      }
    }
    return { min, max }
  }
}

export default OBB
