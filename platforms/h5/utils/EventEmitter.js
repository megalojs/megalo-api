// 
function isFunction(fn) {
  return typeof fn === 'function';
}

/**
 * Emitter
 * @param {void}
 *
 * @example
 * const e = new Emitter();
 * let count = 0;
 * const updateCount = function updateCount(val) {
 *     count += val;
 * }
 * e.on('event', updateCount);
 * e.emit('event', 10)
 * e.off('event', updateCount);
 *
 */
export default class Emitter {
  constructor() {
    this.__events__ = {};
  }
  /**
   * 订阅消息
   * @param {string} type 消息类型
   * @param {Function} fn 监听方法
   * @return {Object} this
   */
  on(type, fn) {
    if (!this.__events__[type]) {
      this.__events__[type] = [];
    }
    if (this.has(type, fn) !== -1 || !isFunction(fn)) {
      return this;
    }
    this.__events__[type].push(fn);
    return this;
  }
  /**
   * 发送消息
   * @param {string} type
   * @param {...*}
   * @return {Object} this
   */
  emit(type, ...args) {
    const listeners = this.__events__[type];
    if (!listeners || listeners.length === 0) {
      return this;
    }
    listeners.forEach((fn) => {
      fn.call(this, ...args);
    });
    return this;
  }
  /**
   * 取消订阅
   * @param {string} type 消息类型
   * @param {Function} fn 监听方法
   * @return {Object} this
   */
  off(type, fn) {
    if (!isFunction(fn)) {
      return this;
    }
    const i = this.has(type, fn);
    if (i !== -1) {
      this.__events__[type].splice(i, 1);
    }
    return this;
  }
  /**
   * 检查该方法是否已经订阅
   * @param {string} type 消息类型
   * @param {Function} fn 监听方法
   * @return {number} 返回对应方法在缓存中的序号，-1 表示不存在
   */
  has(type, fn) {
    const listeners = this.__events__[type];
    if (!listeners || !listeners.length > 0) {
      return -1;
    }
    return listeners.indexOf(fn);
  }
}