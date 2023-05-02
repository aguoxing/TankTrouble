package utils

import (
	"math"
	"math/rand"
	"server/pb"
)

func GeneratePrimMaze(width int, height int, cellSize int) [][]*pb.SubGrid {
	rows := math.Floor(float64(height / cellSize))
	cols := math.Floor(float64(width / cellSize))
	grid := createPrimGrid(int(rows), int(cols), int(cellSize))

	startRow := int(math.Floor(rand.Float64() * rows))
	startCol := int(math.Floor(rand.Float64() * cols))
	startCell := grid[startRow][startCol]
	startCell.Visited = true

	walls := make([]*pb.Cells, 0)
	addWalls(&grid, startCell, &walls)

	for len(walls) > 0 {

		randomIndex := int(math.Floor(rand.Float64() * float64(len(walls))))
		wall := walls[randomIndex]

		cell1 := wall.GetCell1()
		cell2 := wall.Cell2

		if cell1.Visited && !cell2.Visited {
			removeWall(cell1, cell2)
			cell2.Visited = true
			addWalls(&grid, cell2, &walls)
		} else if !cell1.Visited && cell2.Visited {
			removeWall(cell2, cell1)
			cell1.Visited = true
			addWalls(&grid, cell1, &walls)
		}

		walls = removeElement(walls, randomIndex)
	}

	return grid
}

// 删除指定下标的元素
func removeElement(arr []*pb.Cells, index int) []*pb.Cells {
	// 判断下标是否越界
	if index < 0 || index >= len(arr) {
		return arr
	}

	// 使用切片删除元素
	return append(arr[:index], arr[index+1:]...)
}

func createPrimGrid(rows int, cols int, cellSize int) [][]*pb.SubGrid {
	grid := make([][]*pb.SubGrid, rows)
	for i := range grid {
		grid[i] = make([]*pb.SubGrid, cols)
	}

	for i := 0; i < rows; i++ {
		row := make([]*pb.SubGrid, cols)
		for j := 0; j < cols; j++ {
			w := &pb.Walls{
				Top:    true,
				Right:  true,
				Bottom: true,
				Left:   true,
			}
			g := &pb.SubGrid{
				Row:     int32(i),
				Col:     int32(j),
				X:       int32(j * cellSize),
				Y:       int32(i * cellSize),
				Visited: false,
				Walls:   w,
			}
			row[j] = g
		}
		grid[i] = row
	}

	return grid
}

func addWalls(grid *[][]*pb.SubGrid, cell *pb.SubGrid, walls *[]*pb.Cells) {
	row := int(cell.Row)
	col := int(cell.Col)

	if row > 0 {
		wall := &pb.Cells{
			Cell1:     cell,
			Cell2:     (*grid)[row-1][col],
			Direction: "top",
		}
		*walls = append(*walls, wall)
	}

	if col < len((*grid)[0])-1 {
		wall := &pb.Cells{
			Cell1:     cell,
			Cell2:     (*grid)[row][col+1],
			Direction: "right",
		}
		*walls = append(*walls, wall)
	}

	if row < len(*grid)-1 {
		wall := &pb.Cells{
			Cell1:     cell,
			Cell2:     (*grid)[row+1][col],
			Direction: "bottom",
		}
		*walls = append(*walls, wall)
	}

	if col > 0 {
		wall := &pb.Cells{
			Cell1:     cell,
			Cell2:     (*grid)[row][col-1],
			Direction: "left",
		}
		*walls = append(*walls, wall)
	}
}

func removeWall(cell1 *pb.SubGrid, cell2 *pb.SubGrid) {
	rowDiff := cell1.Row - cell2.Row
	colDiff := cell1.Col - cell2.Col

	if rowDiff == 1 {
		cell1.Walls.Top = false
		cell2.Walls.Bottom = false
	} else if rowDiff == -1 {
		cell1.Walls.Bottom = false
		cell2.Walls.Top = false
	}

	if colDiff == 1 {
		cell1.Walls.Left = false
		cell2.Walls.Right = false
	} else if colDiff == -1 {
		cell1.Walls.Right = false
		cell2.Walls.Left = false
	}
}
