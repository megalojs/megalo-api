# megalo-api

重新封装各个端中的API，由 megalo 统一对外抛出方法名。目前微信小程序端提供的 API 最为丰富，所以 API 名称以微信小程序为准。

### 如何使用

```
npm i @megalo/api --save
```

设置全局变量 `Megalo`

```js
// webpack.config.js

plugins: [
  new webpack.ProvidePlugin({
    'Megalo': [path.resolve(`./node_modules/@megalo/api/platforms/${platform}`), 'default']
  })
]
```

### 环境判断

#### Megalo.ENV_TYPE

`ENV_TYPE.WEAPP` 微信小程序环境  
`ENV_TYPE.SWAN` 百度小程序环境  
`ENV_TYPE.ALIPAY` 支付宝小程序环境  
`ENV_TYPE.TOUTIAO` 今日头条小程序环境  
`ENV_TYPE.WEB` WEB(H5)环境

#### Megalo.getEnv()

获取当前环境值，具体值如上 `Megalo.ENV_TYPE`

### API 列表

#### 网络

##### 发起请求

**Megalo.request(Object object)**

发起 HTTPS 网络请求，支持 `Promise` 化使用。

参数

属性 | 类型 | 默认值 | 必填 | 说明 
--- | --- | --- | --- | ---
url | string |  | 是 | 开发者服务器接口地址
data | string/object/ArrayBuffer |  | 否 | 请求的参数
header | Object |  | 否 | 设置请求的 header，header 中不能设置 Referer。`content-type` 默认为 `application/json`
method | string | GET | 否 | HTTP 请求方法
dataType | string | json | 否 | 返回的数据格式
responseType | string | text | 否 | 响应的数据类型（**支付宝不支持**）
success | function |  | 否 | 接口调用成功的回调函数
fail | function |  | 否 | 接口调用失败的回调函数
complete | function |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）

success 返回参数说明:

属性 | 类型 | 说明 
--- | --- | --- 
data | string/Object/Arraybuffer | 开发者服务器返回的数据
statusCode | number | 开发者服务器返回的 HTTP 状态码
header | Object | 开发者服务器返回的 HTTP Response Header

> API 支持度

API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 
--- | --- | --- | --- | --- | ---
request | ✔ | ✔ | ✔ | ✔ | 

##### 上传

**Megalo.uploadFile(Object object)**

将本地资源上传到服务器，支持 `Promise` 化使用。

参数

属性 | 类型 | 默认值 | 必填 | 说明 
--- | --- | --- | --- | ---
url | string |  | 是 | 开发者服务器地址
filePath | string |  | 是 | 要上传文件资源的路径
name | string |  | 是 | 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
header | Object |  | 否 | HTTP 请求 Header，Header 中不能设置 Referer
formData | Object |  | 否 | HTTP 请求中其他额外的 form data
success | function |  | 否 | 接口调用成功的回调函数
fail | function |  | 否 | 接口调用失败的回调函数
complete | function |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）

success 返回参数说明：

属性 | 类型 | 说明 
--- | --- | --- 
data | string | 开发者服务器返回的数据
statusCode | number | 开发者服务器返回的 HTTP 状态码

> API 支持度

API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 
--- | --- | --- | --- | --- | ---
uploadFile | ✔ | ✔ |  | ✔ | 

##### 下载

**Megalo.downloadFile(Object object)**

下载文件资源到本地，支持 `Promise` 化使用。

参数

属性 | 类型 | 默认值 | 必填 | 说明 
--- | --- | --- | --- | ---
url | string |  | 是 | 下载资源 url
header | Object |  | 否 | HTTP 请求的 Header，Header 中不能设置 Referer
filePath | string |  | 否 | 指定文件下载后存储的路径**（仅微信支持）**
success | function |  | 否 | 接口调用成功的回调函数
fail | function |  | 否 | 接口调用失败的回调函数
complete | function |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）

success 返回参数说明：

属性 | 类型 | 说明 
--- | --- | --- 
tempFilePath | string | 临时文件路径。如果没传入 filePath 指定文件存储路径，则下载后的文件会存储到一个临时文件
statusCode | number | 开发者服务器返回的 HTTP 状态码

> API 支持度

API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 
--- | --- | --- | --- | --- | ---
downloadFile | ✔ | ✔ |  | ✔ | 

##### WebSocket

**Megalo.connectSocket(Object object)**

创建一个 Websocket 链接

参数

属性 | 类型 | 默认值 | 必填 | 说明 
--- | --- | --- | --- | ---
url | string |  | 是 | 开发者服务器 wss 接口地址
header | Object |  | 否 | HTTP Header，Header 中不能设置 Referer
protocols | Array.<string> |  | 否 | 子协议数组**（支付宝不支持）**
success | function |  | 否 | 接口调用成功的回调函数
fail | function |  | 否 | 接口调用失败的回调函数
complete | function |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）

返回值

SocketTask

WebSocket 任务，可通过 Megalo.connectSocket 接口创建返回

方法：

*SocketTask.send(Object objct)*

通过 WebSocket 连接发送数据

参数

属性 | 类型 | 默认值 | 必填 | 说明 
--- | --- | --- | --- | ---
data | string/ArrayBuffer |  | 是 | 需要发送的内容
success | function |  | 否 | 接口调用成功的回调函数
fail | function |  | 否 | 接口调用失败的回调函数
complete | function |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）

*SocketTask.close(Object object)*

关闭 WebSocket 连接

参数

属性 | 类型 | 默认值 | 必填 | 说明 
--- | --- | --- | --- | ---
code | number | 1000（表示正常关闭连接） | 否 | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。
reason | string |  | 否 | 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于 123 字节的 UTF-8 文本（不是字符）。
success | function |  | 否 | 接口调用成功的回调函数
fail | function |  | 否 | 接口调用失败的回调函数
complete | function |  | 否 | 接口调用结束的回调函数（调用成功、失败都会执行）

*SocketTask.onOpen(function callback)*

监听 WebSocket 连接打开事件

*SocketTask.onClose(function callback)*

监听 WebSocket 连接关闭事件

*SocketTask.onError(function callback)*

监听 WebSocket 错误事件

*SocketTask.onMessage(function callback)*

监听 WebSocket 接受到服务器的消息事件

**Megalo.sendSocketMessage(Object object)**

通过 WebSocket 连接发送数据，参数同 `SocketTask.send`

**Megalo.closeSocket(Object object)**

关闭 WebSocket 连接，参数同 `SocketTask.close`

**Megalo.onSocketOpen(function callback)**

监听 WebSocket 连接打开事件，参数同 `SocketTask.onOpen`

**Megalo.onSocketClose(function callback)**

监听 WebSocket 连接关闭事件，参数同 `SocketTask.onClose`

**Megalo.onSocketError(function callback)**

监听 WebSocket 错误事件，参数同 `SocketTask.onError`

**Megalo.onSocketMessage(function callback)**

监听 WebSocket 接受到服务器的消息事件，参数同 `SocketTask.onMessage`

> API 支持度

API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 
--- | --- | --- | --- | --- | ---
connectSocket | ✔ | ✔ |  | ✔ | 
sendSocketMessage | ✔ | ✔ |  |  | 
closeSocket | ✔ | ✔ |  |  | 
onSocketOpen | ✔ | ✔ |  |  | 
onSocketClose | ✔ | ✔ |  |  | 
onSocketError | ✔ | ✔ |  |  | 
onSocketMessage | ✔ | ✔ |  |  | 

#### 媒体

##### 图片

