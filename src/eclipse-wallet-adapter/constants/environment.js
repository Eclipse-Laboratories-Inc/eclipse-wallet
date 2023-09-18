let apiUrl;

const salmonEnv = process.env.REACT_APP_SALMON_ENV ?? process.env.NODE_ENV;

switch (salmonEnv) {
  case 'production':
    apiUrl = 'https://api.salmonwallet.io';
    break;
  case 'development':
    apiUrl = 'https://d1ms6b491qeh6d.cloudfront.net';
    break;
  case 'test':
  case 'local':
    apiUrl = 'http://localhost:3000/local';
    break;
  case 'main':
    apiUrl = 'https://bo0q5g7ie1.execute-api.us-east-1.amazonaws.com/main';
    break;
}
module.exports = { SALMON_API_URL: apiUrl };
