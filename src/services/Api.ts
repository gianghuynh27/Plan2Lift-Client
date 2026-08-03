import axios from "axios";
import { SESSION_STORAGE } from "../constants";

const baseApi = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

baseApi.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem(
      SESSION_STORAGE.ACCESS_TOKEN_KEY,
    );
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// baseApi.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized error, e.g., redirect to login page
//       console.error("Unauthorized access - redirecting to login.");
//     }
//     return Promise.reject(error);
//   },
// );

export default baseApi;
