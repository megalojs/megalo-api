function adaptApi(key, options = {}, apiDiffs) {
  let rawApi = key;

  Object.keys(apiDiffs).forEach(item => {
    const apiDiff = apiDiffs[item];
    if (key === item) {
      if (apiDiff.alias) {
        rawApi = apiDiff.alias;
      }

      if (apiDiff.options) {
        const changes = apiDiff.options.changes;
        if (changes) {
          changes.forEach(change => {
            options[change.individual] = options[change.standard];
          });
        }
      }
    }
  });

  return {
    rawApi,
    options
  };
}

export default adaptApi;