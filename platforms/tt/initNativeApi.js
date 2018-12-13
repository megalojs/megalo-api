import { 
  request,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from '../shared';

function processApis() {
  const ttApis = [].concat(
    sharedNoPromiseApis,
    sharedNeedPromiseApis,
  )

  ttApis.forEach(() => {

  });
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.request = (...args) => {
    return request.apply(tt, args);
  };
}