import { getEnv } from './env';
import InterceptorManager from './interceptor';

const RequestQueue = {
  MAX_REQUEST: 10,
  waitQueue: [],
  runningQueue: [],
  push(task) {
    const { waitQueue, runningQueue, MAX_REQUEST } = this;

    if (runningQueue.length < MAX_REQUEST) {
      this.run(task);
    } else {
      waitQueue.push(task);
    }
  },
  run(task) {
    const { waitQueue, runningQueue } = this;

    runningQueue.push(task);

    task.run().then(() => {
      const index = runningQueue.indexOf(task);
      runningQueue.splice(index, 1);

      if (waitQueue.length > 0) {
        const nextTask = waitQueue.shift();
        this.run(nextTask);
      }
    });
  }
};

function getEnvContext() {
  let env = getEnv();

  switch(env) {
    case 'wechat':
      return wx;
    case 'swan':
      return swan;
    case 'alipay':
      return my;
    case 'toutiao':
      return tt;
    default:
      return wx;
  }
}

function send(options) {
  const ctx = getEnvContext();

  let requestTask;
  const p = new Promise((resolve, reject) => {
    RequestQueue.push({
      run() {
        return new Promise(resolveTask => {

          options.success = res => {
            resolve(res);
          };

          options.fail = res => {
            reject(res);
          };

          options.complete = () => {
            resolveTask();
          };

          requestTask = ctx.request(options);

          // 取消请求
          if (options.cancelToken) {
            options.cancelToken.promise.then(cancel => {
              if (!requestTask) {
                return;
              }

              requestTask.abort();
              reject(cancel);
              requestTask = null;
            });
          }

        });
      }
    });
  });

  return p;
}

export default class RequestManager {
  constructor() {
    this.interceptors = {
      before: new InterceptorManager(),
      after: new InterceptorManager(),
    };
  }

  request(options) {
    options = options || {};

    let chain = [ this.dispatchRequest, undefined ];
    let promise = Promise.resolve(options);

    this.interceptors.before.forEach(interceptor => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.after.forEach(interceptor => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while(chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }

  dispatchRequest(options) {
    return send(options).then(response => {
      return response;
    }, reason => {
      return Promise.reject(reason);
    });
  }
}