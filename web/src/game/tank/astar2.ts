export function astar2(start: GridCell, end: GridCell, grid: Grid): GridCell[] {
  const openSet: GridCell[] = [start]
  const closedSet: GridCell[] = []
  start.g = 0
  start.h = heuristic(start, end)
  start.f = start.g + start.h

  while (openSet.length > 0) {
    // Find the node with the lowest f value
    const current = openSet.reduce((a, b) => (b.f < a.f ? b : a))
    console.log(current)

    if (current === end) {
      // Reconstruct the path
      const path: GridCell[] = [current]
      while (path[0].parent) {
        path.unshift(path[0].parent)
      }
      return path
    }

    openSet.splice(openSet.indexOf(current), 1)
    closedSet.push(current)

    // Check each neighbor
    const neighbors = getNeighbors(current, grid)
    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor)) {
        continue
      }

      const tentativeGScore = current.g + distance(current, neighbor)
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor)
      } else if (tentativeGScore >= neighbor.g) {
        continue
      }

      neighbor.parent = current
      neighbor.g = tentativeGScore
      neighbor.h = heuristic(neighbor, end)
      neighbor.f = neighbor.g + neighbor.h
    }
  }

  // No path found
  return []
}

function heuristic(a: GridCell, b: GridCell): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function distance(a: GridCell, b: GridCell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function getNeighbors(cell: GridCell, grid: Grid): GridCell[] {
  const neighbors: GridCell[] = []
  const { x, y } = cell

  const width = grid[0].length
  const height = grid.length

  if (y > 0 && !cell.walls.top) {
    neighbors.push(grid[y - 1][x])
  }
  if (y < height - 1 && !cell.walls.bottom) {
    neighbors.push(grid[y + 1][x])
  }
  if (x > 0 && !cell.walls.left) {
    neighbors.push(grid[y][x - 1])
  }
  if (x < width - 1 && !cell.walls.right) {
    neighbors.push(grid[y][x + 1])
  }

  return neighbors
}
