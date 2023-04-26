import axiosInstance from "./axiosInstance";

export const loginApi = async (email, password) => {
  const res = await axiosInstance.post("/login", { email, password });

  return res.data;
};
