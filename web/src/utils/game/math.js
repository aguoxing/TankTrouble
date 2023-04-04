// export function checkCollision(rect1, rect2) {
//   // 获取两个矩形的顶点坐标
//   const rect1Vertices = getVertices(rect1);
//   const rect2Vertices = getVertices(rect2);

//   // 计算矩形的法向量
//   const axes = [
//     {x: rect1Vertices[1].x - rect1Vertices[0].x, y: rect1Vertices[1].y - rect1Vertices[0].y},
//     {x: rect1Vertices[1].x - rect1Vertices[2].x, y: rect1Vertices[1].y - rect1Vertices[2].y},
//     {x: rect2Vertices[0].x - rect2Vertices[3].x, y: rect2Vertices[0].y - rect2Vertices[3].y},
//     {x: rect2Vertices[0].x - rect2Vertices[1].x, y: rect2Vertices[0].y - rect2Vertices[1].y}
//   ];

//   // 遍历每个法向量，检测是否有分离
//   for (let i = 0; i < axes.length; i++) {
//     const projection1 = project(rect1Vertices, axes[i]);
//     const projection2 = project(rect2Vertices, axes[i]);

//     // 如果两个投影不重叠，则矩形不相交
//     if (projection1.min > projection2.max || projection2.min > projection1.max) {
//       return false;
//     }
//   }

//   // 如果所有的法向量都不分离，则矩形相交
//   return true;
// }

// // 获取矩形的顶点坐标
// function getVertices(rect) {
//   const cos = Math.cos(rect.angle);
//   const sin = Math.sin(rect.angle);
//   const x = rect.x;
//   const y = rect.y;
//   const width = rect.width;
//   const height = rect.height;

//   const vertices = [
//     {x: x - cos * width / 2 + sin * height / 2, y: y - sin * width / 2 - cos * height / 2},
//     {x: x + cos * width / 2 + sin * height / 2, y: y + sin * width / 2 - cos * height / 2},
//     {x: x + cos * width / 2 - sin * height / 2, y: y + sin * width / 2 + cos * height / 2},
//     {x: x - cos * width / 2 - sin * height / 2, y: y - sin * width / 2 + cos * height / 2}
//   ];

//   return vertices;
// }

// // 计算矩形在指定法向量上的投影
// function project(vertices, axis) {
//   let min = Number.MAX_VALUE;
//   let max = Number.MIN_VALUE;

//   for (let i = 0; i < vertices.length; i++) {
//     const dotProduct = vertices[i].x * axis.x + vertices[i].y * axis.y;

//     if (dotProduct < min) {
//       min = dotProduct;
//     }
//     if (dotProduct > max) {
//       max = dotProduct;
//     }
//   }

//   return {min: min, max: max};
// }
export function checkCollision (bigRect, smallRect) {
  // 获取大矩形的顶点坐标
  const bigRectVertices = getVertices(bigRect);

  // 遍历大矩形的每个边，检测小矩形是否与之相交
  for (let i = 0; i < bigRectVertices.length; i++) {
    const j = (i + 1) % bigRectVertices.length;
    const edge = { x: bigRectVertices[j].x - bigRectVertices[i].x, y: bigRectVertices[j].y - bigRectVertices[i].y };
    const normal = { x: -edge.y, y: edge.x };

    const projection1 = project(getVertices(smallRect), normal);
    const projection2 = project(bigRectVertices, normal);

    // 如果两个投影不重叠，则矩形不相交
    if (projection1.min > projection2.max || projection2.min > projection1.max) {
      return false;
    }
  }

  // 如果所有的边都不分离，则矩形相交
  return true;
}

// 获取矩形的顶点坐标
function getVertices (rect) {
  const cos = Math.cos(rect.angle);
  const sin = Math.sin(rect.angle);
  const x = rect.x;
  const y = rect.y;
  const width = rect.width;
  const height = rect.height;

  const vertices = [
    { x: x - cos * width / 2 + sin * height / 2, y: y - sin * width / 2 - cos * height / 2 },
    { x: x + cos * width / 2 + sin * height / 2, y: y + sin * width / 2 - cos * height / 2 },
    { x: x + cos * width / 2 - sin * height / 2, y: y + sin * width / 2 + cos * height / 2 },
    { x: x - cos * width / 2 - sin * height / 2, y: y - sin * width / 2 + cos * height / 2 }
  ];

  return vertices;
}

// 计算矩形在指定法向量上的投影
function project (vertices, axis) {
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;

  for (let i = 0; i < vertices.length; i++) {
    const dotProduct = vertices[i].x * axis.x + vertices[i].y * axis.y;

    if (dotProduct < min) {
      min = dotProduct;
    }
    if (dotProduct > max) {
      max = dotProduct;
    }
  }

  return { min: min, max: max };
}

