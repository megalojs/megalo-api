import {
  request,
  adaptApi,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from '../shared';

import {
  noPromiseApis,
  needPromiseApis,
} from './nativeApi';

const foo = () => {};

const apiDiffs = {
  'navigateBackMiniProgram': {
    alias: 'navigateBackSmartProgram'
  },
  'navigateToMiniProgram': {
    alias: 'navigateToSmartProgram',
    options: {
      changes: [{
        standard: 'appId',
        individual: 'appKey'
      }]
    }
  }
};

function processApis(megalo) {
  const swanApis = [].concat(
    sharedNoPromiseApis,
    sharedNeedPromiseApis,
    noPromiseApis,
    needPromiseApis,
  )

  swanApis.forEach(key => {
    if (!!~sharedNeedPromiseApis.indexOf(key) || !!~needPromiseApis.indexOf(key)) {
      megalo[key] = (options, ...args) => {

        // Api 差异化兼容
        const result = adaptApi(key, options, apiDiffs);
        const aliasKey = result.rawApi;
        options = result.options;

        if (!(aliasKey in swan)) {
          console.warn(`百度小程序暂不支持 swan.${aliasKey}`)
          return
        }

        let task;
        let cloneOpts = Object.assign({}, options);

        // Api Promise 化
        const p = new Promise((resolve, reject) => {
          ['fail', 'success', 'complete'].forEach(evt => {
            cloneOpts[evt] = res => {
              options[evt] && options[evt](res);
              if (evt === 'success') {
                if (aliasKey === 'connectSocket') {
                  resolve(
                    Promise.resolve().then(() => Object.assign(task, res))
                  )
                } else {
                  resolve(res);
                }
              } else if (evt === 'fail') {
                reject(res);
              }
            };

          });
          if (args.length) {
            task = swan[aliasKey](cloneOpts, ...args);
          } else {
            task = swan[aliasKey](cloneOpts);
          }
        });

        if (aliasKey === 'downloadFile' || aliasKey === 'uploadFile') {
          [
            'abort',
            'onProgressUpdate',
          ].forEach(evt => {
            p[evt] = cb => {
              cb = cb || foo;
              if (task) {
                task[evt](cb)
              }
            }
          });
        }

        return p;
      };
    } else {
      megalo[key] = (...args) => {
        return swan[key].apply(swan, args);
      }
    }
  });
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.request = (...args) => {
    return request.apply(swan, args);
  };
}