'use strict';

const getAvatar = (index) => `http://static.salmonwallet.io/avatar/${index}.png`;

const getRandomAvatar = () => {
  const rnd = Math.floor(Math.random() * 24) + 1;
  const index = rnd.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  return getAvatar(index);
};

module.exports = { getAvatar, getRandomAvatar };
