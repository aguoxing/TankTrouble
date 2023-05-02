package model

type Bullet struct {
	Id         string  `json:"id"`
	Form       string  `json:"form"`
	FirstShoot bool    `json:"firstShoot"`
	Color      string  `json:"color"`
	Radius     float64 `json:"radius"`
	Rotation   float64 `json:"rotation"`
	Speed      float64 `json:"speed"`
	Bounces    int32   `json:"bounces"`
}
