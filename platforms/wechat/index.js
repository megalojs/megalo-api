import { 
  getEnv,
  ENV_TYPE,
} from '../shared';

import initNativeApi from './initNativeApi';

const Megalo = {
  getEnv,
  ENV_TYPE,
};

initNativeApi(Megalo);

export default Megalo;