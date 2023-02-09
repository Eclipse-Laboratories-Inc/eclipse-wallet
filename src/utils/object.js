const hasOwnProperty = Object.prototype.hasOwnProperty;

export const invertBy = (object, iteratee = value => value) => {
  const result = {};
  Object.keys(object).forEach(key => {
    const value = iteratee(object[key]);
    if (hasOwnProperty.call(result, value)) {
      result[value].push(key);
    } else {
      result[value] = [key];
    }
  });
  return result;
};
