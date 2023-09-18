const path = require('path');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    'eclipse-wallet-adapter': path.resolve(__dirname, 'src/eclipse-wallet-adapter/')
  };

  return config;
};
