import { 
  request,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from '../shared';

import {
  noPromiseApis,
  needPromiseApis,
} from './nativeApi';

const foo = () => {};

function processApis(megalo) {
  const swanApis = [].concat(
    sharedNoPromiseApis,
    sharedNeedPromiseApis,
    noPromiseApis,
    needPromiseApis,
  )

  swanApis.forEach(key => {

    if (!(key in swan)) {
      megalo[key] = () => {
        console.warn(`百度小程序暂不支持 swan.${key}`)
      }
      return
    }

    if (!!~sharedNeedPromiseApis.indexOf(key) || !!~needPromiseApis.indexOf(key)) {
      megalo[key] = (options, ...args) => {
        let task;
        let cloneOpts = Object.assign({}, options);

        // Api Promise 化
        const p = new Promise((resolve, reject) => {
          ['fail', 'success', 'complete'].forEach(evt => {
            cloneOpts[evt] = res => {
              options[evt] && options[evt](res);
              if (evt === 'success') {
                if (key === 'connectSocket') {
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
            task = swan[key](cloneOpts, ...args);
          } else {
            task = swan[key](cloneOpts);
          }
        });

        if (key === 'downloadFile' || key === 'uploadFile') {
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