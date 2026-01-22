import API from "./api";

export const setupInterceptors = (getState: () => any) => {
  API.interceptors.request.use((config) => {
    const reduxToken =
      getState()?.auth?.accessToken || getState()?.login?.accessToken;

    const token = reduxToken || localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem("accessToken", token);
    }
    return config;
  });
};
