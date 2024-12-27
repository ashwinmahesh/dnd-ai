import axios from 'axios';
import Config from 'react-native-config';
import { firebaseAuth } from '@/FirebaseConfig';
import { SelectedCampaignKey } from '@/constants/AsyncStorageKeys';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';

const http = axios.create({
  // baseURL: `${Config.API_BASE}/api/v1`,
  baseURL: `http://localhost:6875/api/v1`,
  timeout: 25000,
});

// console.log('BASE URL:', Config.API_BASE);

http.interceptors.request.use(
  async (config) => {
    try {
      const storedCampaignId = await AsyncStorage.getItem(SelectedCampaignKey);
      if (storedCampaignId) {
        config.headers['CurrentCampaignID'] = storedCampaignId;
      }
    } catch (err) {
      // Do nothing, just don't pass header
      console.log('failed to get stored campaign id to set in request header:', err);
    }
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
