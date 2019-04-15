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

export function throttle(fn, interval) {
  let last, timer;
  interval || (interval = 250);

  return function() {
    let context = this;
    let args = arguments;
    let now = +new Date();

    if (last && now < last + interval) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, interval);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}