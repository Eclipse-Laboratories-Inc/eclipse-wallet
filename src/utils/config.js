import http from 'axios';

export const retriveConfig = async () => {
  return http.get(
    `https://kb1ov39jxg.execute-api.us-east-1.amazonaws.com/testing/v1/configs`,
  );
};
