import { 
  getEnv,
  hasProxy,
  ENV_TYPE,
} from '../shared';

import api from './api';

let Megalo = {
  getEnv,
  ENV_TYPE,
};

Object.assign(Megalo, api);

if (hasProxy) {
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
}

export default Megalo;