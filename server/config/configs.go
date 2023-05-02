package config

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/spf13/viper"
	"os"
	"server/global"
)

var (
	AppConfig         Config
	globalRedisClient *redis.Client
)

type Config struct {
	Server   ServerConfig `yaml:"server"`
	Database DBConfig     `yaml:"database"`
	Logger   LoggerConfig `yaml:"logger"`
	JWT      JWTConfig    `yaml:"jwt"`
	Redis    RedisConfig  `yaml:"redis"`
}

type ServerConfig struct {
	Port string `yaml:"port"`
	Mode string `yaml:"mode"`
}

type DBConfig struct {
	Platform string
	Host     string
	Port     int16
	Dbname   string
	Username string
	Password string
	Arg      string
}

type LoggerConfig struct {
	Path   string
	Level  uint32
	Stdout bool
}

type JWTConfig struct {
	Header     string
	Secret     string
	ExpireTime string
}

type RedisConfig struct {
	Addr     string
	Password string
	RDB      int
}

func InitConfig() {
	//获取项目的执行路径
	path, err := os.Getwd()
	if err != nil {
		//panic(err)
		global.Logger.Error("获取项目路径失败", err)
		return
	}
	cfg := viper.New()
	// 设置读取的文件路径
	cfg.AddConfigPath(path + "/config")
	//cfg.AddConfigPath("/home/go")
	// 设置读取的文件名
	cfg.SetConfigName("config")
	// 设置文件的类型
	cfg.SetConfigType("yaml")
	// 尝试进行配置读取
	if err := cfg.ReadInConfig(); err != nil {
		//global.Logger.Error("配置读取失败", err)
		fmt.Println(err)
		return
	}
	// 将配置文件绑定到 config 上
	err = cfg.Unmarshal(&AppConfig)

	// 初始化redis
	InitRedis()
}

func InitRedis() {
	// https://juejin.cn/post/7027347979065360392
	// https://juejin.cn/post/7034322568014364680
	rdbCfg := AppConfig.Redis
	client := redis.NewClient(&redis.Options{
		Addr:     rdbCfg.Addr,
		Password: rdbCfg.Password,
		DB:       rdbCfg.RDB,
	})
	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		//panic(err)
		global.Logger.Error("redis初始化失败", err)
		return
	}
	globalRedisClient = client
	global.Redis = client
}

func GetRedisClient(ctx context.Context) *redis.Client {
	return globalRedisClient.WithContext(ctx)
}
