package api

import (
	"github.com/gin-gonic/gin"
	"server/service/game"
)

type GameApi struct{}

func (*GameApi) NewGame(ctx *gin.Context) {
	game.GameSrv.HandleWebSocket(ctx)
}
