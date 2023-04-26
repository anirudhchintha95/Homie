import axios from "axios";
import { getFromStorage } from "../utils";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accesstoken = getFromStorage(process.env.REACT_APP_USER_ACCESS_TOKEN_KEY);
    config.headers["accesstoken"] = accesstoken || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
