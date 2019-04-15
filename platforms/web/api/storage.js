const resolvePromise = () => Promise.resolve();

/**
 * 将数据存储在本地缓存中指定的 key 中，同步接口，自行try catch
 * @param {String} key 
 * @param {Object | String} data 
 * @throws {Error} https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem#Exceptions
 */
function setStorageSync(key, data) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch(e) {
    console.info(e);
  }
}

/**
 * 数据存储在本地缓存中指定的 key 中，异步接口
 * @param {Object} { key: String, data: Object | String }
 * @returns {Promise} 
 */
function setStorage({ key, data }) {
  return resolvePromise().then(() => setStorageSync(key, data));
}

/**
 * 从本地缓存中同步获取指定 key 对应的内容
 * @param {String} key
 */
function getStorageSync(key) {
  const dataString = window.localStorage.getItem(key);
  // 返回 null 或者 data
  try {
    return dataString && JSON.parse(dataString);
  } catch(e) {
    console.info(e);
  }
}

/**
 * 从本地缓存中异步获取指定 key 对应的内容
 * @param {Object} { key: String } 
 * @returns {Promise} 
 */
function getStorage({ key }) {
  return resolvePromise().then(() => getStorageSync(key));
}

/**
 * 本地缓存中同步移除指定 key 
 * @param {String} key 
 */
function removeStorageSync(key) {
  return window.localStorage.removeItem(key);
}

/**
 * 从本地缓存中异步移除指定 key
 * @param {Object} { key: String } 
 * @returns {Promise}
 */
function removeStorage({ key }) {
  return resolvePromise().then(() => removeStorageSync(key));
}

/**
 * 同步清理本地数据缓存
 */
function clearStorageSync() {
  return window.localStorage.clear();
}

/**
 * 异步清理本地数据缓存
 */
function clearStorage() {
  return resolvePromise().then(() => clearStorageSync());
}

/**
 * 同步获取当前 storage 的相关信息
 */
function getStorageInfoSync() {
  return {
    keys: Object.keys(window.localStorage),
    currentSize: null,
    limitSize: null,
  };
}

 /**
  * 异步获取当前 storage 的相关信息
  */
function getStorageInfo() {
  return resolvePromise().then(() => getStorageInfoSync());
}


export default {
  install(Megalo) {
    Object.assign(Megalo, {
      setStorageSync,
      setStorage,
      getStorageSync,
      getStorage,
      removeStorageSync,
      removeStorage,
      clearStorageSync,
      clearStorage,
      getStorageInfoSync,
      getStorageInfo,
    });
  }
};