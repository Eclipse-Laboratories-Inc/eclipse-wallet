import { SALMON_API_URL } from '4m-wallet-adapter/constants/environment';
import http from 'axios';

let config = null;

export const retriveConfig = async () => {
  if (config == null) {
    config = (await http.get(`${SALMON_API_URL}/v1/configs`)).data;
  }

  return config;
};
