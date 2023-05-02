export function generateMaze11(width, height) {
  const grid = []
  for (let i = 0; i < height; i++) {
    const row = []
    for (let j = 0; j < width; j++) {
      row.push({
        x: j,
        y: i,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false
      })
    }
    grid.push(row)
  }

  const startCell = grid[0][0]
  startCell.visited = true

  const frontier = [startCell]

  while (frontier.length > 0) {
    const current = frontier.pop()

    const neighbors = getNeighbors(grid, current)
    const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)]

    if (neighbor) {
      removeWalls(current, neighbor)
      neighbor.visited = true
      frontier.push(neighbor)
    }
  }

  return grid
}

function getNeighbors(grid, cell) {
  const { x, y } = cell
  const neighbors = []

  if (y > 0 && !grid[y - 1][x].visited) {
    neighbors.push(grid[y - 1][x])
  }

  if (x < grid[y].length - 1 && !grid[y][x + 1].visited) {
    neighbors.push(grid[y][x + 1])
  }

  if (y < grid.length - 1 && !grid[y + 1][x].visited) {
    neighbors.push(grid[y + 1][x])
  }

  if (x > 0 && !grid[y][x - 1].visited) {
    neighbors.push(grid[y][x - 1])
  }

  return neighbors
}

function removeWalls(cell1, cell2) {
  const xDiff = cell1.x - cell2.x
  const yDiff = cell1.y - cell2.y

  if (xDiff === 1) {
    cell1.walls.left = false
    cell2.walls.right = false
  } else if (xDiff === -1) {
    cell1.walls.right = false
    cell2.walls.left = false
  }

  if (yDiff === 1) {
    cell1.walls.top = false
    cell2.walls.bottom = false
  } else if (yDiff === -1) {
    cell1.walls.bottom = false
    cell2.walls.top = false
  }
}

// ====================================
export function generateMazeMatrix(width, height) {
  const matrix = []
  for (let y = 0; y < height; y++) {
    const row = []
    for (let x = 0; x < width; x++) {
      row.push(0)
    }
    matrix.push(row)
  }

  const startX = Math.floor(Math.random() * width)
  const startY = Math.floor(Math.random() * height)
  const stack = [[startX, startY]]

  while (stack.length > 0) {
    const current = stack.pop()
    const x = current[0]
    const y = current[1]

    if (matrix[y][x] === 1) {
      continue
    }

    matrix[y][x] = 1

    const neighbors = []
    if (x > 1) {
      neighbors.push([x - 2, y])
    }
    if (y > 1) {
      neighbors.push([x, y - 2])
    }
    if (x < width - 2) {
      neighbors.push([x + 2, y])
    }
    if (y < height - 2) {
      neighbors.push([x, y + 2])
    }

    neighbors.sort(() => Math.random() - 0.5)

    for (let i = 0; i < neighbors.length; i++) {
      const nextX = neighbors[i][0]
      const nextY = neighbors[i][1]
      if (matrix[nextY][nextX] === 0) {
        matrix[(y + nextY) / 2][(x + nextX) / 2] = 1
        stack.push([nextX, nextY])
      }
    }
  }

  return matrix
}

export function generateMaze1(width, height, cellSize) {
  // 创建一个二维数组表示迷宫
  const rows = Math.floor(height / cellSize)
  const cols = Math.floor(width / cellSize)

  const maze = new Array(rows)
  for (let i = 0; i < rows; i++) {
    maze[i] = new Array(cols)
    for (let j = 0; j < cols; j++) {
      maze[i][j] = { visited: false, wall: true }
    }
  }

  // 随机选择一个起点并将其标记为已访问
  const startRow = Math.floor(Math.random() * rows)
  const startCol = Math.floor(Math.random() * cols)
  maze[startRow][startCol].visited = true

  // 用一个数组来保存所有已访问的格子以及与其相邻的未访问格子之间的墙
  const walls = []
  addWalls(startRow, startCol, maze, walls)

  while (walls.length > 0) {
    // 随机选择一个未访问的格子和与其相邻的已访问格子之间的墙
    const index = Math.floor(Math.random() * walls.length)
    const wall = walls[index]
    walls.splice(index, 1)

    const row = wall.row
    const col = wall.col

    if (!maze[row][col].visited) {
      // 将格子标记为已访问并将墙打通
      maze[row][col].visited = true
      maze[row][col].wall = false

      // 将与该格子相邻的未访问格子及其之间的墙加入数组
      addWalls(row, col, maze, walls)
    }
  }

  return maze
}

