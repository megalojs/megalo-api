import adaptApi from './adaptedFactory';
import { getEnv, ENV_TYPE } from './env';
import { isNative } from '../../utils/index';
import {
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
} from './nativeApis';

const hasProxy =
  typeof Proxy !== 'undefined' && isNative(Proxy);

function buf2hex(buffer) {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2);
    }
  );
  return hexArr.join('');
}

function hex2buf(hex) {
  let view = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return view.buffer;
}

export {
  buf2hex,
  hex2buf,
  hasProxy,
  adaptApi,
  getEnv,
  ENV_TYPE,
  sharedNoPromiseApis,
  sharedNeedPromiseApis,
};