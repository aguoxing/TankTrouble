package game

import (
	"fmt"
	"log"
	"server/model"
	"server/pb"
	"sync"
	"time"
)

type Room struct {
	RoomId            string `json:"roomId"`
	Name              string `json:"name"`
	Clients           map[*Client]bool
	BroadcastMessages chan []byte
	mutex             sync.Mutex // 互斥锁
	maxClients        int
}

var RoomSrv = new(Room)

var rooms = make(map[string]*Room)

func (*Room) GetOrCreateRoom(roomId string, maxClients int) *Room {
	if room, ok := rooms[roomId]; ok {
		return room
	} else {
		room = &Room{
			RoomId:            roomId,
			Name:              roomId,
			Clients:           make(map[*Client]bool),
			BroadcastMessages: make(chan []byte, 100),
			maxClients:        maxClients,
		}
		rooms[roomId] = room
		return room
	}
}

func (room *Room) Join(client *Client) error {
	room.mutex.Lock()
	defer room.mutex.Unlock()
	log.Println("len(room.Clients) >= room.maxClients", len(room.Clients), room.maxClients)
	if len(room.Clients) >= room.maxClients {
		log.Println(fmt.Sprintf("room[%s] is full", client.Room.Name))
		msg := CommandSrv.EncodeCommand(&pb.Command{
			MsgKey: "notice",
			MsgVal: "room is full",
		})
		client.Messages <- msg
		return fmt.Errorf("room is full")
	}
	room.Clients[client] = true
	for c := range room.Clients {
		if c != client {
			log.Println(fmt.Sprintf("%s joined the room[%s]", client.Name, client.Room.Name))
			msg := CommandSrv.EncodeCommand(&pb.Command{
				MsgKey: "notice",
				MsgVal: fmt.Sprintf("%s joined the room[%s]", client.Name, client.Room.Name),
			})
			c.Messages <- msg
		}
	}

	// todo
	var color string
	if len(room.Clients) == 1 {
		color = "0xff0000"
	} else {
		color = "0x00ff00"
	}
	player := model.TankModel.NewTank(client.ClientId, client.Name, color)
	model.Players[client.Room.RoomId] = append(model.Players[client.Room.RoomId], player)
	return nil
}

func (room *Room) Leave(client *Client) {
	room.mutex.Lock()
	defer room.mutex.Unlock()
	if _, ok := room.Clients[client]; ok {
		delete(room.Clients, client)
		log.Println(fmt.Sprintf("%s leave the room", client.Name))
		for c := range room.Clients {
			msg := CommandSrv.EncodeCommand(&pb.Command{
				MsgKey: "notice",
				MsgVal: fmt.Sprintf("%s leave the room[%s]", client.Name, room.RoomId),
			})
			c.Messages <- msg
		}
		if len(room.Clients) == 0 {
			log.Println(fmt.Sprintf("delete the room[%s]", room.Name))
			delete(rooms, room.RoomId)
			// 删除房间游戏数据
			log.Println(fmt.Sprintf("delete the room[%s] game data", room.Name))
			delete(model.MazeMap, room.RoomId)
			delete(model.Players, room.RoomId)
		}
	}
}

func (room *Room) Broadcast(sender *Client, message []byte) {
	room.mutex.Lock()
	defer room.mutex.Unlock()
	for client := range room.Clients {
		// 延迟500ms 解决阻塞问题
		timeout := time.NewTimer(time.Microsecond * 500)
		// 向所有客户端广播
		//if client != sender {
		select {
		case client.Messages <- message:
			log.Println("广播...")
		case <-timeout.C:
			log.Println(client.Name, "-读取超时...关闭连接...")
			close(client.Messages)
			delete(room.Clients, client)
			//default:
			//	close(client.Messages)
			//	delete(room.Clients, client)
		}
		//}
	}
}

func (room *Room) Broadcast2() {
	defer func() {
		log.Println("close==defer================Broadcast2")
		close(room.BroadcastMessages)
	}()
	for {
		//log.Println("BroadcastMessages===========len=======Broadcast2", len(room.BroadcastMessages))
		select {
		case message := <-room.BroadcastMessages:
			for client := range room.Clients {
				select {
				case client.Messages <- message:
				default:
					log.Println("close==================Broadcast2")
					close(client.Messages)
					delete(room.Clients, client)
				}
			}
		}
	}
}
