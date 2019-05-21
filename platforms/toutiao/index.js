import { 
  getEnv,
  hasProxy,
  ENV_TYPE,
} from '../shared';

import initNativeApi from './initNativeApi';

let Megalo = {
  getEnv,
  ENV_TYPE,
};

initNativeApi(Megalo);

if (hasProxy) {
  Megalo = new Proxy(Megalo, {
    get(target, key) {
      if (key in target) {
        return target[key];
      } else {
        console.warn(`头条小程序暂不支持 tt.${key.toString()}`);
        return target[key];
      }
    }
  });
} else {
  Object.keys(Megalo).forEach(key => {
    defineReactive(Megalo, key, Megalo[key]);
  });

  function defineReactive(data, key, val) {
    Object.defineProperty(data, key, {
      get() {
        return val;
      }
    });
  }
}

export default Megalo;