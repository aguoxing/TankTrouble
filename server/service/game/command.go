package game

import (
	"google.golang.org/protobuf/proto"
	"log"
	"server/model"
	"server/pb"
)

type Command struct{}

var CommandSrv = new(Command)

func (c *Command) genCommand(client *Client, message []byte) {
	command := c.DecodeCommand(message)
	mazeMap := model.MazeModel.GetMazeMap(command.RoomId)
	players := model.Players[command.RoomId]

	log.Println(command.Action, "==================", command.Object)
	if command.Action == "ping" {
		client.Room.Broadcast(client, message)
	}
	if command.Action == "start" {
		// 生成地图
		mazeMapMessage := &pb.Command{
			Action:  "initMap",
			Object:  "mazeMap",
			RoomId:  command.RoomId,
			MazeMap: mazeMap,
		}
		log.Println("initMap...")
		client.Room.Broadcast(client, c.EncodeCommand(mazeMapMessage))
		// 生成玩家
		for _, player := range players {
			position := model.TankModel.GetPosition(mazeMap)
			player.CenterX = position.X
			player.CenterY = position.Y
			playerMessage := &pb.Command{
				Action:   "initPlayer",
				Object:   "player",
				RoomId:   command.RoomId,
				PlayerId: player.Id,
				Player:   player,
			}
			log.Println("initPlayer...")
			client.Room.Broadcast(client, c.EncodeCommand(playerMessage))
		}
		// 开始
		runMessage := &pb.Command{
			Action:   "run",
			Object:   "game",
			RoomId:   command.RoomId,
			PlayerId: client.ClientId,
		}
		log.Println("run...")
		client.Room.Broadcast(client, c.EncodeCommand(runMessage))
	}
	if command.Action == "restart" {
	}
	if command.Action == "move" {
		for _, player := range players {
			if player.Id == client.ClientId {
				model.TankModel.UpdatePosition(mazeMap, player, command.Object)
				playerMoveMessage := &pb.Command{
					Action:   "updatePlayer",
					Object:   "player",
					RoomId:   command.RoomId,
					PlayerId: player.Id,
					Player:   player,
				}
				client.Room.Broadcast(client, c.EncodeCommand(playerMoveMessage))
			}
		}
	}
	if command.Action == "fire" {
		for _, player := range players {
			if player.Id == client.ClientId {
				bullet := model.TankModel.Fire(player)
				if bullet != nil {
					playerFireMessage := &pb.Command{
						Action:   "fire",
						Object:   "bullet",
						RoomId:   command.RoomId,
						PlayerId: player.Id,
						Bullet:   bullet,
					}
					client.Room.Broadcast(client, c.EncodeCommand(playerFireMessage))
				}
			}
		}
	}
	if command.Action == "updateBullets" {
		for _, player := range players {
			if player.Id == client.ClientId {
				bullets := player.Bullets
				for i, bullet := range bullets {
					isOver := model.BulletModel.UpdateBullet(i, mazeMap, player, bullet, command.RoomId)
					if isOver {
						restartMessage := &pb.Command{
							Action:   "restart",
							Object:   "game",
							RoomId:   command.RoomId,
							PlayerId: player.Id,
						}
						log.Println("restart===========")
						client.Room.Broadcast(client, c.EncodeCommand(restartMessage))
					} else {
						updateBulletMessage := &pb.Command{
							Action:   "updateBullet",
							Object:   "bullet",
							RoomId:   command.RoomId,
							PlayerId: player.Id,
							Bullet:   bullet,
						}
						log.Println("updateBullet===========", bullet)
						client.Room.Broadcast(client, c.EncodeCommand(updateBulletMessage))
					}
				}
			}
		}
	}
	if command.Action == "chat" {
		client.Room.Broadcast(client, message)
	}
}

func (*Command) DecodeCommand(msg []byte) *pb.Command {
	// 使用protobuf 解码
	req := &pb.Command{}
	err2 := proto.Unmarshal(msg, req)
	if err2 != nil {
		log.Println("err2", err2)
		return nil
	}
	return req
}

func (*Command) EncodeCommand(msg *pb.Command) []byte {
	// 使用protobuf 编码
	respPb, err3 := proto.Marshal(msg)
	if err3 != nil {
		log.Println("err3", err3)
		return nil
	}
	return respPb
}
