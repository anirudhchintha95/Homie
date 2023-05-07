import axiosInstance from "./axiosInstance";

export const getCurrentUserApi = async () => {
  const res = await axiosInstance.get("/me");

  return res.data?.user;
};

export const updateAccountApi = async (data) => {
  const res = await axiosInstance.patch("/me", data);

  return res.data?.user;
};

export const updatePasswordApi = async (data) => {
  await axiosInstance.patch("/me/update-password", data);
};

export const updateBioApi = async (data) => {
  await axiosInstance.patch("/me/bio", data);
};

export const deleteAccountApi = async () => {
  const res = await axiosInstance.delete("/me");

  return res.data?.user;
};

export const updateImageApi = async (userId, image) => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await axiosInstance.post(
    `/images/User/${userId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data?.user;
};
