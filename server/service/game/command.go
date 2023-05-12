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

	if command.MsgKey == "ping" {
		//client.Room.Broadcast(client, message)
		client.Room.BroadcastMessages <- message
	}
	if command.MsgKey == "game" && command.MsgVal == "start" {
		// 生成地图
		mazeMapMessage := &pb.Command{
			MsgKey:  "initMap",
			MsgVal:  "mazeMap",
			RoomId:  command.RoomId,
			MazeMap: mazeMap,
		}
		log.Println("initMap...")
		//client.Room.Broadcast(client, c.EncodeCommand(mazeMapMessage))
		client.Room.BroadcastMessages <- c.EncodeCommand(mazeMapMessage)
		// 生成玩家
		for _, player := range players {
			position := model.TankModel.GetPosition(mazeMap)
			player.CenterX = position.X
			player.CenterY = position.Y
			playerMessage := &pb.Command{
				MsgKey:   "initPlayer",
				MsgVal:   "player",
				RoomId:   command.RoomId,
				PlayerId: player.Id,
				Player:   player,
			}
			log.Println("initPlayer...")
			//client.Room.Broadcast(client, c.EncodeCommand(playerMessage))
			client.Room.BroadcastMessages <- c.EncodeCommand(playerMessage)
		}
		// 开始
		runMessage := &pb.Command{
			MsgKey:   "game",
			MsgVal:   "run",
			RoomId:   command.RoomId,
			PlayerId: client.ClientId,
		}
		log.Println("run...")
		//client.Room.Broadcast(client, c.EncodeCommand(runMessage))
		client.Room.BroadcastMessages <- c.EncodeCommand(runMessage)
	}
	if command.MsgKey == "chat" {
		//client.Room.Broadcast(client, message)
		client.Room.BroadcastMessages <- message
	}

	if command.MoveStatus == 1 {
		c.move(client, mazeMap, players, command.IsMoveForward, command.IsMoveBackward, command.IsRotateLeft, command.IsRotateRight)
	}
	if command.IsFire == 1 {
		c.fire(client, players)
	}
}

func (c *Command) move(client *Client, mazeMap *pb.MazeMap, players []*pb.Tank, isMoveForward int32, isMoveBackward int32, isRotateLeft int32, isRotateRight int32) {
	roomId := client.Room.RoomId
	for _, player := range players {
		if player.Id == client.ClientId {
			model.TankModel.UpdatePosition(mazeMap, player, isMoveForward, isMoveBackward, isRotateLeft, isRotateRight)
			c.updateBullets(client, mazeMap, players, player)
			playerMoveMessage := &pb.Command{
				MsgKey:   "update",
				MsgVal:   "player",
				RoomId:   roomId,
				PlayerId: player.Id,
				Player:   player,
			}
			//client.Room.Broadcast(client, c.EncodeCommand(playerMoveMessage))
			client.Room.BroadcastMessages <- c.EncodeCommand(playerMoveMessage)
			break
		}
	}
}

func (c *Command) fire(client *Client, players []*pb.Tank) {
	roomId := client.Room.RoomId
	for _, player := range players {
		if player.Id == client.ClientId {
			bullet := model.TankModel.Fire(player)
			if bullet != nil {
				playerFireMessage := &pb.Command{
					MsgKey:   "fire",
					MsgVal:   "bullet",
					RoomId:   roomId,
					PlayerId: player.Id,
					Bullet:   bullet,
				}
				//client.Room.Broadcast(client, c.EncodeCommand(playerFireMessage))
				client.Room.BroadcastMessages <- c.EncodeCommand(playerFireMessage)
			}
		}
	}
}

func (c *Command) updateBullets(client *Client, mazeMap *pb.MazeMap, players []*pb.Tank, player *pb.Tank) {
	roomId := client.Room.RoomId
	if player.Id == client.ClientId {
		bullets := player.Bullets
		for i, bullet := range bullets {
			isOver := model.BulletModel.UpdateBullet(i, mazeMap, player, bullet, roomId)
			if isOver {
				restartMessage := &pb.Command{
					MsgKey: "game",
					MsgVal: "restart",
					RoomId: roomId,
				}
				log.Println("restartMessage===========")
				//client.Room.Broadcast(client, c.EncodeCommand(restartMessage))
				client.Room.BroadcastMessages <- c.EncodeCommand(restartMessage)
				c.restart(client, players)
			}
		}
	}
}

func (c *Command) restart(client *Client, players []*pb.Tank) {
	roomId := client.Room.RoomId
	model.MazeModel.ResetMazeMap(roomId)
	mazeMap := model.MazeModel.GetMazeMap(roomId)
	// 生成地图
	mazeMapMessage := &pb.Command{
		MsgKey:  "initMap",
		MsgVal:  "mazeMap",
		RoomId:  roomId,
		MazeMap: mazeMap,
	}
	log.Println("initMap...")
	//client.Room.Broadcast(client, c.EncodeCommand(mazeMapMessage))
	client.Room.BroadcastMessages <- c.EncodeCommand(mazeMapMessage)
	// 生成玩家
	for _, player := range players {
		position := model.TankModel.GetPosition(mazeMap)
		player.CenterX = position.X
		player.CenterY = position.Y
		player.Alive = true
		player.BulletNum = 5
		player.Bullets = make([]*pb.Bullet, 0)
		playerMessage := &pb.Command{
			MsgKey:   "initPlayer",
			MsgVal:   "player",
			RoomId:   roomId,
			PlayerId: player.Id,
			Player:   player,
		}
		log.Println("initPlayer...")
		//client.Room.Broadcast(client, c.EncodeCommand(playerMessage))
		client.Room.BroadcastMessages <- c.EncodeCommand(playerMessage)
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