function addWalls(row, col, maze, walls) {
  if (row > 0) {
    walls.push({ row: row - 1, col: col, direction: 'vertical' })
  }
  if (row < maze.length - 1) {
    walls.push({ row: row + 1, col: col, direction: 'vertical' })
  }
  if (col > 0) {
    walls.push({ row: row, col: col - 1, direction: 'horizontal' })
  }
  if (col < maze[0].length - 1) {
    walls.push({ row: row, col: col + 1, direction: 'horizontal' })
  }
}

export function genMaze(width, height, cellSize) {
  const ROWS = Math.floor(height / cellSize)
  const COLS = Math.floor(width / cellSize)
  // 定义一个二维数组来表示迷宫中的每个格子
  let maze = []
  for (let i = 0; i < ROWS; i++) {
    maze[i] = []
    for (let j = 0; j < COLS; j++) {
      maze[i][j] = 1
    }
  }

  // 使用Prim算法生成迷宫
  let visited = []
  for (let i = 0; i < ROWS; i++) {
    visited[i] = []
    for (let j = 0; j < COLS; j++) {
      visited[i][j] = false
    }
  }
  visited[0][0] = true

  let walls = []
  for (let i = 1; i < ROWS; i += 2) {
    for (let j = 1; j < COLS; j += 2) {
      if (i < ROWS - 1) {
        walls.push([i + 1, j, i, j])
      }
      if (j < COLS - 1) {
        walls.push([i, j + 1, i, j])
      }
    }
  }

  while (walls.length > 0) {
    let randomIndex = Math.floor(Math.random() * walls.length)
    let wall = walls[randomIndex]
    walls.splice(randomIndex, 1)
    let [r1, c1, r2, c2] = wall
    if (visited[r1][c1] && !visited[r2][c2]) {
      visited[r2][c2] = true
      maze[r1][c1] = 0
      if (r2 >= 2 && !visited[r2 - 2][c2]) {
        walls.push([r2 - 1, c2, r2 - 2, c2])
      }
      if (c2 >= 2 && !visited[r2][c2 - 2]) {
        walls.push([r2, c2 - 1, r2, c2 - 2])
      }
      if (r2 < ROWS - 2 && !visited[r2 + 2][c2]) {
        walls.push([r2 + 1, c2, r2 + 2, c2])
      }
      if (c2 < COLS - 2 && !visited[r2][c2 + 2]) {
        walls.push([r2, c2 + 1, r2, c2 + 2])
      }
    }
  }
  return maze
}

// export function generateMazeTest(width, height) {
//   const maze = [];
//   // 初始化迷宫矩阵，全部设置为1（即墙）
//   for (let i = 0; i < height; i++) {
//     maze[i] = [];
//     for (let j = 0; j < width; j++) {
// 			if(i ==0 || j == 0 || width-1==i ||  height-1==j) {
// 				maze[i][j] =1;
// 			} else {
// 				maze[i][j] = 0;
// 			}
//     }
//   }

//   const startX = Math.floor(Math.random() * width);
//   const startY = Math.floor(Math.random() * height);
//   maze[startY][startX] = 0;

//   const walls = [];
//   if (startX > 0) {
//     walls.push([startX - 1, startY, startX, startY]);
//   }
//   if (startX < width - 1) {
//     walls.push([startX + 1, startY, startX, startY]);
//   }
//   if (startY > 0) {
//     walls.push([startX, startY - 1, startX, startY]);
//   }
//   if (startY < height - 1) {
//     walls.push([startX, startY + 1, startX, startY]);
//   }

//   while (walls.length > 0) {
//     const index = Math.floor(Math.random() * walls.length);
//     const wall = walls[index];
//     walls.splice(index, 1);

//     const x1 = wall[0];
//     const y1 = wall[1];
//     const x2 = wall[2];
//     const y2 = wall[3];

