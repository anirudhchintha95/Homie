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
    const user = getFromStorage(process.env.REACT_APP_USER_KEY);
    config.headers["accesstoken"] = user?.accessToken || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
