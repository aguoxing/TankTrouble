package model

import (
	"fmt"
	"log"
	"math"
	"math/rand"
	"server/model/response"
	"server/pb"
	"server/utils"
	"time"
)

type Tank struct{}

var TankModel = new(Tank)

var Players = make(map[string][]*pb.Tank)

var lastShootTime time.Time

func (*Tank) NewTank(id string, name string, color string) *pb.Tank {
	tank := &pb.Tank{
		Id:        id,
		Name:      name,
		Alive:     true,
		Score:     0,
		Width:     30,
		Height:    40,
		CenterX:   0,
		CenterY:   0,
		Color:     color,
		Rotation:  rand.Float32() - 0.5,
		BulletNum: 5,
		HitWall:   false,
		Speed:     3,
		Bullets:   make([]*pb.Bullet, 0),
	}
	return tank
}

func (*Tank) GetPosition(maze *pb.MazeMap) *response.Position {
	// 随机初始位置
	random := math.Floor(rand.Float64()*10 + 1)
	randomX := rand.Float64()
	randomY := rand.Float64()
	cols := maze.Width / maze.CellSize
	rows := maze.Height / maze.CellSize

	x := float32(math.Floor(randomX*float64(cols)))*float32(maze.CellSize) + (float32(random)+float32(maze.CellSize))/2
	y := float32(math.Floor(randomY*float64(rows)))*float32(maze.CellSize) + (float32(random)+float32(maze.CellSize))/2

	return &response.Position{X: x, Y: y}
}

func (t *Tank) UpdatePosition(maze *pb.MazeMap, tank *pb.Tank, isMoveForward int32, isMoveBackward int32, isRotateLeft int32, isRotateRight int32) {
	if isMoveForward == 1 {
		t.MoveForward(maze, tank)
	}
	if isMoveBackward == 1 {
		t.MoveBackward(maze, tank)
	}
	if isRotateLeft == 1 {
		t.RotateLeft(tank)
	}
	if isRotateRight == 1 {
		t.RotateRight(tank)
	}
	log.Println(fmt.Sprintf("id: %s,x: %f,y: %f,r: %f", tank.Id, tank.CenterX, tank.CenterY, tank.Rotation))
}

func (*Tank) MoveForward(maze *pb.MazeMap, tank *pb.Tank) {
	oldX := tank.CenterX
	oldY := tank.CenterY
	vx := math.Sin(float64(tank.Rotation))
	vy := -math.Cos(float64(tank.Rotation))
	tank.NextCenterX = tank.CenterX + float32(vx)*tank.Speed
	tank.NextCenterY = tank.CenterY + float32(vy)*tank.Speed
	if isCollisionWall(maze, tank) {
		tank.HitWall = true
		tank.CenterX = oldX
		tank.CenterY = oldY
	} else {
		tank.CenterX = tank.NextCenterX
		tank.CenterY = tank.NextCenterY
		tank.HitWall = false
	}
}

func (*Tank) MoveBackward(maze *pb.MazeMap, tank *pb.Tank) {
	oldX := tank.CenterX
	oldY := tank.CenterY
	vx := math.Sin(float64(tank.Rotation))
	vy := -math.Cos(float64(tank.Rotation))
	tank.NextCenterX = tank.CenterX - float32(vx)*tank.Speed
	tank.NextCenterY = tank.CenterY - float32(vy)*tank.Speed
	if isCollisionWall(maze, tank) {
		tank.HitWall = true
		tank.CenterX = oldX
		tank.CenterY = oldY
	} else {
		tank.CenterX = tank.NextCenterX
		tank.CenterY = tank.NextCenterY
		tank.HitWall = false
	}
}

func (*Tank) RotateLeft(tank *pb.Tank) {
	// if (!tank.HitWall) {
	if tank.Rotation < -math.Pi {
		tank.Rotation += math.Pi * 2
	}
	if tank.Rotation > math.Pi {
		tank.Rotation -= math.Pi * 2
	}
	tank.Rotation -= (math.Pi / 180) * 5
	// }
}

func (*Tank) RotateRight(tank *pb.Tank) {
	// if (!tank.HitWall) {
	if tank.Rotation < -math.Pi {
		tank.Rotation += math.Pi * 2
	}
	if tank.Rotation > math.Pi {
		tank.Rotation -= math.Pi * 2
	}
	tank.Rotation += (math.Pi / 180) * 5
	// }
}

func (*Tank) Fire(tank *pb.Tank) *pb.Bullet {
	// 计算当前时间和上一次发射子弹的时间间隔
	currentTime := time.Now()
	if time.Since(lastShootTime) >= 200*time.Millisecond {
		lastShootTime = currentTime
		if tank.Alive && tank.BulletNum > 0 {
			bullet := BulletModel.NewBullet(tank.Id, tank.CenterX, tank.CenterY, tank.Rotation)
			tank.Bullets = append(tank.Bullets, bullet)
			tank.BulletNum--
			return bullet
		}
	}
	return nil
}

// 删除指定下标的元素
func removeElement(arr []*pb.Bullet, index int) []*pb.Bullet {
	// 判断下标是否越界
	if index < 0 || index >= len(arr) {
		return arr
	}

	// 使用切片删除元素
	return append(arr[:index], arr[index+1:]...)
}

func isCollisionWall(maze *pb.MazeMap, tank *pb.Tank) bool {
	gridWallsMap := maze.GridWalls
	tankObb := &utils.Obb{
		Position: &utils.Vector2{X: float64(tank.NextCenterX), Y: float64(tank.NextCenterY)},
		HalfSize: &utils.Vector2{X: float64(tank.Width / 2), Y: float64(tank.Height / 2)},
		Angle:    float64(tank.Rotation),
	}
	cellSize := float32(maze.CellSize)
	gridRow := math.Floor(float64(tank.NextCenterY / cellSize))
	gridCol := math.Floor(float64(tank.NextCenterX / cellSize))

	key := fmt.Sprintf("%d%d", int(gridRow), int(gridCol))
	walls := gridWallsMap[key]
	for _, w := range walls.Wall {
		wallObb := &utils.Obb{
			Position: &utils.Vector2{X: float64(w.CenterX), Y: float64(w.CenterY)},
			HalfSize: &utils.Vector2{X: float64(w.Width / 2), Y: float64(w.Height / 2)},
			Angle:    0,
		}
		if utils.RectRectIsCollide(tankObb, wallObb) {
			return true
		}
	}
	return false
}
