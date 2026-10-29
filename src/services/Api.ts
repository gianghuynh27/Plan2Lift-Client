import axios from "axios";

import type {
  InternalAxiosRequestConfig,
} from "axios";

import { SESSION_STORAGE } from "../constants";

const API_BASE_URL =
  "http://localhost:8000/api";

type RefreshResponse = {
  message: string;

  tokens: {
    accessToken: string;
  };
};

type RetryableRequest =
  InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

const baseApi = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
  },

  withCredentials: true,
});

/*
 * This client has no response interceptor.
 * That prevents /auth/refresh from recursively
 * trying to refresh itself.
 */
const refreshApi = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
  },

  withCredentials: true,
});

let refreshPromise:
  | Promise<string>
  | null = null;

export function getAccessToken():
  | string
  | null {
  return sessionStorage.getItem(
    SESSION_STORAGE.ACCESS_TOKEN_KEY,
  );
}

export function removeAccessToken(): void {
  sessionStorage.removeItem(
    SESSION_STORAGE.ACCESS_TOKEN_KEY,
  );
}

export function storeAccessToken(
  accessToken: string,
): void {
  sessionStorage.setItem(
    SESSION_STORAGE.ACCESS_TOKEN_KEY,
    accessToken,
  );
}

export async function refreshAccessToken(): Promise<string> {
  /*
   * Reuse an active refresh request so multiple
   * failed API requests do not rotate the refresh
   * token at the same time within this tab.
   */
  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post<RefreshResponse>(
        "/v1/auth/refresh",
        {},
      )
      .then((response) => {
        const newAccessToken =
          response.data.tokens
            .accessToken;

        if (
          typeof newAccessToken !==
            "string" ||
          !newAccessToken
        ) {
          throw new Error(
            "Refresh response did not contain an access token",
          );
        }

        storeAccessToken(
          newAccessToken,
        );

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

baseApi.interceptors.request.use(
  (
    config:
      InternalAxiosRequestConfig,
  ) => {
    const accessToken =
      getAccessToken();

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: unknown) =>
    Promise.reject(error),
);

baseApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest =
      error.config as
        | RetryableRequest
        | undefined;

    const isAuthenticationRequest =
      originalRequest?.url?.includes(
        "/v1/auth/",
      );

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthenticationRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken =
        await refreshAccessToken();

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return baseApi(
        originalRequest,
      );
    } catch (refreshError) {
      removeAccessToken();

      /*
       * This handles a refresh failure that occurs
       * after the application has already loaded.
       *
       * Startup refresh failures are handled by
       * AuthProvider instead.
       */
      if (
        window.location.pathname !==
        "/auth/login"
      ) {
        window.location.replace(
          "/auth/login",
        );
      }

      return Promise.reject(
        refreshError,
      );
    }
  },
);

export default baseApi;