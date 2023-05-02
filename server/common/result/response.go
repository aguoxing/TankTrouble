package result

import (
	"net/http"
	"server/common/e"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code int         `json:"code"`
	Data interface{} `json:"data,omitempty"`
	Msg  string      `json:"msg"`
}

func Result(code int, data interface{}, msg string, c *gin.Context) {
	c.JSON(http.StatusOK, Response{
		code,
		data,
		msg,
	})
}

func Ok(c *gin.Context) {
	Result(e.SUCCESS, map[string]interface{}{}, "操作成功", c)
}

func OkWithMessage(message string, c *gin.Context) {
	Result(e.SUCCESS, map[string]interface{}{}, message, c)
}

func OkWithData(data interface{}, c *gin.Context) {
	Result(e.SUCCESS, data, "查询成功", c)
}

func OkWithDetailed(data interface{}, message string, c *gin.Context) {
	Result(e.SUCCESS, data, message, c)
}

func Fail(c *gin.Context) {
	Result(e.ERROR, map[string]interface{}{}, "操作失败", c)
}

func FailWithMessage(message string, c *gin.Context) {
	Result(e.ERROR, map[string]interface{}{}, message, c)
}

func FailWithDetailed(data interface{}, message string, c *gin.Context) {
	Result(e.ERROR, data, message, c)
}

func Forbidden(c *gin.Context) {
	Result(e.FORBIDDEN, map[string]interface{}{}, e.GetMsg(e.FORBIDDEN), c)
}

func Unauthorized(c *gin.Context) {
	Result(e.UNAUTHORIZED, map[string]interface{}{}, e.GetMsg(e.UNAUTHORIZED), c)
}