//     if (maze[y1][x1] === 1 && maze[y2][x2] === 0) {
//       maze[y1][x1] = 0;
//       if (x1 > 0) {
//         walls.push([x1 - 1, y1, x1, y1]);
//       }
//       if (x1 < width - 1) {
//         walls.push([x1 + 1, y1, x1, y1]);
//       }
//       if (y1 > 0) {
//         walls.push([x1, y1 - 1, x1, y1]);
//       }
//       if (y1 < height - 1) {
//         walls.push([x1, y1 + 1, x1, y1]);
//       }
//     } else if (maze[y1][x1] === 0 && maze[y2][x2] === 1) {
//       maze[y2][x2] = 0;
//       if (x2 > 0) {
//         walls.push([

export function generateMaze001(width, height) {
  // 初始化迷宫，全部设置为1表示墙壁
  let maze = new Array(height)
  for (let i = 0; i < height; i++) {
    maze[i] = new Array(width).fill(1)
  }

  // 初始化起点为随机位置，必须在边框范围内
  let startX = Math.floor(Math.random() * (width - 2)) + 1
  let startY = Math.floor(Math.random() * (height - 2)) + 1
  maze[startY][startX] = 0

  // 标记边框墙壁，四周都是墙
  for (let i = 0; i < width; i++) {
    maze[0][i] = 1
    maze[height - 1][i] = 1
  }
  for (let i = 0; i < height; i++) {
    maze[i][0] = 1
    maze[i][width - 1] = 1
  }

  // 初始化待访问的列表和访问过的列表，初始位置不能在边框上
  let frontier = [{ x: startX, y: startY }]
  let visited = [{ x: startX, y: startY }]

  // 主循环，直到待访问列表为空
  while (frontier.length > 0) {
    // 随机选取一个待访问的位置
    let index = Math.floor(Math.random() * frontier.length)
    let current = frontier[index]
    let x = current.x
    let y = current.y

    // 从待访问列表中移除该位置，并将其加入已访问列表
    frontier.splice(index, 1)
    visited.push(current)

    // 获取该位置周围的四个位置
    let neighbors = [
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x, y: y - 1 },
      { x: x, y: y + 1 }
    ]

    // 对每个邻居位置进行处理
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i]
      let nx = neighbor.x
      let ny = neighbor.y

      // 判断该邻居是否在迷宫范围内，并且未被访问过，且不在边框上
      if (nx >= 1 && nx < width - 1 && ny >= 1 && ny < height - 1 && visited.find(v => v.x === nx && v.y === ny) === undefined) {
        // 将该邻居加入待访问列表
        frontier.push(neighbor)

        // 将当前位置与邻居位置之间的墙壁设置为通路
        let dx = nx - x
        let dy = ny - y
        maze[y + dy / 2][x + dx / 2] = maze[ny][nx] = 0
      }
    }
  }

  // 返回生成的迷宫
  return maze
}

export function generateMaze01(rows, cols) {
  const maze = []

  // Initialize the maze with all walls
  for (let i = 0; i < rows; i++) {
    const row = new Array(cols).fill(1)
    maze.push(row)
  }

  // Select a random starting cell
  const startRow = Math.floor(Math.random() * rows)
  const startCol = Math.floor(Math.random() * cols)
  maze[startRow][startCol] = 0

  // Add the starting cell to the frontier list
  const frontier = [{ row: startRow, col: startCol }]

  // Iterate until all cells have been visited
  while (frontier.length > 0) {
    // Select a random frontier cell
    const randomIndex = Math.floor(Math.random() * frontier.length)
    const { row, col } = frontier[randomIndex]
    frontier.splice(randomIndex, 1)

    // Get the neighbors of the current cell
    const neighbors = [
      { row: row - 2, col },
      { row, col: col + 2 },
      { row: row + 2, col },
      { row, col: col - 2 }
    ]

    // Shuffle the neighbors
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]]
    }

    // Visit each neighbor
    for (const neighbor of neighbors) {
      const { row: r, col: c } = neighbor
      if (r >= 0 && r < rows && c >= 0 && c < cols && maze[r][c] === 1) {
        // Remove the wall between the current cell and the neighbor
        if (row === r) {
          maze[row][(col + c) / 2] = 0
        } else {
          maze[(row + r) / 2][col] = 0
        }

        // Add the neighbor to the frontier list
        maze[r][c] = 0
        frontier.push({ row: r, col: c })
      }
    }
  }

  // Add walls around the maze
  for (let i = 0; i < rows; i++) {
    maze[i][0] = maze[i][cols - 1] = 1
  }
  for (let j = 0; j < cols; j++) {
    maze[0][j] = maze[rows - 1][j] = 1
  }

  return maze
}

