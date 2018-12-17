const needPromiseApiDiffs = {
  'setNavigationBarTitle': {
    alias: 'setNavigationBar',
  },
  'setNavigationBarColor': {
    alias: 'setNavigationBar'
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
          return res.apFilePaths[0];
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
            return options.urls.indexOf(options.current || options[0]);
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
    }
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
  'getNetworkType': {
    response: [
      {
        key: 'networkType',
        value(res) {
          return res.toLocaleLowerCase();
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
          value (options) {
            return (options.scanType && options.scanType[0].slice(0, -4)) || 'qr';
          }
        }
      ]
    }
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
  }
};

const noPromiseApiDiffs = {
  // 'onNetworkStatusChange': {
  //   response: [
  //     key: 'networkType',
  //     value(options) {
  //       return options.networkType.toLocaleUpperCase();
  //     }
  //   ]
  // },
  // 'onBLEConnectionStateChange': {
  //   alias: 'onBLEConnectionStateChanged'
  // }
};

export {
  needPromiseApiDiffs,
  noPromiseApiDiffs,
};