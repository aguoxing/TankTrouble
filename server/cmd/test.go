package main

import (
	"fmt"
	"math"
)

type Circle struct {
	X      float64
	Y      float64
	Radius float64
}

type Rectangle struct {
	X      float64
	Y      float64
	Width  float64
	Height float64
}

func main() {
	circle := Circle{X: 3, Y: 4, Radius: 2}
	rectangle := Rectangle{X: 1, Y: 1, Width: 6, Height: 4}

	if checkCollision(circle, rectangle) {
		fmt.Println("Collision detected!")
		reflectedDirection := calculateReflection(circle, rectangle)
		fmt.Printf("Reflected direction: %.2f degrees\n", reflectedDirection)
	} else {
		fmt.Println("No collision detected.")
	}
}

func checkCollision(circle Circle, rectangle Rectangle) bool {
	// 计算圆心在矩形局部坐标系中的坐标
	circleX := circle.X - rectangle.X
	circleY := circle.Y - rectangle.Y

	// 计算圆心在矩形局部坐标系中的最近点
	closestX := math.Max(rectangle.X, math.Min(circleX, rectangle.X+rectangle.Width))
	closestY := math.Max(rectangle.Y, math.Min(circleY, rectangle.Y+rectangle.Height))

	// 计算圆心与最近点的距离
	distanceX := circleX - closestX
	distanceY := circleY - closestY
	distanceSquared := distanceX*distanceX + distanceY*distanceY

	// 判断距离是否小于圆的半径的平方，若是则发生碰撞
	return distanceSquared <= circle.Radius*circle.Radius
}

func calculateReflection(circle Circle, rectangle Rectangle) float64 {
	// 计算圆心在矩形局部坐标系中的坐标
	circleX := circle.X - rectangle.X
	circleY := circle.Y - rectangle.Y

	// 计算圆心与矩形的相对位置关系
	relativeX := circleX - rectangle.Width/2
	relativeY := circleY - rectangle.Height/2

	// 计算碰撞角度
	collisionAngle := math.Atan2(relativeY, relativeX)

	// 计算反弹角度
	reflectionAngle := math.Pi - collisionAngle

	// 将反弹角度转换为度数
	reflectionAngleDegrees := reflectionAngle * 180 / math.Pi

	return reflectionAngleDegrees
}
