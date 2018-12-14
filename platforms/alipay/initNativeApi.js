import { 
  request,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from '../shared';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

function processApis() {
  const myApis = [].concat(
    sharedNoPromiseApis,
    sharedNeedPromiseApis,
  )

  myApis.forEach(() => {

  });
}

function adaptRequest(options) {
  options['headers'] = defaultHeaders;

  if (options['header']) {
    for (const k in options['headers']) {
      const lowerK = k.toLocaleLowerCase();
      options['headers'][k] = options['header'][lowerK];
    }

    delete options['header'];
  }

  this.request = this.httpRequest;
  return request.call(this, options);
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.request = (...args) => {
    return adaptRequest.apply(my, args);
  }
}