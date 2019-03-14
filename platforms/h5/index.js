import { 
  getEnv,
  ENV_TYPE,
} from '../shared';

import * as api from './api';

let Megalo = {
  getEnv,
  ENV_TYPE,
};

Object.assign(Megalo, api);

Megalo = new Proxy(Megalo, {
  get(target, key) {
    if (key in target) {
      return target[key];
    } else {
      console.warn(`H5 暂不支持 ${key.toString()} 方法`);
      return target[key] = () => {};
    }
  }
});

export default Megalo;