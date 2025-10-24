import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

const Axios: AxiosInstance = axios.create({
  baseURL: "https://demo.myairesource.us",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_PRIVATE_KEY;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default Axios;
