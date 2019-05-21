import adaptApi from './adaptedFactory';
import { getEnv, ENV_TYPE } from './env';
import { isNative } from '../../utils/index';
import { 
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from './nativeApis';

const hasProxy = 
  typeof Proxy !== 'undefined' && isNative(Proxy);

export {
  hasProxy,
  adaptApi,
  getEnv,
  ENV_TYPE,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
};