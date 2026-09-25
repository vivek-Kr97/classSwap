const ACCESS_TOKEN_KEY = "classswap_access_token";
const REFRESH_TOKEN_KEY = "classswap_refresh_token";

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem("classswap_token");
};

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem("classswap_token", token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("classswap_token");
};
