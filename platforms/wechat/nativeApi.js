// 微信专有 API

const noPromiseApis = [
  // mDNS
  'offLocalServiceDiscoveryStop',
  'offLocalServiceFound',
  'offLocalServiceLost',
  'offLocalServiceResolveFail',
  'onLocalServiceDiscoveryStop',
  'onLocalServiceFound',
  'onLocalServiceLost',
  'onLocalServiceResolveFail',
  'startLocalServiceDiscovery',
  'stopLocalServiceDiscovery',

  // 文件
  'getFileSystemManager',

  // 实时音视频
  'createLivePusherContext',

  // 电量
  'getBatteryInfoSync',

  // NFC
  'onHCEMessage',

  // 方向
  'onDeviceMotionChange',

  // 菜单
  'getMenuButtonBoundingClientRect',

  // 自定义组件
  'nextTick',

  // 窗口
  'offWindowResize',
  'onWindowResize',

  // 账号信息
  'getAccountInfoSync',

  // Worker
  'createWorker',

  // 数据上报
  'reportMonitor',

  // 事件
  'offAppHide',
  'offAppShow',
  'offError',
  'offPageNotFound',
  'onAppHide',
  'onAppShow',
  'onError',
  'onPageNotFound',

  // 生命周期
  'getLaunchOptionsSync',

  // 调试
  'getLogManager',
];

const needPromiseApis = [
  // 字体
  'loadFontFace',

  // 电量
  'getBatteryInfo',

  // NFC
  'getHCEState',
  'sendHCEMessage',
  'startHCE',
  'stopHCE',

  // 背景
  'setBackgroundColor',
  'setBackgroundTextStyle',

  // 卡券
  'addCard',
  'openCard',

  // 微信支付
  'requestPayment',

  // 人脸支付
  'faceVerifyForPay',

  // 发票
  'chooseInvoice',

  // 生物认证
  'checkIsSoterEnrolledInDevice',
  'checkIsSupportSoterAuthentication',
  'startSoterAuthentication',

  // 微信运动
  'getWeRunData',

  // 调试
  'setEnableDebug',

  // 压缩图片
  'compressImage',

  // 陀螺仪
  'startGyroscope',
  'stopGyroscope',
];

export {
  noPromiseApis,
  needPromiseApis,
};