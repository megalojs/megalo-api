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
  const requestTask = request.call(this, options);

  return requestTask.then(res => {
    res.statusCode = res.status;
    delete res.status;

    res.header = res.headers;
    delete res.headers;

    return Promise.resolve(res);
  }).catch(error => {
    return Promise.reject(error);
  });
}

export default function initNativeApi(megalo) {
  processApis(megalo);
  megalo.request = (...args) => {
    return adaptRequest.apply(my, args);
  }
}