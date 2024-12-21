import axios from "axios";

const BACKEND_URL = "http://localhost:6875"

const http = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  timeout: 5000,
})

http.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer fake`
  return config
}, err => {
  return Promise.reject(err)
})

export default http;