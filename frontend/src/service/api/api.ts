import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: `http://${window.location.hostname}:3000/api/`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export default api;