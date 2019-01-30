import { 
  getEnv,
  ENV_TYPE,
} from '../shared';

import initNativeApi from './initNativeApi';

let Megalo = {
  getEnv,
  ENV_TYPE,
};

initNativeApi(Megalo);

Megalo = new Proxy(Megalo, {
  get(target, key) {
    if (key in target) {
      return target[key];
    } else {
      console.warn(`微信小程序暂不支持 wx.${key.toString()}`);
      return target[key] = () => {};
    }
  }
});

export default Megalo;