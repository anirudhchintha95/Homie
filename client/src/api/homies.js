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

export const fetchHomieApi = async (userId) => {
  const response = await axiosInstance.get(`/homies/${userId}`);

  return response?.data?.user || {};
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
  const response = await axiosInstance.patch(`/homies/${userId}/remove-match`);

  return response?.data?.user || {};
};

export const blockUserApi = async (userId) => {
  const response = await axiosInstance.post(`/homies/${userId}/block`);

  return response?.data?.user || {};
};

export const sendMessageApi = async (userId, message) => {
  const response = await axiosInstance.post(`/homies/${userId}/send-message`, {
    message,
  });

  return response?.data?.connection || {};
};

export const markMessagesAsSeenApi = async (userId, message) => {
  const response = await axiosInstance.post(`/homies/${userId}/mark-read`, {
    message,
  });

  return response?.data?.connection || {};
};

export const toggleContactInfoApi = async (userId) => {
  const response = await axiosInstance.patch(
    `/homies/${userId}/toggle-contact-info`
  );

  return response?.data?.user || {};
};
