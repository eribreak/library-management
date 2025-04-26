import axios, { AxiosResponse } from "axios";
import { history } from "../routes/history";
import { Configuration } from "./api/configuration";
import { AdminApi, UserApi, AuthApi } from "./api/api";

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            history.navigate("/login");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

const configuration = new Configuration({
    basePath: baseURL,
});

export const adminApi = new AdminApi(configuration, undefined, axiosInstance);
export const userApi = new UserApi(configuration, undefined, axiosInstance);
export const authApi = new AuthApi(configuration, undefined, axiosInstance);
