/**
 * 跳转至目标地址
 * @param {Object} { url: String }
 * @returns {Promise} 
 */
function navigateTo({ url }) {
  return new Promise((res) => {
    window.location.assign(url);
    res();
  });
}

/**
 * 重定向至目标地址
 * @param {Object} { url: String } 
 * @returns {Promise} 
 */
function redirectTo({ url }) {
  return new Promise((res) => {
    window.location.replace(url);
    res();
  });
}

/**
 * 返回，delta大于页面栈时这里将不会做任何跳转，而在微信小程序中会回到主页
 * @param {Object} { delta: Number } 
 */
function navigateBack({ delta }) {
  return window.history.go(-delta);
}

export default {
  install(Megalo) {
    Object.assign(Megalo, {
      navigateTo,
      redirectTo,
      navigateBack
    });
  }
};