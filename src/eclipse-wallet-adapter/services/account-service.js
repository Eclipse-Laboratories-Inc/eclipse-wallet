'use strict';

const getPathIndex = (path) => {
  const index = Number(path?.split('/')?.[3]?.replace("'", ''));
  return !isNaN(index) ? index : undefined;
};

module.exports = { getPathIndex };
