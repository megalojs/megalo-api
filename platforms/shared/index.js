import request from './request';
import adaptApi from './adaptedFactory';
import { getEnv, ENV_TYPE } from './env';
import { 
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from './nativeApis';

export {
  request,
  adaptApi,
  getEnv,
  ENV_TYPE,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
};