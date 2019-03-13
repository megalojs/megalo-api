export default class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;
    this.promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    let token = this;
    executor(message => {
      if (token.reason) {
        return;
      }

      token.reason = {
        message,
      };
      resolvePromise(token.reason);
    });
  }

  static source() {
    let cancel;
    let token = new CancelToken(c => {
      cancel = c;
    });

    return {
      token,
      cancel,
    };
  }
}