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
  const weApis = [].concat(
    sharedNoPromiseApis,
    sharedNeedPromiseApis,
    noPromiseApis,
    needPromiseApis,
  );
  
  weApis.forEach(key => {
    if (!!~sharedNeedPromiseApis.indexOf(key) || !!~needPromiseApis.indexOf(key)) {
      megalo[key] = (options = {}, ...args) => {
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
                  );
                } else {
                  resolve(res);
                }
              } else if (evt === 'fail') {
                reject(res);
              }
            };

          });
          if (args.length) {
            task = wx[key](cloneOpts, ...args);
          } else {
            task = wx[key](cloneOpts);
          }
        });

        if (key === 'downloadFile' || key === 'uploadFile') {
          [
            'abort',
            'onProgressUpdate',
            'offProgressUpdate',
            'onHeadersReceived',
            'offHeadersReceived',
          ].forEach(evt => {
            p[evt] = cb => {
              cb = cb || foo;
              if (task) {
                task[evt](cb);
              }
            };
          });
        }

        return p;
      };
    } else {
      megalo[key] = (...args) => {
        return wx[key].apply(wx, args);
      };
    }
  });
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.request = (...args) => {
    return request.apply(wx, args);
  };
}