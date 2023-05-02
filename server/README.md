1.安装protobuf
https://github.com/protocolbuffers/protobuf/releases
环境变量 path 安装目录/bin

测试安装是否成功 cmd protoc 

2.安装protoc-gen-go
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

// 如果配置go环境变量时添加了 则省略这一步
在gopath中找到bin文件夹 添加到环境变量

3.新建proto文件

```protobuf
// 使用proto3语法
syntax = "proto3";

// 生成的go文件是哪个目录的包中，.当前目录 server包名
option go_package = ".;server";

// this is a comment
message Student {
  string name = 1;
  bool male = 2;
  repeated int32 scores = 3;
}
```
protobuf数据类型
```text
double - 双精度浮点数
float - 单精度浮点数
int32, int64, uint32, uint64, sint32, sint64 - 有符号或无符号整数，支持不同的位宽和符号类型
fixed32, fixed64, sfixed32, sfixed64 - 定点数，支持不同的位宽和符号类型
bool - 布尔值
string - 字符串
bytes - 字节串
enum - 枚举类型
message - 自定义消息类型
```

在proto文件夹下执行命令
```shell
protoc --go_out=. hello.proto
```

js 使用protobuf
yarn add protobufjs -D

生成文件
https://www.npmjs.com/package/pbjs
npx pbjs message.proto --ts message.ts

使用：

直接使用生成的js或ts文件，里面有decode和encode方法

接收的数据要是`arraybuffer`类型，解码时 `const buffer = new Uint8Array(event.data)`转换，

再使用decodeMessage(buffer)
