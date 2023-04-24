import axiosInstance from "./axiosInstance";

export const fetchHomiesApi = async () => {
  const response = await axiosInstance.post("/homies");
  return response?.data?.homies || [];
};

export const fetchMyHomiesApi = async ({ connectionType, search }) => {
  const response = await axiosInstance.post("/homies/linked", {
    connectionType,
    search,
  });
  return response?.data?.homies || [];
};

export const addUserAsFavoriteApi = async (userId) => {
  const response = await axiosInstance.post(`/homies/${userId}/add-favorite`);

  return response?.data?.user || {};
};

export const removeUserAsFavoriteApi = async (userId) => {
  const response = await axiosInstance.post(
    `/homies/${userId}/remove-favorite`
  );

  return response?.data?.user || {};
};

export const removeMatchedUserApi = async (userId) => {
  const response = await axiosInstance.post(
    `/homies/${userId}/remove-match`
  );

  return response?.data?.user || {};
};

export const reportUserApi = async (userId) => {
  const response = await axiosInstance.post(`/homies/${userId}/report`);

  return response?.data?.user || {};
};
