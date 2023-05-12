package game

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"google.golang.org/protobuf/proto"
	"log"
	"net/http"
	"server/pb"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Game struct{}

var WsSrv = new(Game)

func (*Game) HandleWebSocket(ctx *gin.Context) {
	roomId := ctx.Param("roomId")

	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// Read client name from client
	_, message, err := conn.ReadMessage()
	if err != nil {
		log.Println(err)
		return
	}

	req := &pb.Command{}
	err2 := proto.Unmarshal(message, req)
	if err2 != nil {
		log.Println("err2", err2)
	}
	var playerName, playerId string
	if req.MsgKey == "connected" {
		playerName = req.MsgVal
		playerId = req.PlayerId
	}

	// Create new client
	client := ClientSrv.NewClient(playerName, playerId, conn)

	// Join room
	room := RoomSrv.GetOrCreateRoom(roomId, 2)
	client.Room = room
	err = room.Join(client)
	if err != nil {
		log.Println(err)
		return
	}

	// Broadcast
	go room.Broadcast2()

	// Start goroutine to read messages from client
	go client.ReadMessage(client)

	// Start goroutine to write messages to client
	go client.WriteMessage(client)
}
