// 支付宝专有 API

const noPromiseApis = [
  // 键盘
  'hideKeyboard',

  // 跳转支付宝卡包
  'openCardList',
  'openMerchantCardList',
  'openCardDetail',
  'openVoucherList',
  'openMerchantVoucherList',
  'openVoucherDetail',
  'openKBVoucherDetail',
  'openTicketList',
  'openTicketDetail',

  // webview
  'createWebViewContext',

  // websocket
  'offSocketOpen',
  'offSocketError',
  'offSocketMessage',
  'offSocketClose',

  // 获取基础库版本好
  'SDKVersion',

  // 网络
  'offNetworkStatusChange',

  // 振动
  'vibrate',

  // 加速度计
  'offAccelerometerChange',

  // 陀螺仪
  'offGyroscopeChange',

  // 罗盘
  'offCompassChange',

  // 权限引导
  'showAuthGuide',

  // 自定义通用菜单
  'hideAddToDesktopMenu',
  'hideAllAddToDesktopMenu',
  'hideFavoriteMenu',
  'hideAllFavoriteMenu',

  // 当前运行版本
  'getRunScene',
];

const needPromiseApis = [
  // 交互反馈
  'alert',
  'confirm',
  'prompt',

  // 联系人
  'choosePhoneContact',

  // 选择城市
  'chooseCity',

  // 选择日期
  'datePicker',

  // 级联选择
  'multiLevelSelect',

  // 获取用户手机号
  'getPhoneNumber',

  // 唤起支付
  'tradePay',

  // 支付代扣签约
  'paySignCenter',

  // 会员开卡授权
  'addCardAuth',

  // 芝麻认证
  'startZMVerify',

  // 文本风险识别
  'textRiskIdentification',

  // 刷脸认证
  'ap.faceVerify',

  // 营销反作弊
  'ap.preventCheat',

  // 压缩图片
  'compressImage',

  // 摇一摇
  'watchShake',

  // 获取服务器时间
  'getServerTime',

  // 数据安全
  'rsa',
];

export {
  noPromiseApis,
  needPromiseApis,
};
