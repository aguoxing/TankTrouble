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
	RoomId     string `json:"roomId"`
	Name       string `json:"name"`
	Clients    map[*Client]bool
	mutex      sync.Mutex // 互斥锁
	maxClients int
}

var RoomModel = new(Room)

var rooms = make(map[string]*Room)

func getOrCreateRoom(roomId string, maxClients int) *Room {
	if room, ok := rooms[roomId]; ok {
		return room
	} else {
		room = &Room{
			RoomId:     roomId,
			Name:       roomId,
			Clients:    make(map[*Client]bool),
			maxClients: maxClients,
		}
		rooms[roomId] = room
		return room
	}
}

func (room *Room) Join(client *Client) error {
	room.mutex.Lock()
	defer room.mutex.Unlock()
	if len(room.Clients) >= room.maxClients {
		msg := client.EncodePb(&pb.GameResp{
			MessageType:  "notice",
			MessageValue: "room is full",
		})
		client.Messages <- msg
		return fmt.Errorf("room is full")
	}
	room.Clients[client] = true
	for c := range room.Clients {
		if c != client {
			log.Println(fmt.Sprintf("%s joined the room[%s]", client.Name, room.Name))
			msg := c.EncodePb(&pb.GameResp{
				MessageType:  "notice",
				MessageValue: fmt.Sprintf("%s joined the room[%s]", client.Name, room.Name),
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
	Players[room.RoomId] = append(Players[room.RoomId], player)
	return nil
}

func (room *Room) Leave(client *Client) {
	room.mutex.Lock()
	defer room.mutex.Unlock()
	if _, ok := room.Clients[client]; ok {
		delete(room.Clients, client)
		log.Println(fmt.Sprintf("%s leave the room", client.Name))
		for c := range room.Clients {
			msg := c.EncodePb(&pb.GameResp{
				MessageType:  "notice",
				MessageValue: fmt.Sprintf("%s leave the room[%s]", client.Name, room.Name),
			})
			c.Messages <- msg
		}
		if len(room.Clients) == 0 {
			log.Println(fmt.Sprintf("delete the room[%s]", room.Name))
			delete(rooms, room.RoomId)
			// 删除房间游戏数据
			log.Println(fmt.Sprintf("delete the room[%s] game data", room.Name))
			delete(RunningData, room.RoomId)
			delete(Players, room.RoomId)
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
		case <-timeout.C:
			log.Println("读取超时...关闭连接...")
			close(client.Messages)
			delete(room.Clients, client)
			//default:
			//	close(client.Messages)
			//	delete(room.Clients, client)
		}
		//}
	}
}
