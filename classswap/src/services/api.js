import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("classswap_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function request(operation, method = "GET", url = "", data = null, config = {}) {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return {
      ok: true,
      operation,
      data: response.data?.data ?? response.data,
      meta: response.data?.meta,
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Request failed";
    return { ok: false, operation, error: message };
  }
}
