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

## 环境判断

#### Megalo.ENV_TYPE

`ENV_TYPE.WEAPP` 微信小程序环境  
`ENV_TYPE.SWAN` 百度小程序环境  
`ENV_TYPE.ALIPAY` 支付宝小程序环境  
`ENV_TYPE.TT` 今日头条小程序环境  
`ENV_TYPE.WEB` WEB(H5)环境

#### Megalo.getEnv()

获取当前环境值，具体值如上 `Megalo.ENV_TYPE`

## 网络

### 发起请求

#### Megalo.request(OBJECT)

发起网络请求，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- | :-- |
| url | String | 是 |  | 开发者服务器接口地址 |
| data | Object/String/ArrayBuffer | 否 |  |请求的参数 |
| header | Object | 否 |  | 设置请求的 header，header 中不能设置 Referer。`content-type` 默认为 `application/json` |
| method | String | 否 | GET | （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT |
| dataType | String | 否 | json | 返回的数据格式 |
| responseType | String | 否 | text | 响应的数据类型（**支付宝不支持**） |
| success | Function | 否 |  | 接口调用成功的回调函数 |
| fail | Function | 否 |  | 接口调用失败的回调函数 |
| complete | Function | 否 |  | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| data | Object/String/ArrayBuffer | 开发者服务器返回的数据 |
| statusCode | Number | 开发者服务器返回的 HTTP 状态码 |
| header | Object | 开发者服务器返回的 HTTP Response Header |

**示例代码：**

```js
Megalo.request({
  url: 'test.php',
  data: {
    x: '',
    y: ''
  },
  header: {
    'content-type': 'application/json'
  }
}).then(res => console.log(res.data))

```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.request | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 上传、下载

#### Megalo.uploadFile(OBJECT)

