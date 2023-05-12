package model

import (
	"fmt"
	"server/pb"
	"server/utils"
)

type Maze struct{}

var MazeModel = new(Maze)

var MazeMap = make(map[string]*pb.MazeMap)

func (*Maze) NewMazeMap(width int, height int, cellSize int, color string, wallThickness int) *pb.MazeMap {
	data := utils.GeneratePrimMaze(width, height, cellSize)
	// 转换成与pb一样的格式
	grids := make([]*pb.Grid, len(data))
	for i := 0; i < len(data); i++ {
		grids[i] = &pb.Grid{Grid: data[i]}
	}
	gridWalls := getWallsByGrid(data, cellSize, wallThickness)
	mazeMap := &pb.MazeMap{
		Id:            utils.GenerateRandomCode(8),
		Width:         int32(width),
		Height:        int32(height),
		CellSize:      int32(cellSize),
		Color:         color,
		WallThickness: int32(wallThickness),
		Grids:         grids,
		GridWalls:     gridWalls,
	}
	return mazeMap
}

// 获取所在格子需要判断的墙
func getWallsByGrid(grids [][]*pb.SubGrid, cellSize int, wallThickness int) map[string]*pb.Wall {
	numRows := len(grids)
	numCols := len(grids[0])

	gridWallsMap := make(map[string]*pb.Wall)
	for row := 0; row < numRows; row++ {
		for col := 0; col < numCols; col++ {
			var walls []*pb.SubWall
			// 水平
			hw := int32(cellSize + wallThickness/2)
			hh := int32(wallThickness)
			// 垂直
			vw := int32(wallThickness)
			vh := int32(cellSize + wallThickness/2)

			// 当前格子的邻居格子(上下左右)
			neighborsGrids := getNeighbors(row, col, grids)
			for i := 0; i < len(neighborsGrids); i++ {
				currentGrid := neighborsGrids[i]
				hx := float32(currentGrid.X + hw/2)
				hy := float32(currentGrid.Y + hh/2)
				vx := float32(currentGrid.X + vw/2)
				vy := float32(currentGrid.Y + vh/2)

				if currentGrid.Walls.Top {
					subWall := &pb.SubWall{
						Direction: "top",
						CenterX:   hx,
						CenterY:   hy,
						Width:     hw,
						Height:    hh,
					}
					walls = append(walls, subWall)
				}
				if currentGrid.Walls.Bottom {
					subWall := &pb.SubWall{
						Direction: "bottom",
						CenterX:   hx,
						CenterY:   hy + float32(cellSize),
						Width:     hw,
						Height:    hh,
					}
					walls = append(walls, subWall)
				}
				if currentGrid.Walls.Left {
					subWall := &pb.SubWall{
						Direction: "left",
						CenterX:   vx,
						CenterY:   vy,
						Width:     vw,
						Height:    vh,
					}
					walls = append(walls, subWall)
				}
				if currentGrid.Walls.Right {
					subWall := &pb.SubWall{
						Direction: "right",
						CenterX:   vx + float32(cellSize),
						CenterY:   vy,
						Width:     vw,
						Height:    vh,
					}
					walls = append(walls, subWall)
				}
			}

			key := fmt.Sprintf("%d%d", row, col)
			wall := &pb.Wall{Wall: walls}
			gridWallsMap[key] = wall
		}
	}
	return gridWallsMap
}

func getNeighbors(row int, col int, grids [][]*pb.SubGrid) []*pb.SubGrid {
	var neighbors []*pb.SubGrid

	// 当前格子
	neighbors = append(neighbors, grids[row][col])

	// 上面的格子
	if row > 0 {
		neighbors = append(neighbors, grids[row-1][col])
	}

	// 下面的格子
	if row < len(grids)-1 {
		neighbors = append(neighbors, grids[row+1][col])
	}

	// 左边的格子
	if col > 0 {
		neighbors = append(neighbors, grids[row][col-1])
	}

	// 右边的格子
	if col < len(grids[0])-1 {
		neighbors = append(neighbors, grids[row][col+1])
	}

	return neighbors
}

func (m *Maze) GetMazeMap(roomId string) *pb.MazeMap {
	if mazeMap, ok := MazeMap[roomId]; ok {
		return mazeMap
	} else {
		MazeMap[roomId] = m.NewMazeMap(850, 550, 100, "4d4d4d", 6)
		return MazeMap[roomId]
	}
}

func (m *Maze) ResetMazeMap(roomId string) {
	MazeMap[roomId] = m.NewMazeMap(850, 550, 100, "4d4d4d", 6)
}
