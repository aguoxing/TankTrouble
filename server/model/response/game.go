package response

type Position struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}

type BulletHitWall struct {
	HitWall       bool   `json:"hitWall"`
	WallDirection string `json:"wallDirection"`
}
