package main

import (
	"fmt"
	"server/utils"
)

func main() {
	maze := utils.GeneratePrimMaze(850, 550, 100)
	fmt.Println(maze)
}
