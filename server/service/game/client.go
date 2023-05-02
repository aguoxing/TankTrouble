package game

import (
	"github.com/gorilla/websocket"
	"google.golang.org/protobuf/proto"
	"log"
	"server/model"
	"server/pb"
	"sync"
	"time"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

// RunningData Players 临时缓存用 也可用redis
var RunningData = make(map[string]*pb.GameResp)
var Players = make(map[string][]*pb.Tank)

type Client struct {
	ClientId string `json:"ClientId"`
	Name     string `json:"name"`
	Room     *Room
	Conn     *websocket.Conn
	Messages chan []byte
	Quit     chan struct{}
	mutex    sync.Mutex   // 互斥锁
	mu       sync.RWMutex // 读写锁
}

var ClientSrv = new(Client)

func (*Client) NewClient(name string, playerId string, conn *websocket.Conn) *Client {
	client := &Client{
		ClientId: playerId,
		Name:     name,
		Conn:     conn,
		Messages: make(chan []byte, 4),
		Quit:     make(chan struct{}), // 初始化 Quit 通道
	}
	return client
}

func (c *Client) Start() {
	for {
		select {
		case message, ok := <-c.Messages:
			if !ok {
				return
			}
			c.Room.Broadcast(c, message)
		case <-c.Quit:
			close(c.Messages)
			return
		}
	}
}

// SafeReadMessage 读取并发
func safeReadMessage(c *Client) (messageType int, p []byte, err error) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.Conn.ReadMessage()
}

func (*Client) ReadMessage(client *Client) {
	defer func() {
		client.Room.Leave(client)
		client.Conn.Close()
	}()
	client.Conn.SetReadLimit(maxMessageSize)
	client.Conn.SetReadDeadline(time.Now().Add(pongWait))
	client.Conn.SetPongHandler(func(string) error { client.Conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := safeReadMessage(client)
		if err != nil {
			log.Println(err)
			break
		}
		client.Room.Broadcast(client, message)
	}
}

func (c *Client) WriteMessage(client *Client) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		client.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-client.Messages:
			client.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			// 保证每次只有一个协程向 WebSocket 连接写入数据
			// 在 Go 中使用 websocket 时，如果同一个客户端同时发送多条消息，可能会导致连接关闭。
			// 这是因为 websocket 通信是基于帧（frame）的，每一条消息都会被分割成多个帧，而且多条消息之间的帧可以交错发送。
			// 因此，如果在发送第一条消息的同时发送第二条消息，可能会导致多个帧交错发送，而接收方无法正确解析消息。
			client.mutex.Lock()
			w, err := client.Conn.NextWriter(websocket.BinaryMessage)
			if err != nil {
				return
			}
			// 处理数据并写入
			data := c.handleReceiveData(message)
			if _, err = w.Write(data); err != nil {
				log.Println("Failed to write message to the client:", err)
				return
			}
			// 关闭当前写入流
			if err = w.Close(); err != nil {
				log.Println("Failed to close the writer:", err)
				return
			}
			client.mutex.Unlock()
		case <-ticker.C:
			client.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := client.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// handleReceiveData 处理接收的数据
func (c *Client) handleReceiveData(data []byte) []byte {
	decodeData := c.DecodePb(data)
	var gameResp []byte
	switch decodeData.MessageType {
	case "state":
		gameResp = c.handleStateMessage(decodeData.RoomId, decodeData.MessageValue)
		break
	case "move":
		log.Println("move")
		gameResp = c.handleMoveMessage(decodeData.RoomId, decodeData.PlayerId, decodeData.MessageValue)
		break
	case "Fire":
		log.Println("Fire")
		break
	case "Chat":
		gameResp1 := &pb.GameResp{
			MessageType:  decodeData.MessageType,
			MessageValue: decodeData.MessageValue,
		}
		gameResp = c.EncodePb(gameResp1)
		break
	}

	return gameResp
}

func (c *Client) handleStateMessage(roomId string, stateVal string) []byte {
	if stateVal == "start" {
		return c.EncodePb(getRunningData(roomId, stateVal))
	}
	return nil
}

func (c *Client) handleMoveMessage(roomId string, playerId string, stateVal string) []byte {
	roomData := RunningData[roomId]
	playerData := roomData.Players
	for _, player := range playerData {
		if player.Id == playerId {
			model.TankModel.GetNextPosition(roomData.MazeMap, player, stateVal)
		}
	}
	gameResp := &pb.GameResp{
		MessageType:  "move",
		MessageValue: "update",
		Players:      Players[roomId],
	}
	return c.EncodePb(gameResp)
}

func getRunningData(roomId string, stateVal string) *pb.GameResp {
	if d, ok := RunningData[roomId]; ok {
		return d
	} else {
		mazeMap := model.MazeModel.NewMazeMap(850, 550, 100, "4d4d4d", 6)

		gameResp := &pb.GameResp{
			MessageType:  "state",
			MessageValue: "run",
			MazeMap:      mazeMap,
			Players:      Players[roomId],
		}
		// 生成地图后生成玩家随机位置
		for _, player := range gameResp.Players {
			position := model.TankModel.GetPosition(mazeMap)
			player.CenterX = position.X
			player.CenterY = position.Y
		}
		RunningData[roomId] = gameResp
		return gameResp
	}
}

func (*Client) DecodePb(msg []byte) *pb.GameReq {
	// 接收数据 使用protobuf 解码
	req := &pb.GameReq{}
	err2 := proto.Unmarshal(msg, req)
	if err2 != nil {
		log.Println("err2", err2)
		return nil
	}
	return req
}

func (*Client) EncodePb(msg *pb.GameResp) []byte {
	// 回复消息 使用protobuf 编码
	respPb, err3 := proto.Marshal(msg)
	if err3 != nil {
		log.Println("err3", err3)
		return nil
	}
	return respPb
}
