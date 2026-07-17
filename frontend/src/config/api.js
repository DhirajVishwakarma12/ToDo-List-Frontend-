import axios from "axios";
import Config from "./config.js";

const api = axios.create({
  baseURL: Config.API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAccessTokenExpired =
      error.response?.status === 401 &&
      ["Invalid or expired access token", "Access token not found"].includes(
        error.response?.data?.message
      );

    const shouldRefreshToken =
      isAccessTokenExpired && !originalRequest._retry && !originalRequest.url?.includes("/api/auth/refresh-token");

    if (shouldRefreshToken) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.get(`${Config.API_URL}/api/auth/refresh-token`, {
          withCredentials: true,
        });

        const newToken = refreshResponse.data?.accessToken;

        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
