import axiosInstance from "./axiosInstance";

export const createPreferencesApi = async (preferences) => {
  const res = await axiosInstance.post("/preferences", preferences);
  return res.data;
};

export const updatePreferencesApi = async (preferences) => {
  const res = await axiosInstance.patch("/preferences", preferences);
  return res.data;
};
