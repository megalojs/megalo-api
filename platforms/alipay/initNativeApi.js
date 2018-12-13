import { 
  request,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from '../shared';

function processApis() {
  const myApis = [].concat(
    sharedNoPromiseApis,
    sharedNeedPromiseApis,
  )

  myApis.forEach(() => {

  });
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.request = (...args) => {
    return request.apply(my, args);
  }
}