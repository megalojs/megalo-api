import { buf2hex } from '../shared';

const needPromiseApiDiffs = {
  'setNavigationBarTitle': {
    alias: 'setNavigationBar',
  },
  'setNavigationBarColor': {
    alias: 'setNavigationBar'
  },
  'createBLEConnection': {
    alias: 'connectBLEDevice'
  },
  'closeBLEConnection': {
    alias: 'disconnectBLEDevice'
  },
  'showToast': {
    options: {
      changes: [
        {
          std: 'title',
          indv: 'content'
        },
        {
          std: 'icon',
          indv: 'type'
        }
      ]
    }
  },
  'showModal': {
    response: [
      {
        key: 'cancel',
        value(res) {
          return !res.confirm;
        }
      }
    ]
  },
  'showLoading': {
    options: {
      changes: [
        {
          std: 'title',
          indv: 'content'
        }
      ]
    }
  },
  'showActionSheet': {
    options: {
      changes: [
        {
          std: 'itemList',
          indv: 'items'
        }
      ]
    }
  },
  'authorize': {
    alias: 'getAuthCode'
  },
  'getUserInfo': {
    alias: 'getAuthUserInfo'
  },
  'chooseImage': {
    response: [
      {
        key: 'tempFilePaths',
        value(res) {
          return res.apFilePaths;
        }
      }
    ]
  },
  'previewImage': {
    options: {
      set: [
        {
          key: 'current',
          value(options) {
            return options.urls.indexOf(options.current || options.urls[0]);
          }
        }
      ]
    }
  },
  'saveImageToPhotosAlbum': {
    alias: 'saveImage',
    options: {
      changes: [
        {
          std: 'filePath',
          indv: 'url'
        }
      ]
    }
  },
  'saveFile': {
    options: {
      changes: [
        {
          std: 'tempFilePath',
          indv: 'apFilePath'
        }
      ]
    },
    response: [
      {
        key: 'savedFilePath',
        value(res) {
          return res.apFilePath;
        }
      }
    ]
  },
  'downloadFile': {
    response: [
      {
        key: 'tempFilePath',
        value(res) {
          return res.apFilePath;
        }
      }
    ]
  },
  'getFileInfo': {
    options: {
      changes: [
        {
          std: 'filePath',
          indv: 'apFilePath'
        }
      ]
    }
  },
  'getSavedFileInfo': {
    options: {
      changes: [
        {
          std: 'filePath',
          indv: 'apFilePath'
        }
      ]
    }
  },
  'removeSavedFile': {
    options: {
      changes: [
        {
          std: 'filePath',
          indv: 'apFilePath'
        }
      ]
    }
  },
  'uploadFile': {
    options: {
      changes: [
        {
          std: 'name',
          indv: 'fileName'
        }
      ]
    }
  },
  'getNetworkType': {
    response: [
      {
        key: 'networkType',
        value(res) {
          return res.networkType.toLocaleLowerCase();
        }
      }
    ]
  },
  'getClipboardData': {
    alias: 'getClipboard',
    response: [
      {
        key: 'data',
        value(res) {
          return res.text;
        }
      }
    ]
  },
  'setClipboardData': {
    alias: 'setClipboard',
    options: {
      changes: [
        {
          std: 'data',
          indv: 'text'
        }
      ]
    }
  },
  'makePhoneCall': {
    options: {
      changes: [
        {
          std: 'phoneNumber',
          indv: 'number'
        }
      ]
    }
  },
  'scanCode': {
    alias: 'scan',
    options: {
      changes: [
        {
          std: 'onlyFromCamera',
          indv: 'hideAlbum'
        }
      ],
      set: [
        {
          key: 'type',
          value(options) {
            return (options.scanType && options.scanType[0].slice(0, -4)) || 'qr';
          }
        }
      ]
    },
    response: [
      {
        key: 'result',
        value(res) {
          return res.code;
        }
      }
    ]
  },
  'openLocation': {
    options: {
      set: [
        {
          key: 'latitude',
          value (options) {
            return String(options.latitude);
          }
        },
        {
          key: 'longitude',
          value (options) {
            return String(options.longitude);
          }
        }
      ]
    }
  },
  'setScreenBrightness': {
    options: {
      changes: [
        {
          std: 'value',
          indv: 'brightness'
        }
      ]
    }
  },
  'getBLEDeviceCharacteristics': {
    response: [
      {
        key: 'characteristics.uuid',
        value(res, index) {
          return res.characteristics[index].characteristicId;
        }
      }
    ]
  },
  'getBLEDeviceServices': {
    response: [
      {
        key: 'services.uuid',
        value(res, index) {
          return res.services[index].serviceId;
        }
      }
    ]
  },
  'writeBLECharacteristicValue': {
    options: {
      set: [
        {
          key: 'value',
          value(options) {
            return buf2hex(options.value);
          }
        }
      ]
    }
  }
};

const noPromiseApiDiffs = {
  'onBLEConnectionStateChange': {
    alias: 'onBLEConnectionStateChanged'
  }
};

export {
  needPromiseApiDiffs,
  noPromiseApiDiffs,
};