export function generateMaze3(width, height) {
  const maze = []
  for (let i = 0; i < height; i++) {
    maze.push([])
    for (let j = 0; j < width; j++) {
      maze[i].push(1) // Initialize all cells as walls
    }
  }

  const startingRow = 1
  const startingCol = 1
  maze[startingRow][startingCol] = 0 // Set the starting cell as a path
  const walls = [
    [startingRow - 1, startingCol],
    [startingRow, startingCol - 1],
    [startingRow, startingCol + 1],
    [startingRow + 1, startingCol]
  ] // Add the walls surrounding the starting cell to the list

  while (walls.length > 0) {
    const randomWallIndex = Math.floor(Math.random() * walls.length)
    const [row, col] = walls[randomWallIndex]
    walls.splice(randomWallIndex, 1) // Remove the wall from the list

    if (row < 1 || row >= height - 1 || col < 1 || col >= width - 1) {
      continue // Skip walls on the edge of the maze
    }

    if (maze[row][col] === 1) {
      // If the wall separates a path and a wall
      const adjacentPaths = [
        [row - 1, col],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col]
      ].filter(([adjRow, adjCol]) => maze[adjRow][adjCol] === 0) // Get the adjacent path cells

      if (adjacentPaths.length === 1) {
        // If there is only one adjacent path cell
        maze[row][col] = 0 // Make the wall a path
        walls.push(...getSurroundingWalls(row, col, height, width)) // Add the surrounding walls to the list
      }
    }
  }

  return maze
}

function getSurroundingWalls(row, col, height, width) {
  return [
    [row - 1, col],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col]
  ].filter(([adjRow, adjCol]) => adjRow >= 0 && adjRow < height && adjCol >= 0 && adjCol < width)
}

export function generateMaze4(width, height) {
  // 创建一个二维数组来表示迷宫
  const maze = Array(height)
    .fill()
    .map(() => Array(width).fill(1))

  // 定义一个辅助函数来检查一个位置是否在迷宫内
  function isInMaze(x, y) {
    return x >= 0 && x < width && y >= 0 && y < height
  }

  // 选择一个起点并将其标记为0
  const startX = Math.floor(Math.random() * width)
  const startY = Math.floor(Math.random() * height)
  maze[startY][startX] = 0

  // 定义一个数组来保存已经访问过的位置
  const visited = [[startX, startY]]

  // 定义一个辅助函数来获取一个位置的相邻位置
  function getNeighbors(x, y) {
    const neighbors = []
    const directions = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0]
    ] // 上下左右
    for (const [dx, dy] of directions) {
      const newX = x + dx
      const newY = y + dy
      if (isInMaze(newX, newY) && maze[newY][newX] === 1) {
        neighbors.push([newX, newY])
      }
    }
    return neighbors
  }

  // 使用 Prim 算法生成迷宫
  while (visited.length > 0) {
    // 随机选择一个已经访问过的位置作为当前位置
    const index = Math.floor(Math.random() * visited.length)
    const [x, y] = visited[index]

    // 获取当前位置的相邻位置
    const neighbors = getNeighbors(x, y)

    if (neighbors.length > 0) {
      // 随机选择一个相邻位置
      const [newX, newY] = neighbors[Math.floor(Math.random() * neighbors.length)]

      // 将当前位置和相邻位置之间的墙标记为0
      const wallX = (x + newX) / 2
      const wallY = (y + newY) / 2
      maze[wallY][wallX] = 0

      // 将相邻位置标记为0，并将其添加到已访问列表中
      maze[newY][newX] = 0
      visited.push([newX, newY])
    } else {
      // 如果当前位置没有相邻的未访问过的位置，则从已访问列表中移除它
      visited.splice(index, 1)
    }
  }

  // 将四边都标记为1
  for (let x = 0; x < width; x++) {
    maze[0][x] = 1
    maze[height - 1][x] = 1
  }
  for (let y = 0; y < height; y++) {
    maze[y][0] = 1
    maze[y][width - 1] = 1
  }

  return maze
}
