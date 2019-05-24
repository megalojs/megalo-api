import { 
  hex2buf,
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
  noPromiseApiDiffs,
} from './apiDiffs';

import * as utils from '../../utils/index';
import RequestManager from '../shared/request';
import CancelToken from '../shared/cancelToken';

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
                    let keys = item.key.split('.');
                    if (keys.length === 1) {
                      res[keys[0]] = item.value(res);
                    } else if (keys.length === 2) {
                      if (Array.isArray(res[keys[0]])) {
                         res[keys[0]].forEach((obj, index) => {
                           obj[keys[1]] = item.value(res, index);
                         });
                      } else {
                        res[keys[0]][keys[1]] = item.value(res);
                      }
                    }
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

        const result = adaptApi(key, {}, noPromiseApiDiffs);
        let aliasKey = result.rawApi;

        if (!(aliasKey in my)) {
          console.warn(`支付宝小程序暂不支持 my.${aliasKey}`);
          return;
        }
        if (aliasKey === 'getStorageSync') {
          const arg1 = args[0];
          if (arg1 !== null) {
            return my[aliasKey]({ key: arg1 }).data || '';
          }
        }
        if (aliasKey === 'setStorageSync') {
          const arg1 = args[0];
          const arg2 = args[1];
          if (arg1 !== null) {
            return my[aliasKey]({
              key: arg1,
              data: arg2
            });
          }
        }
        if (aliasKey === 'removeStorageSync') {
          const arg1 = args[0];
          if (arg1 !== null) {
            return my[aliasKey]({ key: arg1 });
          }
        }
        if (aliasKey === 'createSelectorQuery') {
          const query = my[aliasKey]();
          query.in = function () { return query; };
          return query;
        }

        if (aliasKey === 'onNetworkStatusChange') {
          const arg1 = args[0];
          if (arg1 !== null) {
            my[aliasKey](res => {
              res.networkType = res.networkType.toLocaleLowerCase();
              arg1(res);
            });
          }
        }

        if (aliasKey === 'onBLECharacteristicValueChange') {
          const arg1 = args[0];
          if (arg1 !== null) {
            my[aliasKey](res => {
              res.value = hex2buf(res.value);
              arg1(res);
            });
          }
        }

        return my[aliasKey].apply(my, args);
      };
    }
  });
}

function createXHRInstance() {
  let context = new RequestManager();
  let instance = utils.bind(RequestManager.prototype.request, context);

  utils.extend(instance, RequestManager.prototype, context);

  utils.extend(instance, context);

  // 处理 header 
  instance.interceptors.before.use(options => {
    options['headers'] = {};
    if (options['header']) {
      for (const k in options['header']) {
        options['headers'][k] = options['header'][k];
      }

      delete options['header'];
    }

    return options;
  });

  // 处理 statusCode
  instance.interceptors.after.use(response => {
    response.statusCode = response.status;
    delete response.status;

    response.header = response.headers;
    delete response.headers;

    return response;
  });

  return instance;
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.CancelToken = CancelToken;
  megalo.request = createXHRInstance();
}