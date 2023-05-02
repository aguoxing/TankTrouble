package router

import (
	"github.com/gin-gonic/gin"
	"server/api"
	"server/config"
	"server/middleware"
)

func InitRouter() {
	gin.SetMode(config.AppConfig.Server.Mode)
	r := gin.New()
	r.Use(middleware.Logger())
	r.Use(gin.Recovery())

	gameRoutes := r.Group("game")
	gameApi := &api.GameApi{}
	gameRoutes.GET("/tank/:roomId", gameApi.NewGame)

	chatRoutes := r.Group("chat")
	chatApi := &api.ChatApi{}
	chatRoutes.GET("/:roomId", chatApi.Chat)

	_ = r.Run(config.AppConfig.Server.Port)
}
