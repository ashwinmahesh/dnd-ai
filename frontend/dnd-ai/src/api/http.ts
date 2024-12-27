import axios from 'axios';
import Config from 'react-native-config';
import { firebaseAuth } from '@/FirebaseConfig';

const http = axios.create({
  // baseURL: `${Config.API_BASE}/api/v1`,
  baseURL: `http://localhost:6875/api/v1`,
  timeout: 25000,
});

// console.log('BASE URL:', Config.API_BASE);

http.interceptors.request.use(
  async (config) => {
    const token = await firebaseAuth.currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // config.headers.Authorization = `Bearer ${Config.API_KEY}`;
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
