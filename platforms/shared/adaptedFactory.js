function adaptApi(key, options = {}, apiDiff) {
  let rawApi = key;

  Object.keys(apiDiff).forEach(item => {
    const apiItem = apiDiff[item];
    if (key === item) {
      if (apiItem.alias) {
        rawApi = apiItem.alias;
      }
    }
  });

  return {
    rawApi,
    options
  };
}

export default adaptApi;