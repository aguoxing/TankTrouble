export function generatePrimMaze(width, height, cellSize) {
  const rows = Math.floor(height / cellSize)
  const cols = Math.floor(width / cellSize)
  const grid = createPrimGrid(rows, cols, cellSize)

  const startRow = Math.floor(Math.random() * rows)
  const startCol = Math.floor(Math.random() * cols)
  const startCell = grid[startRow][startCol]
  startCell.visited = true

  const walls = []
  addWalls(grid, startCell, walls)

  while (walls.length > 0) {
    const randomIndex = Math.floor(Math.random() * walls.length)
    const wall = walls[randomIndex]

    const cell1 = wall.cell1
    const cell2 = wall.cell2

    if (cell1.visited && !cell2.visited) {
      removeWall(cell1, cell2)
      cell2.visited = true
      addWalls(grid, cell2, walls)
    } else if (!cell1.visited && cell2.visited) {
      removeWall(cell2, cell1)
      cell1.visited = true
      addWalls(grid, cell1, walls)
    }

    walls.splice(randomIndex, 1)
  }

  return grid
}

function createPrimGrid(rows, cols, cellSize) {
  const grid = []

  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      row.push({
        row: i,
        col: j,
        x: j * cellSize,
        y: i * cellSize,
        visited: false,
        walls: {
          top: true,
          right: true,
          bottom: true,
          left: true
        }
      })
    }
    grid.push(row)
  }

  return grid
}

function addWalls(grid, cell, walls) {
  const row = cell.row
  const col = cell.col

  if (row > 0) {
    walls.push({
      cell1: cell,
      cell2: grid[row - 1][col],
      direction: 'top'
    })
  }

  if (col < grid[0].length - 1) {
    walls.push({
      cell1: cell,
      cell2: grid[row][col + 1],
      direction: 'right'
    })
  }

  if (row < grid.length - 1) {
    walls.push({
      cell1: cell,
      cell2: grid[row + 1][col],
      direction: 'bottom'
    })
  }

  if (col > 0) {
    walls.push({
      cell1: cell,
      cell2: grid[row][col - 1],
      direction: 'left'
    })
  }
}

function removeWall(cell1, cell2) {
  const rowDiff = cell1.row - cell2.row
  const colDiff = cell1.col - cell2.col

  if (rowDiff === 1) {
    cell1.walls.top = false
    cell2.walls.bottom = false
  } else if (rowDiff === -1) {
    cell1.walls.bottom = false
    cell2.walls.top = false
  }

  if (colDiff === 1) {
    cell1.walls.left = false
    cell2.walls.right = false
  } else if (colDiff === -1) {
    cell1.walls.right = false
    cell2.walls.left = false
  }
}

//===========================================================================//

export function generateDfsMaze(width, height, cellSize) {
  const rows = Math.floor(height / cellSize)
  const cols = Math.floor(width / cellSize)
  const grid = createDfsGrid(rows, cols)

  // dfs(0, 0, grid,rows,cols);
  dfs2(0, 0, grid)

  return grid
}

function dfs(row, col, grid, rows, cols) {
  const directions = shuffle([
    [0, -1, 'top', 'bottom'],
    [1, 0, 'right', 'left'],
    [0, 1, 'bottom', 'top'],
    [-1, 0, 'left', 'right']
  ])
  for (let [dx, dy, direction, opposite] of directions) {
    const newRow = row + dy
    const newCol = col + dx
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !grid[newRow][newCol].visited) {
      grid[row][col][direction + 'Wall'] = false
      grid[newRow][newCol][opposite + 'Wall'] = false
      grid[newRow][newCol].visited = true
      dfs(newRow, newCol, grid, rows, cols)
    }
  }
}

function dfs2(row, col, grid) {
  grid[row][col].visited = true

  const directions = shuffle([
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1]
  ])

  for (let i = 0; i < directions.length; i++) {
    const [dx, dy] = directions[i]
    const newRow = row + dx
    const newCol = col + dy

    if (newRow < 0 || newRow >= grid.length || newCol < 0 || newCol >= grid[0].length || grid[newRow][newCol].visited) {
      continue
    }

    if (dx === -1) {
      grid[row][col].topWall = false
      grid[newRow][newCol].bottomWall = false
    } else if (dy === 1) {
      grid[row][col].rightWall = false
      grid[newRow][newCol].leftWall = false
    } else if (dx === 1) {
      grid[row][col].bottomWall = false
      grid[newRow][newCol].topWall = false
    } else if (dy === -1) {
      grid[row][col].leftWall = false
      grid[newRow][newCol].rightWall = false
    }

    dfs2(newRow, newCol, grid)
  }
}

function createDfsGrid(rows, cols) {
  const grid = []
  for (let i = 0; i < rows; i++) {
    const rowArray = []
    for (let j = 0; j < cols; j++) {
      rowArray.push({
        visited: false,
        topWall: true,
        rightWall: true,
        bottomWall: true,
        leftWall: true
      })
    }
    grid.push(rowArray)
  }
  return grid
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
