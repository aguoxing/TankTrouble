type Wall = {
  x: number
  y: number
  direction: 'top' | 'right' | 'bottom' | 'left'
}

type Cell = {
  x: number
  y: number
  visited: boolean
}

function generateMaze(width: number, height: number): Cell[][] {
  // Initialize cells with all walls intact and not visited
  const cells: Cell[][] = []
  for (let y = 0; y < height; y++) {
    const row: Cell[] = []
    for (let x = 0; x < width; x++) {
      row.push({ x, y, visited: false })
    }
    cells.push(row)
  }

  // Start with a random cell
  const startCell = cells[Math.floor(Math.random() * height)][Math.floor(Math.random() * width)]
  startCell.visited = true

  // Initialize frontier with neighbors of starting cell
  const frontier: Cell[] = getNeighbors(startCell).filter(cell => !cell.visited)

  // Initialize walls
  const walls: Wall[] = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < width - 1) {
        walls.push({ x, y, direction: 'right' })
      }
      if (y < height - 1) {
        walls.push({ x, y, direction: 'bottom' })
      }
    }
  }

  while (frontier.length > 0) {
    // Pick a random frontier cell and mark it as visited
    const frontierIndex = Math.floor(Math.random() * frontier.length)
    const currentCell = frontier[frontierIndex]
    currentCell.visited = true

    // Remove walls between current cell and visited neighbors
    const neighbors = getNeighbors(currentCell).filter(cell => cell.visited)
    for (const neighbor of neighbors) {
      const dx = neighbor.x - currentCell.x
      const dy = neighbor.y - currentCell.y
      if (dx === 1) {
        const wallIndex = walls.findIndex(wall => wall.x === currentCell.x && wall.y === currentCell.y && wall.direction === 'right')
        walls.splice(wallIndex, 1)
      } else if (dx === -1) {
        const wallIndex = walls.findIndex(wall => wall.x === neighbor.x && wall.y === neighbor.y && wall.direction === 'right')
        walls.splice(wallIndex, 1)
      } else if (dy === 1) {
        const wallIndex = walls.findIndex(wall => wall.x === currentCell.x && wall.y === currentCell.y && wall.direction === 'bottom')
        walls.splice(wallIndex, 1)
      } else if (dy === -1) {
        const wallIndex = walls.findIndex(wall => wall.x === neighbor.x && wall.y === neighbor.y && wall.direction === 'bottom')
        walls.splice(wallIndex, 1)
      }
    }

    // Add unvisited neighbors to the frontier
    const unvisitedNeighbors = getNeighbors(currentCell).filter(cell => !cell.visited)
    frontier.splice(frontierIndex, 1, ...unvisitedNeighbors)
  }

  return cells

  // Helper function to get the neighbors of a cell
  function getNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = []
    if (cell.x > 0) {
      neighbors.push(cells[cell.y][cell.x - 1])
    }
    if (cell.y > 0) {
      neighbors.push(cells[cell.y - 1][cell.x])
    }
    if (cell.x < width - 1) {
      neighbors.push(cells[cell.y][cell.x + 1])
    }
    if (cell.y < height - 1) {
      neighbors.push(cells[cell.y + 1][cell.x])
    }
    return neighbors
  }
}
