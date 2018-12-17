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
          };

          options.complete = res => {
            rawComplete && rawComplete(res);
            resolveTask();
          };

          requestTask = ctx.request(options);
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
  };

  return p;
}

export default request;