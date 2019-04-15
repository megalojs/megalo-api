
/**
 * 动态设置当前页面标题
 * @param {Object} { title: string }
 * @returns {Promise}
 */
function setNavigationBarTitle({ title }) {
  if (document.title !== title) {
    document.title = title;
    return Promise.resolve();
  }
}

export default {
  install(Megalo) {
    Object.assign(Megalo, {
      setNavigationBarTitle
    });
  }
};