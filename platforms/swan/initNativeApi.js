import { 
  request,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from '../shared';

function processApis() {
  const swanApis = [].concat(
    sharedNoPromiseApis,
    sharedNeedPromiseApis,
  )

  swanApis.forEach(() => {

  });
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.request = (...args) => {
    return request.apply(swan, args);
  };
}