使用方式同 [`wx.uploadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.uploadFile.html)，支持 `Promise` 化使用。

**示例代码：**

```js
const uploadTask = Megalo.uploadFile(params).then(...)
```

#### Megalo.downloadFile(OBJECT)

使用方式同 [`wx.downloadFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.downloadFile.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.downloadFile(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.uploadFile | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.downloadFile | ✔️ | ✔️ | ✔️ | ✔️ |  |

### WebSocket

#### Megalo.connectSocket(OBJECT)

创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 链接。

支持存在最多**两个** WebSocket 链接，每次成功调用 Megalo.connectSocket 会返回一个新的 [SocketTask](native-api.md#sockettask)。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| url | String | 是 | 开发者服务器接口地址，必须是 wss 协议 |
| header | Object | 否 | HTTP Header , header 中不能设置 Referer |
| method | String | 否 | 默认是 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT |
| protocols | StringArray | 否 | 子协议数组 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```js
Megalo.connectSocket({
  url: 'ws://echo.websocket.org/echo',
  success: function () {
    console.log('connect success')
  }
}).then(task => {
  task.onOpen(function () {
    console.log('onOpen')
    task.send({ data: 'xxx' })
  })
  task.onMessage(function (msg) {
    console.log('onMessage: ', msg)
    task.close()
  })
  task.onError(function () {
    console.log('onError')
  })
  task.onClose(function (e) {
    console.log('onClose: ', e)
  })
})
```

#### SocketTask

WebSocket 任务，可通过 [wx.connectSocket()](https://developers.weixin.qq.com/miniprogram/dev/api/wx.connectSocket.html) 接口创建返回。

方法

SocketTask.send(OBJECT)

通过 WebSocket 连接发送数据。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| data | String/ArrayBuffer | 是 | 需要发送的内容 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

SocketTask.close(OBJECT)

关闭 WebSocket 连接。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| code | Number | 否 | 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是 1000 （表示正常连接关闭） |
| reason | String | 否 | 一个可读的字符串，表示连接被关闭的原因 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

SocketTask.onOpen(CALLBACK)

监听 WebSocket 连接打开事件。

SocketTask.onClose(CALLBACK)

监听 WebSocket 连接关闭事件。

**CALLBACK 返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| code | Number | 关闭连接的状态号 |
| reason | String | 连接被关闭的原因 |

SocketTask.onError(CALLBACK)

监听 WebSocket 错误。

**CALLBACK 返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| errMsg | String | 错误信息 |

SocketTask.onMessage(CALLBACK)

监听 WebSocket 接受到服务器的消息事件。

**CALLBACK 返回参数**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| data | String/ArrayBuffer | 服务器返回的消息 |

#### Megalo.onSocketOpen

`@Deprecated` 请使用 **SocketTask.onOpen**

#### Megalo.onSocketError

`@Deprecated` 请使用 **SocketTask.onError**

#### Megalo.sendSocketMessage

`@Deprecated` 请使用 **SocketTask.send**

#### Megalo.onSocketMessage

`@Deprecated` 请使用 **SocketTask.onMessage**

#### Megalo.closeSocket

`@Deprecated` 请使用 **SocketTask.close**

#### Megalo.onSocketClose

`@Deprecated` 请使用 **SocketTask.onClose**

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.connectSocket | ✔️ | ✔️ | ✔️ | ✔️ |  |
| SocketTask | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.onSocketOpen | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.onSocketError | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.sendSocketMessage | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.onSocketMessage | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.closeSocket | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.onSocketClose | ✔️ | ✔️ | ✔️ |  |  |

## 媒体

### 图片

#### Megalo.chooseImage(OBJECT)

使用方式同 [`wx.chooseImage `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseImage.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.chooseImage(params).then(...)
```

#### Megalo.compressImage(OBJECT)

使用方式同 [`wx.compressImage `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.compressImage.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.compressImage(params).then(...)
```

#### Megalo.previewImage(OBJECT)

使用方式同 [`wx.previewImage`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.previewImage.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.previewImage(params).then(...)
```

#### Megalo.getImageInfo(OBJECT)

使用方式同 [`wx.getImageInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getImageInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getImageInfo(params).then(...)
```

#### Megalo.saveImageToPhotosAlbum(OBJECT)

使用方式同 [`wx.saveImageToPhotosAlbum`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.saveImageToPhotosAlbum.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.saveImageToPhotosAlbum(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.chooseImage | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.compressImage | ✔️ |  | ✔️ |  |  |
| Megalo.previewImage | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.getImageInfo | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.saveImageToPhotosAlbum | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 实时音视频

#### Megalo.createLivePlayerContext(liveId, this.$scope)

使用方式同 [`wx.createLivePlayerContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createLivePlayerContext.html)。

**示例代码：**

```jsx
const livePlayerContext = Megalo.createLivePlayerContext('mylive')
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.createLivePlayerContext | ✔️ | ✔️ |  |  |  |


### 录音管理

#### Megalo.getRecorderManager()

使用方式同 [`wx.getRecorderManager`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getRecorderManager.html)。

**示例代码：**

```jsx
const recorderManager = Megalo.getRecorderManager()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getRecorderManager | ✔️ | ✔️ |  | ✔️ |  |

### 背景音频播放管理

#### Megalo.getBackgroundAudioManager()

使用方式同 [`wx.getBackgroundAudioManager`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBackgroundAudioManager.html)。

**示例代码：**

```js
const backgroundAudioManager = Megalo.getBackgroundAudioManager()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getBackgroundAudioManager | ✔️ | ✔️ |  |  |  |

### 音频组件控制

#### Megalo.createInnerAudioContext()

使用方式同 [`wx.createInnerAudioContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createInnerAudioContext.html)。

**示例代码：**

```js
const innerAudioContext = Megalo.createInnerAudioContext()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.createInnerAudioContext | ✔️ | ✔️ |  | ✔️ |  |

### 视频

#### Megalo.chooseVideo(OBJECT)

使用方式同 [`wx.chooseVideo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseVideo.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.chooseVideo(params).then(...)
```

#### Megalo.saveVideoToPhotosAlbum(OBJECT)

使用方式同 [`wx.saveVideoToPhotosAlbum`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.saveVideoToPhotosAlbum.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.saveVideoToPhotosAlbum(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.chooseVideo | ✔️ | ✔️ |  | ✔️ |  |
| Megalo.saveVideoToPhotosAlbum | ✔️ | ✔️ |  | ✔️ |  |

### 视频组件控制

#### Megalo.createVideoContext(videoId, this.$scope)

使用方式同 [`wx.createVideoContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createVideoContext.html)。

**示例代码：**

```js
const videoContext = Megalo.createVideoContext('myVideo')
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.createVideoContext | ✔️ | ✔️ |  |  |  |

### 相机组件控制

#### Megalo.createCameraContext()

使用方式同 [`wx.createCameraContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createCameraContext.html)。

**示例代码：**

```js
const cameraContext = Megalo.createCameraContext()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.createCameraContext | ✔️ | ✔️ |  |  |  |

## 文件

#### Megalo.saveFile(OBJECT)

使用方式同 [`wx.saveFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.saveFile.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.saveFile(params).then(...)
```

#### Megalo.getFileInfo(OBJECT)

使用方式同 [`wx.getFileInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getFileInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getFileInfo(params).then(...)
```

#### Megalo.getSavedFileList(OBJECT)

使用方式同 [`wx.getSavedFileList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSavedFileList.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getSavedFileList(params).then(...)
```

#### Megalo.getSavedFileInfo(OBJECT)

使用方式同 [`wx.getSavedFileInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSavedFileInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getSavedFileInfo(params).then(...)
```

#### Megalo.removeSavedFile(OBJECT)

使用方式同 [`wx.removeSavedFile`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.removeSavedFile.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.removeSavedFile(params).then(...)
```

#### Megalo.openDocument(OBJECT)

使用方式同 [`wx.openDocument`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openDocument.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.openDocument(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.saveFile | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.getFileInfo | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.getSavedFileList | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.getSavedFileInfo | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.removeSavedFile | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.openDocument | ✔️ | ✔️ |  |  |  |

## 数据缓存

#### Megalo.setStorage(OBJECT)

将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |
| data | Object/String | 是 | 需要存储的内容 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```js
Megalo.setStorage({ key: 'key', data: 'value' })
  .then(res => console.log(res))
```

#### Megalo.setStorageSync(KEY, DATA)

将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |
| data | Object/String | 是 | 需要存储的内容 |

**示例代码：**

```js
Megalo.setStorageSync('key', 'value')
```

#### Megalo.getStorage(OBJECT)

从本地缓存中异步获取指定 key 对应的内容，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| data | String | key 对应的内容 |

**示例代码：**

```js
Megalo.getStorage({ key: 'key' })
  .then(res => console.log(res.data))
```

#### Megalo.getStorageSync(KEY)

从本地缓存中同步获取指定 key 对应的内容。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |

**示例代码：**

```js
const data = Megalo.getStorageSync('key')
```

#### Megalo.getStorageInfo(OBJECT)

异步获取当前 storage 的相关信息，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| success | Function | 否 | 接口调用成功的回调函数，详见返回参数说明 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| keys | String Array | 当前 storage 中所有的 key |

**示例代码：**

```js
Megalo.getStorageInfo()
  .then(res => console.log(res.keys))
```

#### Megalo.getStorageInfoSync()

同步获取当前 storage 的相关信息。

**示例代码：**

```js
const res = Megalo.getStorageInfoSync()
console.log(res.keys)
```

#### Megalo.removeStorage(OBJECT)

从本地缓存中异步移除指定 key，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| keys | String | 是 | 本地缓存中的指定的 key |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```js
Megalo.removeStorage({ key: 'key' })
  .then(res => console.log(res))
```

#### Megalo.removeStorageSync(KEY)

从本地缓存中同步移除指定 key 。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| key | String | 是 | 本地缓存中的指定的 key |

**示例代码：**

```js
Megalo.removeStorageSync('key')
```

#### Megalo.clearStorage()

清理本地数据缓存。

**示例代码：**

```js
Megalo.clearStorage()
```

#### Megalo.clearStorageSync()

同步清理本地数据缓存

**示例代码：**

```js
Megalo.clearStorageSync()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.setStorage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.setStorageSync | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.getStorage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.getStorageSync | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.getStorageInfo | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.getStorageInfoSync | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.removeStorage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.removeStorageSync | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.clearStorage | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Megalo.clearStorageSync | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

## 位置

### 获取位置

#### Megalo.getLocation(OBJECT)

使用方式同 [`wx.getLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getLocation.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getLocation(params).then(...)
```

#### Megalo.chooseLocation(OBJECT)

使用方式同 [`wx.chooseLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseLocation.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.chooseLocation(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getLocation | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.chooseLocation | ✔️ | ✔️ | ✔️ |  |  |

### 查看位置

#### Megalo.openLocation(OBJECT)

使用方式同 [`wx.openLocation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openLocation.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.openLocation(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.openLocation | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 地图组件控制

#### Megalo.createMapContext(mapId, this.$scope)

使用方式同 [`wx.createMapContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createMapContext.html)。

**示例代码：**

```js
const mapCtx = Megalo.createMapContext('myMap')
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.createMapContext | ✔️ | ✔️ | ✔️ |  |  |

## 设备

### 系统信息

#### Megalo.getSystemInfo(OBJECT)

获取系统信息，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| success | Function | 否 | 接口调用成功的回调函数，详见返回参数说明 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| brand | 手机品牌 |
| model | 手机型号 |
| system | 操作系统版本 |
| pixelRatio | 设备像素比 |
| screenWidth | 屏幕宽度 |
| screenHeight | 屏幕高度 |
| windowWidth | 可使用窗口宽度 |
| windowHeight | 可使用窗口高度 |
| version | 微信版本号 |
| statusBarHeight | 状态栏的高度 |
| platform | 客户端平台 |
| language | 微信设置的语言 |
| fontSizeSetting | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px |
| SDKVersion | 客户端基础库版本 |

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

**示例代码：**

```js
Megalo.getSystemInfo({
  success: res => console.log(res)
})
  .then(res => console.log(res))
```

#### Megalo.getSystemInfoSync()

获取系统信息同步接口。

**同步返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| brand | 手机品牌 |
| model | 手机型号 |
| system | 操作系统版本 |
| pixelRatio | 设备像素比 |
| screenWidth | 屏幕宽度 |
| screenHeight | 屏幕高度 |
| windowWidth | 可使用窗口宽度 |
| windowHeight | 可使用窗口高度 |
| version | 微信版本号 |
| statusBarHeight | 状态栏的高度 |
| platform | 客户端平台 |
| language | 微信设置的语言 |
| fontSizeSetting | 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px |
| SDKVersion | 客户端基础库版本 |

注意：**H5** 端不支持 version、statusBarHeight、fontSizeSetting、SDKVersion

**示例代码：**

```js
const res = Megalo.getSystemInfoSync()
console.log(res.model)
console.log(res.pixelRatio)
console.log(res.windowWidth)
console.log(res.windowHeight)
console.log(res.language)
console.log(res.version)
console.log(res.platform)
```

#### Megalo.canIUse(String)

使用方式同 [`wx.canIUse`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canIUse.html)。

**示例代码：**

```js
Megalo.canIUse('openBluetoothAdapter')
Megalo.canIUse('getSystemInfoSync.return.screenWidth')
Megalo.canIUse('getSystemInfo.success.screenWidth')
Megalo.canIUse('showToast.object.image')
Megalo.canIUse('onCompassChange.callback.direction')
Megalo.canIUse('request.object.method.GET')
Megalo.canIUse('live-player')
Megalo.canIUse('text.selectable')
Megalo.canIUse('button.open-type.contact')
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getSystemInfo | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.getSystemInfoSync | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.canIUse | ✔️ | ✔️ | ✔️ |  |  |

### 网络状态

#### Megalo.getNetworkType(OBJECT)

获取网络类型，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| success | Function | 否 | 接口调用成功的回调函数，返回网络类型 networkType |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数 | 说明 |
| :-- | :-- |
| networkType | 网络类型 |


**networkType 有效值：**

| 参数 | 说明 |
| :-- | :-- |
| wifi | wifi 网络 |
| 2g | 2g 网络 |
| 3g | 3g 网络 |
| 4g | 4g 网络 |
| none | 无网络 |
| unknow | Android 下不常见的网络类型 |

**注意：**

**H5** 下此 API 兼容性较差，详见 [Can I use](https://caniuse.com/#search=connection)。并且标准不一，对于三种规范分别支持的 networkType 有效值如下。

* 仅支持不符合规范的 navigator.connetion.type，[详情](https://www.davidbcalhoun.com/2010/using-navigator-connection-android/)。networkType 有效值为：'wifi'、'3g'、'2g'、'unknown'。
* 支持 navigator.connetion.type。networkType 有效值为：'cellular'、'wifi'、'none'。
* 支持 navigator.connetion.effectiveType。networkType 有效值为：'slow-2g'、'2g'、'3g'、'4g'。

**示例代码：**

```js
Megalo.getNetworkType({
  success: res => console.log(res.networkType)
})
  .then(res => console.log(res.networkType))
```

#### Megalo.onNetworkStatusChange(CALLBACK)

监听网络状态变化。

**CALLBACK 返回参数：**

| 参数 | 类型 | 说明 |
| :-- | :-- | :-- |
| isConnected | Boolean | 当前是否有网络连接 |
| networkType | String | 网络类型 |

注意：**H5** 端兼容情况较差，只有当 navigator.connection 支持监听 onChange 事件时才会生效。

**示例代码：**

```js
Megalo.onNetworkStatusChange(res => {
  console.log(res.isConnected)
  console.log(res.networkType)
})
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getNetworkType | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.onNetworkStatusChange | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 加速度计

#### Megalo.onAccelerometerChange(CALLBACK)

使用方式同 [`wx.onAccelerometerChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onAccelerometerChange.html)。

**示例代码：**

```js
Megalo.onAccelerometerChange(res => {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

#### Megalo.startAccelerometer(OBJECT)

使用方式同 [`wx.startAccelerometer`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startAccelerometer.html)。

**示例代码：**

```js
Megalo.startAccelerometer({ interval: 'game' })
```

#### Megalo.stopAccelerometer(OBJECT)

使用方式同 [`wx.stopAccelerometer`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopAccelerometer.html)。

**示例代码：**

```js
Megalo.stopAccelerometer()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.onAccelerometerChange | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.startAccelerometer | ✔️ | ✔️ |  | ✔️ |  |
| Megalo.stopAccelerometer | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 罗盘

#### Megalo.onCompassChange(CALLBACK)

使用方式同 [`wx.onCompassChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onCompassChange.html)。

**示例代码：**

```js
Megalo.onCompassChange(res => {
  console.log(res.direction)
})
```

#### Megalo.startCompass(OBJECT)

使用方式同 [`wx.startCompass`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startCompass.html)。

**示例代码：**

```js
Megalo.startCompass()
```

#### Megalo.stopCompass(OBJECT)

使用方式同 [`wx.stopCompass`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopCompass.html)。

**示例代码：**

```js
Megalo.stopCompass()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.onCompassChange | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.startCompass | ✔️ | ✔️ |  | ✔️ |  |
| Megalo.stopCompass | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 陀螺仪

#### Megalo.onGyroscopeChange(CALLBACK)

使用方式同 [`wx.onGyroscopeChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onGyroscopeChange.html)。

**示例代码：**

```js
Megalo.onGyroscopeChange(res => {
  console.log(res.x)
  console.log(res.y)
  console.log(res.z)
})
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.onGyroscopeChange | ✔️ |  | ✔️ |  |  |

### 拨打电话

#### Megalo.makePhoneCall(OBJECT)

拨打电话，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| phoneNumber | String | 是 | 需要拨打的电话号码 |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```js
Megalo.makePhoneCall({
  phoneNumber: '10086'
})
  .then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.makePhoneCall | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 扫码

#### Megalo.scanCode(OBJECT)

使用方式同 [`wx.scanCode`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.scanCode.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.scanCode(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.scanCode | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 剪贴板

#### Megalo.setClipboardData(OBJECT)

使用方式同 [`wx.setClipboardData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setClipboardData.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setClipboardData(params).then(...)
```

#### Megalo.getClipboardData(OBJECT)

使用方式同 [`wx.getClipboardData`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getClipboardData.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getClipboardData(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.setClipboardData | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.getClipboardData | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 蓝牙

#### Megalo.openBluetoothAdapter(OBJECT)

使用方式同 [`wx.openBluetoothAdapter`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openBluetoothAdapter.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.openBluetoothAdapter(params).then(...)
```

#### Megalo.closeBluetoothAdapter(OBJECT)

使用方式同 [`wx.closeBluetoothAdapter`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.closeBluetoothAdapter.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.closeBluetoothAdapter(params).then(...)
```

#### Megalo.getBluetoothAdapterState(OBJECT)

使用方式同 [`wx.getBluetoothAdapterState`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBluetoothAdapterState.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getBluetoothAdapterState(params).then(...)
```

#### Megalo.onBluetoothAdapterStateChange(CALLBACK)

使用方式同 [`wx.onBluetoothAdapterStateChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBluetoothAdapterStateChange.html)。

**示例代码：**

```js
Megalo.onBluetoothAdapterStateChange(res => {
  console.log(`adapterState changed, now is`, res)
})
```

#### Megalo.startBluetoothDevicesDiscovery(OBJECT)

使用方式同 [`wx.startBluetoothDevicesDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startBluetoothDevicesDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.startBluetoothDevicesDiscovery(params).then(...)
```

#### Megalo.stopBluetoothDevicesDiscovery(OBJECT)

使用方式同 [`wx.stopBluetoothDevicesDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopBluetoothDevicesDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.stopBluetoothDevicesDiscovery(params).then(...)
```

#### Megalo.getBluetoothDevices(OBJECT)

使用方式同 [`wx.getBluetoothDevices`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBluetoothDevices.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getBluetoothDevices(params).then(...)
```

#### Megalo.getConnectedBluetoothDevices(OBJECT)

使用方式同 [`wx.getConnectedBluetoothDevices`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getConnectedBluetoothDevices.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getConnectedBluetoothDevices(params).then(...)
```

#### Megalo.onBluetoothDeviceFound(CALLBACK)

使用方式同 [`wx.onBluetoothDeviceFound `](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBluetoothDeviceFound.html)。

**示例代码：**

```js
Megalo.onBluetoothDeviceFound(devices => {
  console.log(devices)
  console.log(devices[0].advertisData)
})
```

#### Megalo.createBLEConnection(OBJECT)

使用方式同 [`wx.createBLEConnection`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createBLEConnection.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.createBLEConnection(params).then(...)
```

#### Megalo.closeBLEConnection(OBJECT)

使用方式同 [`wx.closeBLEConnection`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.closeBLEConnection.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.closeBLEConnection(params).then(...)
```

#### Megalo.getBLEDeviceServices(OBJECT)

使用方式同 [`wx.getBLEDeviceServices`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBLEDeviceServices.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getBLEDeviceServices(params).then(...)
```

#### Megalo.getBLEDeviceCharacteristics(OBJECT)

使用方式同 [`wx.getBLEDeviceCharacteristics`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBLEDeviceCharacteristics.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getBLEDeviceCharacteristics(params).then(...)
```

#### Megalo.readBLECharacteristicValue(OBJECT)

使用方式同 [`wx.readBLECharacteristicValue`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.readBLECharacteristicValue.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.readBLECharacteristicValue(params).then(...)
```

#### Megalo.writeBLECharacteristicValue(OBJECT)

使用方式同 [`wx.writeBLECharacteristicValue`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.writeBLECharacteristicValue.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.writeBLECharacteristicValue(params).then(...)
```

#### Megalo.notifyBLECharacteristicValueChange(OBJECT)

使用方式同 [`wx.notifyBLECharacteristicValueChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.notifyBLECharacteristicValueChange.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.notifyBLECharacteristicValueChange(params).then(...)
```

#### Megalo.onBLEConnectionStateChange(CALLBACK)

使用方式同 [`wx.onBLEConnectionStateChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBLEConnectionStateChange.html)。

**示例代码：**

```js
Megalo.onBLEConnectionStateChange(res => {
  // 该方法回调中可以用于处理连接意外断开等异常情况
  console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
})
```

#### Megalo.onBLECharacteristicValueChange(CALLBACK)

使用方式同 [`wx.onBLECharacteristicValueChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBLECharacteristicValueChange.html)。

**示例代码：**

```js
Megalo.onBLECharacteristicValueChange(res => {
  console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
  console.log(res.value)
})
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.openBluetoothAdapter | ✔️ |  | ✔️ |  |  |
| Megalo.closeBluetoothAdapter | ✔️ |  | ✔️ |  |  |
| Megalo.getBluetoothAdapterState | ✔️ |  | ✔️ |  |  |
| Megalo.onBluetoothAdapterStateChange | ✔️ |  | ✔️ |  |  |
| Megalo.startBluetoothDevicesDiscovery | ✔️ |  | ✔️ |  |  |
| Megalo.stopBluetoothDevicesDiscovery | ✔️ |  | ✔️ |  |  |
| Megalo.getBluetoothDevices | ✔️ |  | ✔️ |  |  |
| Megalo.getConnectedBluetoothDevices | ✔️ |  | ✔️ |  |  |
| Megalo.onBluetoothDeviceFound | ✔️ |  | ✔️ |  |  |
| Megalo.createBLEConnection | ✔️ |  | ✔️ |  |  |
| Megalo.closeBLEConnection | ✔️ |  | ✔️ |  |  |
| Megalo.getBLEDeviceServices | ✔️ |  | ✔️ |  |  |
| Megalo.getBLEDeviceCharacteristics | ✔️ |  | ✔️ |  |  |
| Megalo.readBLECharacteristicValue | ✔️ |  | ✔️ |  |  |
| Megalo.writeBLECharacteristicValue | ✔️ |  | ✔️ |  |  |
| Megalo.notifyBLECharacteristicValueChange | ✔️ |  | ✔️ |  |  |
| Megalo.onBLEConnectionStateChange | ✔️ |  | ✔️ |  |  |
| Megalo.onBLECharacteristicValueChange | ✔️ |  | ✔️ |  |  |

### iBeacon

#### Megalo.startBeaconDiscovery(OBJECT)

使用方式同 [`wx.startBeaconDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startBeaconDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.startBeaconDiscovery(params).then(...)
```

#### Megalo.stopBeaconDiscovery(OBJECT)

使用方式同 [`wx.stopBeaconDiscovery`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopBeaconDiscovery.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.stopBeaconDiscovery(params).then(...)
```

#### Megalo.getBeacons(OBJECT)

使用方式同 [`wx.getBeacons`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getBeacons.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getBeacons(params).then(...)
```

#### Megalo.onBeaconUpdate(CALLBACK)

使用方式同 [`wx.onBeaconUpdate`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBeaconUpdate.html)。

#### Megalo.onBeaconServiceChange(CALLBACK)

使用方式同 [`wx.onBeaconServiceChange`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onBeaconServiceChange.html)。

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.startBeaconDiscovery | ✔️ |  | ✔️ |  |  |
| Megalo.stopBeaconDiscovery | ✔️ |  | ✔️ |  |  |
| Megalo.getBeacons | ✔️ |  | ✔️ |  |  |
| Megalo.onBeaconUpdate | ✔️ |  | ✔️ |  |  |
| Megalo.onBeaconServiceChange | ✔️ |  | ✔️ |  |  |

### 屏幕亮度

#### Megalo.setScreenBrightness(OBJECT)

使用方式同 [`wx.setScreenBrightness`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setScreenBrightness.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setScreenBrightness(params).then(...)
```

#### Megalo.getScreenBrightness(OBJECT)

使用方式同 [`wx.getScreenBrightness`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getScreenBrightness.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getScreenBrightness(params).then(...)
```

#### Megalo.setKeepScreenOn(OBJECT)

使用方式同 [`wx.setKeepScreenOn`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setKeepScreenOn.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setKeepScreenOn(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.setScreenBrightness | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.getScreenBrightness | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.setKeepScreenOn | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 用户截屏事件

#### Megalo.onUserCaptureScreen(CALLBACK)

监听用户主动截屏事件，用户使用系统截屏按键截屏时触发此事件。

**示例代码：**

```js
Megalo.onUserCaptureScreen(() => {
    console.log('用户截屏了')
})
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.onUserCaptureScreen | ✔️ | ✔️ | ✔️ |  |  |

### 振动

#### Megalo.vibrateLong(OBJECT)

使用方式同 [`wx.vibrateLong`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.vibrateLong.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.vibrateLong(params).then(...)
```

#### Megalo.vibrateShort(OBJECT)

使用方式同 [`wx.vibrateShort`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.vibrateShort.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.vibrateShort(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.vibrateLong | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.vibrateShort | ✔️ | ✔️ | ✔️ |  |  |

### 手机联系人

#### Megalo.addPhoneContact(OBJECT)

使用方式同 [`wx.addPhoneContact`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.addPhoneContact.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.addPhoneContact(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.addPhoneContact | ✔️ | ✔️ | ✔️ |  |  |

### Wi-Fi

#### Megalo.startWifi(OBJECT)

使用方式同 [`wx.startWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.startWifi(params).then(...)
```

#### Megalo.stopWifi(OBJECT)

使用方式同 [`wx.stopWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.stopWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.stopWifi(params).then(...)
```

#### Megalo.connectWifi(OBJECT)

使用方式同 [`wx.connectWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.connectWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.connectWifi(params).then(...)
```

#### Megalo.getWifiList(OBJECT)

使用方式同 [`wx.getWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getWifiList.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getWifiList(params).then(...)
```

#### Megalo.onGetWifiList(CALLBACK)

使用方式同 [`wx.onGetWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onGetWifiList.html)。

#### Megalo.setWifiList(OBJECT)

使用方式同 [`wx.setWifiList`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setWifiList.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setWifiList(params).then(...)
```

#### Megalo.onWifiConnected(CALLBACK)

使用方式同 [`wx.onWifiConnected`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onWifiConnected.html)。

#### Megalo.getConnectedWifi(OBJECT)

使用方式同 [`wx.getConnectedWifi`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getConnectedWifi.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getConnectedWifi(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.startWifi | ✔️ |  |  |  |  |
| Megalo.stopWifi | ✔️ |  |  |  |  |
| Megalo.connectWifi | ✔️ |  |  |  |  |
| Megalo.getWifiList | ✔️ |  |  |  |  |
| Megalo.onGetWifiList | ✔️ |  |  |  |  |
| Megalo.setWifiList | ✔️ |  |  |  |  |
| Megalo.onWifiConnected | ✔️ |  |  |  |  |
| Megalo.getConnectedWifi | ✔️ |  |  | ✔️ |  |

## 界面

### 交互反馈

#### Megalo.showToast(OBJECT)

显示消息提示框，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的内容 |
| icon | String | 否 | 图标，有效值 "success", "loading", "none" |
| image | String | 否 | 自定义图标的本地路径，image 的优先级高于 icon |
| duration | Number | 否 | 提示的延迟时间，单位毫秒，默认：1500 |
| mask | Boolean | 否 | 是否显示透明蒙层，防止触摸穿透，默认：false |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**icon 有效值**

| 有效值 | 说明 |
| :-- | :-- |
| success | 显示成功图标 |
| loading | 显示加载图标 |
| none | 不显示图标 |

**示例代码：**

```js
Megalo.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
  .then(res => console.log(res))
```

#### Megalo.showLoading(OBJECT)

显示 loading 提示框, 需主动调用 Megalo.hideLoading 才能关闭提示框，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的内容 |
| mask | Boolean | 否 | 是否显示透明蒙层，防止触摸穿透，默认：false |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**示例代码：**

```js
Megalo.showLoading({
  title: 'loading'
})
  .then(res => console.log(res))
```

#### Megalo.hideToast()

隐藏消息提示框

#### Megalo.hideLoading()

隐藏 loading 提示框

#### Megalo.showModal(OBJECT)

​显示模态弹窗，支持 `Promise` 化使用。

**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| title | String | 是 | 提示的标题 |
| content | String | 是 | 提示的内容 |
| showCancel | Boolean | 否 | 是否显示取消按钮，默认为 true |
| cancelText | String | 否 | 取消按钮的文字，默认为"取消"，最多 4 个字符 |
| cancelColor | HexColor | 否 | 取消按钮的文字颜色，默认为"#000000" |
| confirmText | String | 否 | 确定按钮的文字，默认为"确定"，最多 4 个字符 |
| confirmColor | HexColor | 否 | 确定按钮的文字颜色，默认为"#3CC51F" |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数值 | 类型 | 说明 |
| :-- | :-- | :-- |
| confirm | Boolean | 为 true 时，表示用户点击了确定按钮 |
| cancel | Boolean | 为 true 时，表示用户点击了取消 |

**示例代码：**

```js
// 注意：无论用户点击确定还是取消，Promise 都会 resolve。
Megalo.showModal({
  title: 'xxx',
  content: 'hello world',
})
  .then(res => console.log(res.confirm, res.cancel))
```

#### Megalo.showActionSheet(OBJECT)

显示操作菜单，支持 `Promise` 化使用。

​**OBJECT 参数说明：**

| 参数 | 类型 | 必填 | 说明 |
| :-- | :-- | :-- | :-- |
| itemList | String Array | 是 | 按钮的文字数组，数组长度最大为 6 个 |
| itemColor | HexColor | 否 | 按钮的文字颜色，默认为"#000000" |
| success | Function | 否 | 接口调用成功的回调函数 |
| fail | Function | 否 | 接口调用失败的回调函数 |
| complete | Function | 否 | 接口调用结束的回调函数（调用成功、失败都会执行） |

**success 返回参数说明：**

| 参数值 | 类型 | 说明 |
| :-- | :-- | :-- |
| tapIndex | Number | 用户点击的按钮，从上到下的顺序，从 0 开始 |

```js
// 注意：当用户点击选项时 Promise 会 resolve，而当用户点击取消或蒙层时，Promise 会 reject。
Megalo.showActionSheet({
  itemList: ['a', 'b', 'c']
})
  .then(res => console.log(res.errMsg, res.tapIndex))
  .catch(err => console.log(res.errMsg))
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.showToast | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.showLoading | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.hideToast | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.hideLoading | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.showModal | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.showActionSheet | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 设置导航条

#### Megalo.setNavigationBarTitle(OBJECT)

使用方式同 [`wx.setNavigationBarTitle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setNavigationBarTitle.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setNavigationBarTitle(params).then(...)
```

#### Megalo.showNavigationBarLoading()

在当前页面显示导航条加载动画。

#### Megalo.hideNavigationBarLoading()

隐藏导航条加载动画。

#### Megalo.setNavigationBarColor(OBJECT)

使用方式同 [`wx.setNavigationBarColor`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setNavigationBarColor.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setNavigationBarColor(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.setNavigationBarTitle | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.showNavigationBarLoading | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.hideNavigationBarLoading | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.setNavigationBarColor | ✔️ | ✔️ | ✔️ |  |  |

### 设置 tabBar

#### Megalo.setTabBarBadge(OBJECT)

使用方式同 [`wx.setTabBarBadge`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setTabBarBadge.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setTabBarBadge(params).then(...)
```

#### Megalo.removeTabBarBadge(OBJECT)

使用方式同 [`wx.removeTabBarBadge`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.removeTabBarBadge.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.removeTabBarBadge(params).then(...)
```

#### Megalo.showTabBarRedDot(OBJECT)

使用方式同 [`wx.showTabBarRedDot`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.showTabBarRedDot.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.showTabBarRedDot(params).then(...)
```

#### Megalo.hideTabBarRedDot(OBJECT)

使用方式同 [`wx.hideTabBarRedDot`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.hideTabBarRedDot.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.hideTabBarRedDot(params).then(...)
```

#### Megalo.setTabBarStyle(OBJECT)

使用方式同 [`wx.setTabBarStyle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setTabBarStyle.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setTabBarStyle(params).then(...)
```

#### Megalo.setTabBarItem(OBJECT)

使用方式同 [`wx.setTabBarItem`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.setTabBarItem.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.setTabBarItem(params).then(...)
```

#### Megalo.showTabBar(OBJECT)

使用方式同 [`wx.showTabBar`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.showTabBar.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.showTabBar(params).then(...)
```

#### Megalo.hideTabBar(OBJECT)

使用方式同 [`wx.hideTabBar`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.hideTabBar.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.hideTabBar(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.setTabBarBadge | ✔️ | ✔️ |  |  |  |
| Megalo.removeTabBarBadge | ✔️ | ✔️ |  |  |  |
| Megalo.showTabBarRedDot | ✔️ | ✔️ |  |  |  |
| Megalo.hideTabBarRedDot | ✔️ | ✔️ |  |  |  |
| Megalo.setTabBarStyle | ✔️ | ✔️ |  |  |  |
| Megalo.setTabBarItem | ✔️ | ✔️ |  |  |  |
| Megalo.showTabBar | ✔️ | ✔️ |  |  |  |
| Megalo.hideTabBar | ✔️ | ✔️ |  |  |  |

### 导航

#### Megalo.navigateTo(OBJECT)

使用方式同 [`wx.navigateTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateTo.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.navigateTo(params).then(...)
```

#### Megalo.redirectTo(OBJECT)

使用方式同 [`wx.redirectTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.redirectTo.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.redirectTo(params).then(...)
```

#### Megalo.switchTab(OBJECT)

使用方式同 [`wx.switchTab`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.switchTab.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.switchTab(params).then(...)
```

#### Megalo.navigateBack(OBJECT)

使用方式同 [`wx.navigateBack`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateBack.html)。

**示例代码：**

```js
Megalo.navigateBack({ delta: 2 })
```

#### Megalo.reLaunch(OBJECT)

使用方式同 [`wx.reLaunch`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.reLaunch.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.reLaunch(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.navigateTo | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.redirectTo | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.switchTab | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.navigateBack | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.reLaunch | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 动画

#### Megalo.createAnimation(OBJECT)

使用方式同 [`wx.createAnimation`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createAnimation.html)。

**示例代码：**

```js
const animation = Megalo.createAnimation({
  transformOrigin: "50% 50%",
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.createAnimation | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 位置

#### Megalo.pageScrollTo(OBJECT)

使用方式同 [`wx.pageScrollTo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.pageScrollTo.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.pageScrollTo(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.pageScrollTo | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 绘图

#### Megalo.createCanvasContext(canvasId, this.$scope)

使用方式同 [`wx.createCanvasContext`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createCanvasContext.html)。

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.createCanvasContext | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 下拉刷新

#### Megalo.startPullDownRefresh(OBJECT)

使用方式同 [`wx.startPullDownRefresh`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.startPullDownRefresh.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.startPullDownRefresh(params).then(...)
```

#### Megalo.stopPullDownRefresh()

停止当前页面下拉刷新。

**示例代码：**

```js
Megalo.stopPullDownRefresh()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.startPullDownRefresh | ✔️ | ✔️ |  | ✔️ |  |
| Megalo.stopPullDownRefresh | ✔️ | ✔️ | ✔️ | ✔️ |  |

### WXML 节点信息

#### Megalo.createSelectorQuery()

返回一个 SelectorQuery 对象实例。可以在这个实例上使用 select 等方法选择节点，并使用 boundingClientRect 等方法选择需要查询的信息。

**示例代码：**

```js
const query = Megalo.createSelectorQuery()
```

#### Megalo.createIntersectionObserver(this, options)

使用方式同 [`wx.createIntersectionObserver`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.createIntersectionObserver.html)。

**示例代码：**

```js
const IntersectionObserver = Megalo.createIntersectionObserver(this, params)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.createSelectorQuery | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.createIntersectionObserver | ✔️ | ✔️ |  |  |  |

## 开放接口

### 设置

#### Megalo.getSetting(OBJECT)

使用方式同 [`wx.getSetting`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getSetting.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getSetting(params).then(...)
```

#### Megalo.openSetting(OBJECT)

使用方式同 [`wx.openSetting`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.openSetting.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.openSetting(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getSetting | ✔️ | ✔️ | ✔️ | ✔️ |  |
| Megalo.openSetting | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 收货地址

#### Megalo.chooseAddress(OBJECT)

使用方式同 [`wx.chooseAddress`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseAddress.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.chooseAddress(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.chooseAddress | ✔️ | ✔️ |  | ✔️ |  |

### 授权

#### Megalo.authorize(OBJECT)

使用方式同 [`wx.authorize`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.authorize.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.authorize(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.authorize | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 发票

#### Megalo.chooseInvoice(OBJECT)

使用方式同 [`wx.chooseInvoice`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseInvoice.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.chooseInvoice(params).then(...)
```

#### Megalo.chooseInvoiceTitle(OBJECT)

使用方式同 [`wx.chooseInvoiceTitle`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.chooseInvoiceTitle.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.chooseInvoiceTitle(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.chooseInvoice | ✔️ |  |  |  |  |
| Megalo.chooseInvoiceTitle | ✔️ | ✔️ |  |  |  |

### 用户信息

#### Megalo.getUserInfo(OBJECT)

使用方式同 [`wx.getUserInfo`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getUserInfo.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.getUserInfo(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getUserInfo | ✔️ | ✔️ | ✔️ | ✔️ |  |

### 登录

#### Megalo.login(OBJECT)

使用方式同 [`wx.login`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.login.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.login(params).then(...)
```

#### Megalo.checkSession(OBJECT)

使用方式同 [`wx.checkSession`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.checkSession.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.checkSession(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.login | ✔️ | ✔️ |  | ✔️ |  |
| Megalo.checkSession | ✔️ | ✔️ |  | ✔️ |  |

### 小程序跳转

#### Megalo.navigateBackMiniProgram(OBJECT)

使用方式同 [`wx.navigateBackMiniProgram`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateBackMiniProgram.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.navigateBackMiniProgram(params).then(...)
```

#### Megalo.navigateToMiniProgram(OBJECT)

使用方式同 [`wx.navigateToMiniProgram`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateToMiniProgram.html)，支持 `Promise` 化使用。

**示例代码：**

```js
Megalo.navigateToMiniProgram(params).then(...)
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.navigateBackMiniProgram | ✔️ | ✔️ | ✔️ |  |  |
| Megalo.navigateToMiniProgram | ✔️ | ✔️ | ✔️ |  |  |

### 数据分析

#### Megalo.reportAnalytics(EVENTNAME, OBJECT)

使用方式同 [`wx.reportAnalytics`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.reportAnalytics.html)。

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.reportAnalytics | ✔️ | ✔️ |  |  |  |

## 更新

#### Megalo.getUpdateManager()

使用方式同 [`wx.getUpdateManager`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getUpdateManager.html)。

**示例代码：**

```js
Megalo.getUpdateManager()
```

> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getUpdateManager | ✔️ | ✔️ |  |  |  |

## 第三方平台

#### Megalo.getExtConfigSync()

使用方式同 [`wx.getExtConfigSync`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getExtConfigSync.html)。

#### Megalo.getExtConfig(OBJECT)

使用方式同 [`wx.getExtConfig`](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getExtConfig.html)，支持 `Promise` 化使用。


> API 支持度

| API | 微信小程序 | 百度小程序 | 支付宝小程序 | 今日头条小程序 | H5 |
| :-: | :-: | :-: | :-: | :-: | :-: |
| Megalo.getExtConfigSync | ✔️ | ✔️ |  |  |  |
| Megalo.getExtConfig | ✔️ | ✔️ |  |  |  |
