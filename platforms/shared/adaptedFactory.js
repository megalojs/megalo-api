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
            options[change.indv] = options[change.std];
            delete options[change.std];
          });
        }

        const set = apiDiff.options.set;
        if (set) {
          set.forEach(setItem => {
            options[setItem.key] = typeof setItem.value === 'function' ? setItem.value(options) : setItem.value;
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