export function rectLineCollision (rect, line) {
  // 计算矩形的四条边
  const rectEdges = [
    [{ x: rect.x, y: rect.y }, { x: rect.x + rect.width, y: rect.y }],
    [{ x: rect.x + rect.width, y: rect.y }, { x: rect.x + rect.width, y: rect.y + rect.height }],
    [{ x: rect.x + rect.width, y: rect.y + rect.height }, { x: rect.x, y: rect.y + rect.height }],
    [{ x: rect.x, y: rect.y + rect.height }, { x: rect.x, y: rect.y }],
  ];

  // 检测每个边是否和给定的线段相交
  for (const edge of rectEdges) {
    if (lineIntersect(edge[0], edge[1], line[0], line[1])) {
      return true;
    }
  }

  // 所有边都不相交，说明矩形和线没有碰撞
  return false;
}



export function checkCollision2 (rect1, rect2) {
  // 计算第一个矩形的四个顶点坐标
  const rect1Vertices = [
    { x: rect1.x, y: rect1.y },
    { x: rect1.x + rect1.width, y: rect1.y },
    { x: rect1.x, y: rect1.y + rect1.height },
    { x: rect1.x + rect1.width, y: rect1.y + rect1.height },
  ];

  // 计算第二个矩形的四个顶点坐标
  const rect2Vertices = [
    { x: rect2.x, y: rect2.y },
    { x: rect2.x + rect2.width, y: rect2.y },
    { x: rect2.x, y: rect2.y + rect2.height },
    { x: rect2.x + rect2.width, y: rect2.y + rect2.height },
  ];

  // 将第一个矩形的坐标系变换为以第二个矩形为基准的坐标系
  const angle = rect1.angle - rect2.angle;
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const rect1VerticesTransformed = rect1Vertices.map((v) => {
    return {
      x: (v.x - rect2.x) * cosAngle - (v.y - rect2.y) * sinAngle + rect2.x,
      y: (v.x - rect2.x) * sinAngle + (v.y - rect2.y) * cosAngle + rect2.y,
    };
  });

  // 检查每个顶点是否在第二个矩形内部
  for (let i = 0; i < rect1VerticesTransformed.length; i++) {
    if (
      rect1VerticesTransformed[i].x < rect2.x ||
      rect1VerticesTransformed[i].x > rect2.x + rect2.width ||
      rect1VerticesTransformed[i].y < rect2.y ||
      rect1VerticesTransformed[i].y > rect2.y + rect2.height
    ) {
      return false;
    }
  }

  // 将第二个矩形的坐标系变换为以第一个矩形为基准的坐标系
  const angle2 = -angle;
  const cosAngle2 = Math.cos(angle2);
  const sinAngle2 = Math.sin(angle2);
  const rect2VerticesTransformed = rect2Vertices.map((v) => {
    return {
      x: (v.x - rect1.x) * cosAngle2 - (v.y - rect1.y) * sinAngle2 + rect1.x,
      y: (v.x - rect1.x) * sinAngle2 + (v.y - rect1.y) * cosAngle2 + rect1.y,
    };
  });

  // 检查每个顶点是否在第一个矩形内部
  for (let i = 0; i < rect2VerticesTransformed.length; i++) {
    if (
      rect2VerticesTransformed[i].x > rect1.x + rect1.width ||
      rect2VerticesTransformed[i].y < rect1.y ||
      rect2VerticesTransformed[i].y > rect1.y + rect1.height
    ) {
      return false;
    }
  }

  // 如果两个矩形的任意两个边都没有交点，则认为它们没有碰撞
  for (let i = 0; i < rect1VerticesTransformed.length; i++) {
    const j = (i + 1) % rect1VerticesTransformed.length;
    for (let k = 0; k < rect2VerticesTransformed.length; k++) {
      const l = (k + 1) % rect2VerticesTransformed.length;
      if (
        lineIntersect(
          rect1VerticesTransformed[i],
          rect1VerticesTransformed[j],
          rect2VerticesTransformed[k],
          rect2VerticesTransformed[l]
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

// 计算两条线段是否相交的辅助函数
function lineIntersect (a, b, c, d) {
  const den = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);
  if (den === 0) {
    return false;
  }
  const ua =
    ((d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x)) / den;
  const ub =
    ((b.x - a.x) * (a.y - c.y) - (b.y - a.y) * (a.x - c.x)) / den;
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }
  return true;
}




