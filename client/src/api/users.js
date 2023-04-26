import axiosInstance from "./axiosInstance";

export const getCurrentUserApi = async () => {
  const res = await axiosInstance.get("/api/me");

  return res.data?.user;
};
