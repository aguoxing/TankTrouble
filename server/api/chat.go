package api

import (
	"github.com/gin-gonic/gin"
	"server/service/chat"
)

type ChatApi struct{}

func (*ChatApi) Chat(ctx *gin.Context) {
	chat.ChatModel.HandleChat(ctx)
}
