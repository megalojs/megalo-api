import {
  getEnv,
  ENV_TYPE,
} from './env';

const foo = () => {};

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

function request(options) {
  const ctx = this;
  options = options || {};

  const rawSuccess = options.success;
  const rawFail = options.fail;
  const rawComplete = options.complete;
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  // 兼容支付宝 httpRequest 和 headers
  let requestApi = ctx.request;
  if (getEnv() === ENV_TYPE.ALIPAY) {
    requestApi = ctx.httpRequest;
    options['headers'] = defaultHeaders;

    if (options['header']) {
      for (const k in options['headers']) {
        const lowerK = k.toLocaleLowerCase();
        options['headers'][k] = options['header'][lowerK];
      }

      delete options['header'];
    }
  }

  let requestTask;
  const p = new Promise((resolve, reject) => {
    RequestQueue.push({
      run() {
        return new Promise(resolveTask => {

          options.success = res => {
            rawSuccess && rawSuccess(res);
            resolve(res);
          };

          options.fail = res => {
            rawFail && rawFail(res);
            reject(res);
          }

          options.complete = res => {
            rawComplete && rawComplete(res);
            resolveTask();
          }

          requestTask = requestApi(options);
        });
      }
    });
  });

  p.abort = () => {
    if (requestTask.abort) {
      requestTask.abort();
    }
  };

  p.offHeadersReceived = cb => {
    cb = cb || foo;

    if (requestTask.offHeadersReceived) {
      requestTask.offHeadersReceived(cb);
    }
  };

  p.onHeadersReceived = cb => {
    cb = cb || foo;

    if (requestTask.onHeadersReceived) {
      requestTask.onHeadersReceived(cb);
    }
  }

  return p;
}

export default request;