/**
 * 设置剪贴板内容，参考 https://stackoverflow.com/questions/47879184/document-execcommandcopy-not-working-on-chrome
 * @params {Object} {data: String}
 * return {Promise}
 */
function setClipboardData(params) {
  let { data } = params;

  if (data && document.execCommand) {
    let textarea = document.getElementById('J_clipboard_textarea');

    if (!textarea) {
      textarea = document.createElement('textarea');
      textarea.id = 'J_clipboard_textarea';
      textarea.style.opacity = 0;
      textarea.textContent = data;
      document.body.appendChild(textarea);
    }

    let selection = document.getSelection();
    let range = document.createRange();
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');

    selection.removeAllRanges();
    document.body.removeChild(textarea);

    return Promise.resolve();
  }
}

// function getClipboardData() {
//   document.addEventListener('paste', (e) => {
//     let cbd = e.clipboardData.getData('text');

//   });
// }


export default {
  install(Megalo) {
    Object.assign(Megalo, {
      setClipboardData,
      // getClipboardData,
    });
  }
};