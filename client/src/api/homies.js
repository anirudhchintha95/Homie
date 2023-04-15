import axiosInstance from "./axiosInstance";

export const fetchHomiesApi = async () => {
  const response = await axiosInstance.post("/homies");
  return response?.data?.homies || [];
};
