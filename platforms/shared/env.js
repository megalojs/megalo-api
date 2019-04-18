export const ENV_TYPE = {
  WECHAT: 'wechat',
  WEB: 'web',
  SWAN: 'swan',
  ALIPAY: 'alipay',
  TOUTIAO: 'toutiao',
};

export function getEnv() {
  if (typeof tt !== 'undefined' && tt.getSystemInfo) {
    return ENV_TYPE.TOUTIAO;
  }
  
  if (typeof wx !== 'undefined' && wx.getSystemInfo) {
    return ENV_TYPE.WECHAT;
  }

  if (typeof swan !== 'undefined' && swan.getSystemInfo) {
    return ENV_TYPE.SWAN;
  }

  if (typeof my !== 'undefined' && my.getSystemInfo) {
    return ENV_TYPE.ALIPAY;
  }

  if (typeof window !== 'undefined') {
    return ENV_TYPE.WEB;
  }

  return 'Unknown environment';
}