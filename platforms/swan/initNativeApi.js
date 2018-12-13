import { 
  request,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from '../shared';

export default function initNativeApi(megalo) {
  megalo.request = (...args) => {
    return request.apply(swan, args)
  };
};