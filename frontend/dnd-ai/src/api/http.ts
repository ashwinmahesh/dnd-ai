import axios from 'axios';
import Config from 'react-native-config';

const http = axios.create({
  baseURL: `${Config.API_BASE}/api/v1`,
  timeout: 25000,
});

console.log(`API_BASE: ${Config.API_BASE}, API_KEY: ${Config.API_KEY}`);

http.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${Config.API_KEY}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export const encodeGetParams = (params: { [key: string]: string | boolean | number }) =>
  Object.entries(params)
    .map((kv) => kv.map(encodeURIComponent).join('='))
    .join('&');

export default http;
