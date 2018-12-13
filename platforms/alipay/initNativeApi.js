import { 
  request,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from '../shared';

module.exports = function initNativeApi(megalo) {
  megalo.request = (...args) => {
    return request.apply(my, args)
  };
};