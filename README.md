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
responseType | string | text | 否 | 响应的数据类型
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
request | ✔️ | ✔️ | ✔️ | ✔️ | ✔️

