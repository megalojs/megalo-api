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

import {
  needPromiseApiDiffs,
  // noPromiseApiDiffs,
} from './apiDiffs';

const foo = () => {};

function processApis(megalo) {
  const myApis = [].concat(
    sharedNoPromiseApis,
    sharedNeedPromiseApis,
    noPromiseApis,
    needPromiseApis,
  );

  myApis.forEach(key => {
    if (!!~sharedNeedPromiseApis.indexOf(key) || !!~needPromiseApis.indexOf(key)) {
      megalo[key] = (options = {}, ...args) => {

        // Api 差异化兼容
        const result = adaptApi(key, options, needPromiseApiDiffs);
        let aliasKey = result.rawApi;
        options = result.options;

        if (aliasKey === 'showModal') {
          options.cancelButtonText = options.cancelText;
          options.confirmButtonText = options.confirmText || '确定';
          aliasKey = 'confirm';
          if (options.showCancel === false) {
            options.buttonText = options.confirmText || '确定';
            aliasKey = 'alert';
          }
        }

        if (!(aliasKey in my)) {
          console.warn(`支付宝小程序暂不支持 my.${aliasKey}`);
          return; 
        }

        let task;
        let cloneOpts = Object.assign({}, options);

        // Api Promise 化
        const p = new Promise((resolve, reject) => {
          ['fail', 'success', 'complete'].forEach(evt => {
            cloneOpts[evt] = res => {
              options[evt] && options[evt](res);
              if (evt === 'success') {

                // 处理 response 返回字段的差异化
                if (needPromiseApiDiffs[key] && needPromiseApiDiffs[key].response) {
                  const response = needPromiseApiDiffs[key].response;

                  response.forEach(item => {
                    res[item.key] = item.value(res);
                  });
                }

                if (aliasKey === 'connectSocket') {
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
            task = my[aliasKey](cloneOpts, ...args);
          } else {
            task = my[aliasKey](cloneOpts);
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
                task[evt](cb);
              }
            };
          });
        }

        return p;
      };
    } else {
      megalo[key] = (...args) => {
        if (!(key in my)) {
          console.warn(`支付宝小程序暂不支持 my.${key}`);
          return;
        }
        if (key === 'getStorageSync') {
          const arg1 = args[0];
          if (arg1 !== null) {
            return my[key]({ key: arg1 }).data || '';
          }
        }
        if (key === 'setStorageSync') {
          const arg1 = args[0];
          const arg2 = args[1];
          if (arg1 !== null) {
            return my[key]({
              key: arg1,
              data: arg2
            });
          }
        }
        if (key === 'removeStorageSync') {
          const arg1 = args[0];
          if (arg1 !== null) {
            return my[key]({ key: arg1 });
          }
        }
        if (key === 'createSelectorQuery') {
          const query = my[key]();
          query.in = function () { return query; };
          return query;
        }

        if (key === 'onBLEConnectionStateChange') {
          return my['onBLEConnectionStateChanged'].apply(my, args);
        }

        if (key === 'onNetworkStatusChange') {
          const arg1 = args[0];
          if (arg1 !== null) {
            my[key](res => {
              res.networkType = res.networkType.toLocaleLowerCase();
              arg1(res);
            });
          }
        }

        return my[key].apply(my, args);
      };
    }
  });
}

function adaptRequest(options) {
  options['headers'] = {};
  if (options['header']) {
    for (const k in options['header']) {
      options['headers'][k] = options['header'][k];
    }

    delete options['header'];
  }

  const requestTask = request.call(this, options);

  return requestTask.then(res => {
    res.statusCode = res.status;
    delete res.status;

    res.header = res.headers;
    delete res.headers;

    return Promise.resolve(res);
  }).catch(error => {
    return Promise.reject(error);
  });
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.request = (...args) => {
    return adaptRequest.apply(my, args);
  };
}