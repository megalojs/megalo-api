function getConnection() {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
}

function getNetworkType() {
  let connection = getConnection();
  let res = {};

  if (!connection) {
    res.networkType = 'unknown';
    return Promise.resolve(res);
  }

  if (!navigator.onLine) {
    res.networkType = 'none';
    return Promise.resolve(res);
  }

  let type = 'unknown';

  if (!isNaN(Number(connection.type))) {
    switch(connection.type) {
      case connection.WIFI:
        type = 'wifi';
        break;
      case connection.CELL_3G:
        type = '3g';
        break;
      case connection.CELL_2G:
        type = '2g';
        break;
      default:
        type = 'unknown';
    }
  } else if (connection.type) {
    type = connection.type;
  } else if (connection.effectiveType) {
    type = connection.effectiveType;
  }

  res.networkType = type;
  return Promise.resolve(res);
}

function onNetworkStatusChange(cb) {
  let connection = getConnection();
  if (connection) {
    connection.addEventListener('change', () => {
      getNetworkType()
        .then(res => {
          const { networkType } = res;
          const isConnected = networkType !== 'none';

          cb({
            isConnected,
            networkType,
          });
        });
    });
  }
}

export default {
  install(Megalo) {
    Object.assign(Megalo, {
      getNetworkType,
      onNetworkStatusChange,
    });
  }
};