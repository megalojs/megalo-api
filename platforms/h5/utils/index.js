export function getDocumentElementAttr(key) {
  return document.documentElement[key] || document.body[key];
}

export function setDocumentElementAttr(key, value) {
  return document.documentElement[key] = document.body[key] = value;
}

export function getScrollTop() {
  return window.pageYOffset || getDocumentElementAttr('scrollTop');
}

export function setScrollTop(value) {
  window.pageYOffset = value;
  return setDocumentElementAttr('scrollTop', value);
}