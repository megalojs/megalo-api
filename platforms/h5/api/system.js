import MobileDetect from 'mobile-detect';

function getSystemInfoSync() {
  const md = new MobileDetect(window.navigator.userAgent);

  return {
    brand: md.mobile(),                                 // 设备名称
    model: md.mobile(),                                 // 设备型号
    system: md.os(),                                    // 操作系统
    pixelRatio: window.devicePixelRatio,                // 设备像素比
    screenWidth: window.screen.width,                   // 屏幕宽度
    screenHeight: window.screen.height,                 // 屏幕高度
    windowWidth: document.documentElement.clientWidth,    // 可使用窗口宽度
    windowHeight: document.documentElement.clientHeight,  // 可使用窗口高度
    language: window.navigator.language,                // 设置语言
    platform: window.navigator.platform,                // 客户端平台
  };
}

function getSystemInfo() {
  return Promise.resolve().then(() => {
    return getSystemInfoSync();
  });
}

export default {
  install(Megalo) {
    Object.assign(Megalo, {
      getSystemInfoSync,
      getSystemInfo,
    });
  }
};