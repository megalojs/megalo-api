// 百度专有 API

const noPromiseApis = [
  // 系统信息
  'getEnvInfoSync',

  // 登录
  'isLoginSync',
];

const needPromiseApis = [
  // AI
  'ai.ocrIdCard',
  'ai.ocrBankCard',
  'ai.ocrDrivingLicense',
  'ai.ocrVehicleLicense',
  'ai.textReview',
  'ai.textToAudio',
  'ai.imageAudit',
  'ai.advancedGeneralIdentify',
  'ai.objectDetectIdentify',
  'ai.carClassify',
  'ai.dishClassify',
  'ai.logoClassify',
  'ai.animalClassify',
  'ai.plantClassify',
  'ai.getVoiceRecognizer',

  // 用户信息
  'getSwanId',

  // 分享
  'openShare',

  // 百度收银台支付
  'requestPolymerPayment',

  // 配置seo
  'setMetaDescription',
  'setMetaKeywords',
  'setDocumentTitle',

  // 分包预下载
  'loadSubPackage',
];

export {
  noPromiseApis,
  needPromiseApis,
};