import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { notification } from "antd";
import { history } from "../routes/history";
import { getAccessToken, destroyLogged, saveAuth } from "./jwt";
import { APP_CONFIG } from "./env";

const instance = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
instance.interceptors.request.use((config) => {
  const token = getAccessToken(APP_CONFIG.tokenKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Accept = "application/json";
    config.headers["X-Requested-With"] = "XMLHttpRequest";
  }
  return config;
});

// Response Interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    if (![200, 201].includes(data?.statusCode)) {
      handleError(data);
      return Promise.reject(data.message);
    }
    return data;
  },
  (error: AxiosError) => {
    handleError(error.response?.data);
    return Promise.reject(error);
  }
);

function handleError(err: any) {
  let message = "Error has occurred";
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  if (!err) {
    notification.error({ message: message });
    return;
  }

  switch (err?.statusCode) {
    case 401:
      destroyLogged(isAdminRoute);
      saveAuth(null, isAdminRoute);
      history.push(isAdminRoute ? "/admin/login" : "/login");
      break;
    case 403:
      history.push(isAdminRoute ? "/admin/login" : "/");
      break;
  }

  if (Array.isArray(err?.validatorErrors) && err.validatorErrors.length > 0) {
    message = err.validatorErrors
      .map((e: any) => e?.contraints?.[0])
      .join(", ");
  } else if (!err?.message && err?.data?.message) {
    message = err.data.message;
  } else {
    message = err.message || message;
  }

  notification.error({ message: message });
}

export const HttpService = {
  get: <T>(url: string, params?: any, config?: AxiosRequestConfig) =>
    instance.get<T>(url, { params, ...config }),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    instance.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T>(url, config),
  deleteMulti: <T>(url: string, ids: number[]) =>
    instance.delete<T>(url, { data: { ids } }),
  uploadFile: <T>(
    url: string,
    fileData: FormData | Record<string, any>,
    config?: AxiosRequestConfig
  ) => {
    const formData =
      fileData instanceof FormData
        ? fileData
        : Object.entries(fileData).reduce((fd, [k, v]) => {
            fd.append(k, v);
            return fd;
          }, new FormData());
    return instance.post<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    });
  },
};
