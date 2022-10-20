const stashedValues = new Map();

const stash = {
  getItem: async key => stashedValues.get(key),
  setItem: async (key, value) => stashedValues.set(key, value),
  removeItem: async key => stashedValues.delete(key),
  clear: async () => stashedValues.clear(),
};

export default stash;
