package utils

import (
	"math"
	"math/rand"
	"time"
)

const charset = "abcdefghijklmnopqrstuvwxyz0123456789"

var seededRand = rand.New(rand.NewSource(time.Now().UnixNano()))

func GenerateRandomCode(length int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

type Vector2 struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}
type Obb struct {
	Position *Vector2 `json:"position"`
	HalfSize *Vector2 `json:"halfSize"`
	Angle    float64  `json:"angle"`
}
type Projection struct {
	Min float64 `json:"Min"`
	Max float64 `json:"Max"`
}

// RectRectIsCollide 判断两个 OBB 是否碰撞，它会先计算出两个 OBB 的轴向量（总共有 4 个轴向量），然后分别对每个轴向量计算投影区间，最后判断投影区间是否重叠。
func RectRectIsCollide(obb1 *Obb, obb2 *Obb) bool {
	axes := make([]*Vector2, 4)
	axis1 := &Vector2{X: math.Cos(obb1.Angle), Y: math.Sin(obb1.Angle)}
	axis2 := &Vector2{X: -math.Sin(obb1.Angle), Y: math.Cos(obb1.Angle)}
	axis3 := &Vector2{X: math.Cos(obb2.Angle), Y: math.Sin(obb2.Angle)}
	axis4 := &Vector2{X: -math.Sin(obb2.Angle), Y: math.Cos(obb2.Angle)}
	axes[0] = axis1
	axes[1] = axis2
	axes[2] = axis3
	axes[3] = axis4

	for i := 0; i < len(axes); i++ {
		axis := axes[i]
		projection1 := getProjection(obb1, axis)
		projection2 := getProjection(obb2, axis)
		if !isOverlap(projection1, projection2) {
			return false
		}
	}
	return true
}

// 计算一个 OBB 在给定轴向量上的投影区间 返回投影区间的最小值和最大值
func getProjection(obb *Obb, axis *Vector2) *Projection {
	vertices := make([]*Vector2, 4)
	v1 := &Vector2{X: -obb.HalfSize.X, Y: -obb.HalfSize.Y}
	v2 := &Vector2{X: obb.HalfSize.X, Y: -obb.HalfSize.Y}
	v3 := &Vector2{X: obb.HalfSize.X, Y: obb.HalfSize.Y}
	v4 := &Vector2{X: -obb.HalfSize.X, Y: obb.HalfSize.Y}

	vertices[0] = v1
	vertices[1] = v2
	vertices[2] = v3
	vertices[3] = v4

	points := make([]*Vector2, len(vertices))
	for i, v := range vertices {
		x := v.X*math.Cos(obb.Angle) - v.Y*math.Sin(obb.Angle) + obb.Position.X
		y := v.X*math.Sin(obb.Angle) + v.Y*math.Cos(obb.Angle) + obb.Position.Y
		points[i] = &Vector2{X: x, Y: y}
	}

	dotProducts := make([]float64, len(points))
	for i, p := range points {
		dotProducts[i] = p.X*axis.X + p.Y*axis.Y
	}
	min := dotProducts[0]
	max := dotProducts[0]
	for _, dp := range dotProducts {
		if dp < min {
			min = dp
		}
		if dp > max {
			max = dp
		}
	}
	return &Projection{Min: min, Max: max}
}

// 判断两个投影区间是否重叠，它只需要判断两个区间的最小值和最大值
func isOverlap(p1 *Projection, p2 *Projection) bool {
	return p1.Min <= p2.Max && p1.Max >= p2.Min
}
