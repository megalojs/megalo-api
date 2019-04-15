import axios from 'axios';
import * as utils from '../../../utils/index';

class RequestManager extends axios.Axios {
  constructor() {
    super();

    this.interceptors.before = this.interceptors.request;
    this.interceptors.after = this.interceptors.response;
  }
}

function createXHRInstance() {
  let context = new RequestManager();

  let instance = utils.bind(context.request, context);

  utils.extend(instance, context);

  return instance;
}

export default {
  install(Megalo) {
    Object.assign(Megalo, {
      request: createXHRInstance(),
      CancelToken: axios.CancelToken,
    });
  }
};