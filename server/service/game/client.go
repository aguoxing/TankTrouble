package game

import (
	"github.com/gorilla/websocket"
	"log"
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
		Messages: make(chan []byte, 100),
	}
	return client
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
		log.Println("close======r=====")
	}()
	client.Conn.SetReadLimit(maxMessageSize)
	client.Conn.SetReadDeadline(time.Now().Add(pongWait))
	client.Conn.SetPongHandler(func(string) error { client.Conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		//_, message, err := safeReadMessage(client)
		_, message, err := client.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			break
		}
		// 解析读取的指令 生成新的指令并广播
		CommandSrv.genCommand(client, message)

		//client.Room.Broadcast(client, message)
		// 上面直接调用Broadcast方法 下面将message写入chan 新开goroutine 调用Broadcast2方法 2选1
		//client.Room.BroadcastMessages <- message
	}
}

func (c *Client) WriteMessage(client *Client) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		client.Conn.Close()
		log.Println("close======w=====")
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
			//client.mutex.Lock()
			w, err := client.Conn.NextWriter(websocket.BinaryMessage)
			if err != nil {
				return
			}
			// 处理数据并写入 这里处理or写入时处理？
			//data := c.handleReceiveData(message)
			if _, err = w.Write(message); err != nil {
				log.Println("Failed to write message to the client:", err)
				return
			}
			// 关闭当前写入流
			if err = w.Close(); err != nil {
				log.Println("Failed to close the writer:", err)
				return
			}
			//client.mutex.Unlock()
		case <-ticker.C:
			client.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := client.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
