import { getScrollTop, setScrollTop } from '../utils/index';

let _frameRequestId = null,
  _from, _to, _start, _duration;
const supportPerformance = !!(window.performance && window.performance.now);

function runScroll() {
  _frameRequestId = window.requestAnimationFrame((now) => {
    if (!supportPerformance) {
      now = Date.now();
    }
    const timeUsed = now - _start;
    if (timeUsed >= _duration) {
      setScrollTop(_to);
      _frameRequestId = null;
      return;
    }

    const progress = timeUsed / _duration;
    const curScrollTop = (_to - _from) * progress + _from;
    setScrollTop(curScrollTop);
    runScroll();
  });
}

function pageScrollTo({ scrollTop, duration = 300}) {
  _from = getScrollTop();
  _to = scrollTop;
  _duration = duration;
  _start = supportPerformance ? window.performance.now() : Date.now();
  if (_frameRequestId == null) {
    runScroll();
  }
}

export default {
  install(Megalo) {
    Object.assign(Megalo, {
      pageScrollTo
    });
  }
};