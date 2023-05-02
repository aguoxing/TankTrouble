package main

import (
	"server/config"
	"server/router"
)

func main() {
	config.InitConfig()
	router.InitRouter()
}
