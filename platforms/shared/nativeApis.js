const sharedNoPromiseApis = [
  // 网络
  'onSocketOpen',
  'onSocketError',
  'onSocketMessage',
  'onSocketClose',

  // 数据缓存
  'setStorageSync',
  'getStorageSync',
  'getStorageInfoSync',
  'removeStorageSync',
  'clearStorageSync',

  // 媒体
  'getRecorderManager',
  'getBackgroundAudioManager',
  'createInnerAudioContext',
  'createCameraContext',
  'createLivePlayerContext',
  'createVideoContext',

  // 位置
  'createMapContext',

  // 设备
  'canIUse',
  'getSystemInfoSync',
  'onNetworkStatusChange',
  'onAccelerometerChange',
  'onCompassChange',
  'onBluetoothAdapterStateChange',
  'onBluetoothDeviceFound',
  'onBLEConnectionStateChange', // 支付宝：onBLEConnectionStateChanged
  'onBLECharacteristicValueChange',
  'onBeaconUpdate',
  'onBeaconServiceChange',
  'onUserCaptureScreen',
  'onGetWifiList',
  'onWifiConnected',
  'onGyroscopeChange',
  'onMemoryWarning',

  // 界面
  'createAnimation',
  'pageScrollTo',
  'createCanvasContext',

  // WXML
  'createIntersectionObserver',
  'createSelectorQuery',

  // 更新
  'getUpdateManager',

  // 第三方
  'getExtConfigSync',

  // 数据分析
  'reportAnalytics',
];

const sharedNeedPromiseApis = [
  // 网络
  'uploadFile',
  'downloadFile',
  'connectSocket',
  'sendSocketMessage',
  'closeSocket',

  // 媒体
  'chooseImage',
  'previewImage',
  'getImageInfo',
  'saveImageToPhotosAlbum', // 支付宝：saveImage
  'chooseVideo',
  'saveVideoToPhotosAlbum',

  // 文件
  'getFileInfo',
  'saveFile',
  'getSavedFileList',
  'getSavedFileInfo',
  'removeSavedFile',
  'openDocument',

  // 数据缓存
  'setStorage',
  'getStorage',
  'getStorageInfo',
  'removeStorage',
  'clearStorage',

  // 位置
  'getLocation',
  'chooseLocation',
  'openLocation',

  // 设备
  'getSystemInfo',
  'getNetworkType',
  'makePhoneCall',
  'scanCode',
  'setClipboardData',
  'getClipboardData',
  'openBluetoothAdapter',
  'closeBluetoothAdapter',
  'getBluetoothAdapterState',
  'startBluetoothDevicesDiscovery',
  'stopBluetoothDevicesDiscovery',
  'getConnectedBluetoothDevices',
  'createBLEConnection',
  'closeBLEConnection',
  'getBLEDeviceServices',
  'getBLEDeviceCharacteristics',
  'readBLECharacteristicValue',
  'writeBLECharacteristicValue',
  'notifyBLECharacteristicValueChange',
  'getBluetoothDevices',
  'startBeaconDiscovery',
  'stopBeaconDiscovery',
  'getBeacons',
  'setScreenBrightness',
  'getScreenBrightness',
  'setKeepScreenOn',
  'vibrateLong',
  'vibrateShort',
  'addPhoneContact',
  'startWifi',
  'stopWifi',
  'connectWifi',
  'getWifiList',
  'setWifiList',
  'getConnectedWifi',
  'startDeviceMotionListening',
  'stopDeviceMotionListening',

  'startAccelerometer',
  'stopAccelerometer',
  'startCompass',
  'stopCompass',

  // 界面
  'showToast',
  'showLoading',
  'hideToast',
  'hideLoading',
  'showModal', // 支付宝：comfirm
  'showActionSheet',
  'setNavigationBarTitle',
  'showNavigationBarLoading',
  'hideNavigationBarLoading',
  'setNavigationBarColor',
  'setTabBarBadge',
  'removeTabBarBadge',
  'showTabBarRedDot',
  'hideTabBarRedDot',
  'setTabBarStyle',
  'setTabBarItem',
  'showTabBar',
  'hideTabBar',
  'setTopBarText',
  'canvasToTempFilePath',
  'canvasPutImageData',
  'canvasGetImageData',
  'startPullDownRefresh',
  'stopPullDownRefresh',

  // 导航
  'navigateTo',
  'redirectTo',
  'switchTab',
  'navigateBack',
  'reLaunch',

  // 开放接口
  'openSetting',
  'getSetting',
  'chooseAddress',
  'authorize',
  'chooseInvoiceTitle',
  'getUserInfo',
  'login',
  'checkSession',
  'navigateBackMiniProgram',  // 百度：navigateBackSmartProgram
  'navigateToMiniProgram',    // 百度：navigateToSmartProgram
  'getShareInfo',
  'hideShareMenu',
  'showShareMenu',
  'updateShareMenu',

  // 第三方
  'getExtConfig',
];

export {
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
};