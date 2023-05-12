package model

import (
	"fmt"
	"log"
	"math"
	"server/model/response"
	"server/pb"
	"server/utils"
)

type Bullet struct{}

var BulletModel = new(Bullet)

func (*Bullet) NewBullet(playerId string, centerX float32, centerY float32, rotation float32) *pb.Bullet {
	bullet := &pb.Bullet{
		Id:         utils.GenerateRandomCode(8),
		From:       playerId,
		CenterX:    centerX,
		CenterY:    centerY,
		FirstShoot: true,
		Color:      "0x000000",
		Radius:     5,
		Rotation:   rotation,
		Speed:      5,
		Bounces:    20,
	}
	return bullet
}

func (b *Bullet) UpdateBullet(bulletIndex int, maze *pb.MazeMap, tank *pb.Tank, bullet *pb.Bullet, roomId string) bool {
	if bullet.Bounces > 0 {
		bullet.CenterX += float32(math.Sin(float64(bullet.Rotation))) * bullet.Speed
		bullet.CenterY += float32(-math.Cos(float64(bullet.Rotation))) * bullet.Speed
		res := b.bulletIsCollisionWall(maze, bullet)
		if res.HitWall {
			if res.WallDirection == "left" || res.WallDirection == "right" {
				bullet.Rotation = -bullet.Rotation
			} else {
				bullet.Rotation = math.Pi - bullet.Rotation
			}
			bullet.FirstShoot = false
			bullet.Bounces--
		}
		// 结束标识
		return b.bulletIsHitPlayer(tank, bullet, roomId)
	} else {
		tank.BulletNum++
		tank.Bullets = removeElement(tank.Bullets, bulletIndex)
	}
	return false
}

func (*Bullet) bulletIsCollisionWall(maze *pb.MazeMap, bullet *pb.Bullet) *response.BulletHitWall {
	gridWallsMap := maze.GridWalls
	res := &response.BulletHitWall{
		HitWall:       false,
		WallDirection: "null",
	}
	cellSize := float32(maze.CellSize)
	gridRow := math.Floor(float64(bullet.CenterY / cellSize))
	gridCol := math.Floor(float64(bullet.CenterX / cellSize))

	bulletCircle := &utils.Circle{
		X:      float64(bullet.CenterX),
		Y:      float64(bullet.CenterY),
		Radius: int(bullet.Radius),
	}
	key := fmt.Sprintf("%d%d", int(gridRow), int(gridCol))
	walls := gridWallsMap[key]
	for _, w := range walls.Wall {
		wallRect := &utils.Rect{
			X:      float64(w.CenterX),
			Y:      float64(w.CenterY),
			Width:  int(w.Width),
			Height: int(w.Height),
			Angle:  0,
		}
		if utils.CircleRectOverlap(bulletCircle, wallRect) {
			log.Println("w.Direction==", w.Direction)
			res.HitWall = true
			res.WallDirection = w.Direction
			return res
		}
	}
	return res
}

func (*Bullet) bulletIsHitPlayer(tank *pb.Tank, bullet *pb.Bullet, roomId string) bool {
	players := Players[roomId]
	bulletCircle := &utils.Circle{
		X:      float64(bullet.CenterX),
		Y:      float64(bullet.CenterY),
		Radius: int(bullet.Radius),
	}
	for _, player := range players {
		tankRect := &utils.Rect{
			X:      float64(player.CenterX),
			Y:      float64(player.CenterY),
			Width:  int(player.Width),
			Height: int(player.Height),
			Angle:  float64(player.Rotation),
		}
		if utils.CircleRectOverlap(bulletCircle, tankRect) {
			if bullet.From == player.Id && bullet.FirstShoot {
				return false
			}
			if tank.Id != player.Id {
				tank.Score++
			}
			player.Alive = false
			return true
		}
	}
	return false
}
