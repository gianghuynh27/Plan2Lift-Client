import axios from "axios";
import { SESSION_STORAGE } from "../constants";

type RetryableRequest = {
  _retry?: boolean;
  url?: string;
  headers: Record<string, string>;
};

const baseApi = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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

let refreshPromise: Promise<string> | null = null;

baseApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    const isAuthRequest = originalRequest?.url?.includes("/v1/auth/");

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(
            "http://localhost:8000/api/v1/auth/refresh",
            {},
            {
              withCredentials: true,
            },
          )
          .then((response) => {
            const newAccessToken = response.data.tokens.accessToken as string;

            sessionStorage.setItem(
              SESSION_STORAGE.ACCESS_TOKEN_KEY,
              newAccessToken,
            );

            return newAccessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return baseApi(originalRequest);
    } catch (refreshError) {
      sessionStorage.removeItem(SESSION_STORAGE.ACCESS_TOKEN_KEY);

      /*
       * A full redirect also resets the
       * AuthProvider's in-memory state.
       */
      window.location.replace("/auth/login");

      return Promise.reject(refreshError);
    }
  },
);

export default baseApi;
