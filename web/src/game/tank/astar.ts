// x：节点在网格中的横坐标
// y：节点在网格中的纵坐标
// f：节点的评估函数值，即 f = g + h
// g：从起点到该节点的实际代价（距离）
// h：从该节点到终点的估计代价（距离）
// parent：指向从起点到达该节点的路径上的前一个节点
export function astar(start: GridNode, end: GridNode, grid: Grid): GridNode[] | null {
  const openList: GridNode[] = [start]
  const closedList: GridNode[] = []

  while (openList.length > 0) {
    // Find the node with the lowest f value
    let current: GridNode = openList[0]
    let currentIndex = 0
    for (let i = 1; i < openList.length; i++) {
      if (openList[i].f < current.f) {
        current = openList[i]
        currentIndex = i
      }
    }

    // Remove the current node from the open list and add it to the closed list
    openList.splice(currentIndex, 1)
    closedList.push(current)

    // If we have reached the end node, return the path
    if (current.x === end.x && current.y === end.y) {
      const path: GridNode[] = []
      let currentNode: GridNode | undefined = current
      while (currentNode) {
        path.unshift(currentNode)
        currentNode = currentNode.parent
      }
      return path
    }

    // Generate the neighbors of the current node
    const neighbors: GridNode[] = []
    const { x, y } = current

    if (!grid[x]?.walls?.top) {
      neighbors.push({ x, y: y - 1, f: 0, g: 0, h: 0, parent: current })
    }
    if (!grid[x]?.walls?.bottom) {
      neighbors.push({ x, y: y + 1, f: 0, g: 0, h: 0, parent: current })
    }
    if (!grid[x]?.walls?.left) {
      neighbors.push({ x: x - 1, y, f: 0, g: 0, h: 0, parent: current })
    }
    if (!grid[x]?.walls?.right) {
      neighbors.push({ x: x + 1, y, f: 0, g: 0, h: 0, parent: current })
    }

    // Calculate the f, g, and h values for each neighbor
    for (const neighbor of neighbors) {
      if (closedList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
        continue
      }

      neighbor.g = current.g + 1
      neighbor.h = Math.abs(neighbor.x - end.x) + Math.abs(neighbor.y - end.y)
      neighbor.f = neighbor.g + neighbor.h

      if (openList.find(node => node.x === neighbor.x && node.y === neighbor.y)) {
        const openNode = openList.find(node => node.x === neighbor.x && node.y === neighbor.y)
        if (openNode && neighbor.g < openNode.g) {
          openNode.parent = current
          openNode.g = neighbor.g
          openNode.f = neighbor.f
        }
      } else {
        openList.push(neighbor)
      }
    }
  }

  return null
}

// const startNode: GridNode = { x: 0, y: 0, f: 0, g: 0, h: 0 }
// const endNode: GridNode = { x: 3, y: 3, f: 0, g: 0, h: 0 }

// const path = astar(startNode, endNode, grid)

// if (path) {
//   console.log('Path found:')
//   for (const node of path) {
//     console.log(`(${node.x}, ${node.y})`)
//   }
// } else {
//   console.log('No path found.')
// }
