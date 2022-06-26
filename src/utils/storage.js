const storage = {
  getItem: async key => JSON.parse(window.localStorage.getItem(key)),
  setItem: async (key, value) =>
    window.localStorage.setItem(key, JSON.stringify(value)),
  removeItem: async key => window.localStorage.removeItem(key),
  clear: async () => window.localStorage.clear(),
};

export default storage;
