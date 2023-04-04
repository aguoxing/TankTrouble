export function generateMaze22(rows, cols) {
  // Create a 2D array to represent the maze
  const maze = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(1));

  // Pick a random starting cell and set it as the current cell
  let currentRow = Math.floor(Math.random() * rows);
  let currentCol = Math.floor(Math.random() * cols);
  maze[currentRow][currentCol] = 0;

  // Create a list of frontier cells, initially containing the neighbors of the current cell
  const frontier = getNeighbors(currentRow, currentCol, rows, cols);

  // While there are cells in the frontier list
  while (frontier.length > 0) {
    // Pick a random frontier cell and remove it from the list
    const frontierIndex = Math.floor(Math.random() * frontier.length);
    const [nextRow, nextCol] = frontier.splice(frontierIndex, 1)[0];

    // If the cell is already a passage, continue to the next frontier cell
    if (maze[nextRow][nextCol] === 0) {
      continue;
    }

    // Find the wall between the current cell and the chosen frontier cell
    const wallRow = (currentRow + nextRow) / 2;
    const wallCol = (currentCol + nextCol) / 2;

    // Make the chosen frontier cell a passage and the wall a passage
    maze[nextRow][nextCol] = 0;
    maze[wallRow][wallCol] = 0;

    // Add the neighbors of the chosen frontier cell to the frontier list
    const newFrontier = getNeighbors(nextRow, nextCol, rows, cols);
    for (const [row, col] of newFrontier) {
      if (maze[row][col] === 1) {
        frontier.push([row, col]);
      }
    }

    // Set the chosen frontier cell as the current cell
    currentRow = nextRow;
    currentCol = nextCol;
  }

  return maze;
}

function getNeighbors(row, col, numRows, numCols) {
  const neighbors = [];

  if (row > 1) {
    neighbors.push([row - 2, col]);
  }
  if (col > 1) {
    neighbors.push([row, col - 2]);
  }
  if (row < numRows - 2) {
    neighbors.push([row + 2, col]);
  }
  if (col < numCols - 2) {
    neighbors.push([row, col + 2]);
  }

  return neighbors;
}
