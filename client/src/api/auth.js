import axiosInstance from "./axiosInstance";

export const loginApi = async (email, password) => {
    // DevLog | Apoorv
    console.log("Trying to log in: ", email);

    const res = await axiosInstance.post("/login", { email, password });

    return res.data;
};
