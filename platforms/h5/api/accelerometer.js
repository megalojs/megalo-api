import { throttle } from '../utils/index';
import EventEmitter from '../utils/EventEmitter';

const supportMotionEvent = !!window.DeviceMotionEvent;

const intervals = {
  game: 20,
  ui: 60,
  normal: 200
};

const DEFAULT_INTERVAL_TYPE = 'normal';

const accelerometerEventEmitter = new EventEmitter();

function accelerometeMotionHandler(acceleration) {
  if (this.isObserve) {
    accelerometerEventEmitter.emit('accelerometerChange', acceleration);
  }
}

class AccelerometerOberver {
  constructor(intervalType) {
    const interval = intervals[intervalType] || intervals[DEFAULT_INTERVAL_TYPE];
    const fn = accelerometeMotionHandler.bind(this);
    this.isObserve = false;
    this.accelerometeMotionHandler = throttle(fn, interval);
    this.deviceMotionHandler = ({
      acceleration
    }) => {
      this.accelerometeMotionHandler(acceleration);
    };
  }
  observe() {
    if (this.isObserve) {
      return;
    }
    this.isObserve = true;
    window.addEventListener('devicemotion', this.deviceMotionHandler);
  }
  unoberve() {
    if (!this.isObserve) {
      return;
    }
    this.isObserve = false;
    window.removeEventListener('devicemotion', this.deviceMotionHandler);
  }
}

let accelerometerOberver = null;

function check() {
  if (!supportMotionEvent) {
    throw new Error('Not Support Motion Event');
  }
}

function startAccelerometer(config) {
  const intervalType = config && config.intervalType;
  return Promise.resolve().then(() => {
    check();
    if (!accelerometerOberver) {
      accelerometerOberver = new AccelerometerOberver(intervalType || DEFAULT_INTERVAL_TYPE);
    }
    accelerometerOberver.observe();
  });
}

function stopAccelerometer() {
  return Promise.resolve().then(() => {
    check();
    if (accelerometerOberver) {
      accelerometerOberver.unoberve();
      accelerometerOberver = null;
    }
  });
}

function onAccelerometerChange(cb) {
  check();
  accelerometerEventEmitter.on('accelerometerChange', cb);
  startAccelerometer();
}

function offAccelerometerChange(cb) {
  check();
  accelerometerEventEmitter.off('accelerometerChange', cb);
}

export default {
  install(WX) {
    Object.assign(WX, {
      startAccelerometer,
      stopAccelerometer,
      onAccelerometerChange,
      offAccelerometerChange
    });
  }
};