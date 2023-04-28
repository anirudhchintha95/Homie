import axiosInstance from "./axiosInstance";

export const loginApi = async (email, password) => {
    const res = await axiosInstance.post("/login", { email, password });

    return res.data;
};

export const sigunpApi = async (
  firstName,
  lastName,
  email,
  password,
  dateOfBirth,
  phone,
  gender
) => {
  const res = await axiosInstance.post("/signup", {
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    phone,
    gender,
  });

  return res.data;
};
