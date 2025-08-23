import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { notification } from "antd";

import { KEY_API_FAIL } from "./common/constants";
import { APP_CONFIG } from "../utils/env";
import { destroyLogged, getAccessToken, saveAuth } from "../utils/jwt";
import { history } from "../routes/history";

// Hàm hiển thị thông báo lỗi
export const printHttpError = (httpStatus: number, path: string): void => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  switch (httpStatus) {
    case 400:
      notification.error({
        message: "Có lỗi xảy ra",
        description: `Yêu cầu không hợp lệ: ${path}`,
      });
      break;
    case 401:
      destroyLogged(isAdminRoute);
      saveAuth(null, isAdminRoute);
      history.push(isAdminRoute ? "/admin/login" : "/login");
      break;
    case 403:
      notification.error({
        message: "Không có quyền truy cập",
        description: path,
      });
      history.push("/");
      break;
    case 404:
      notification.error({
        message: "Không tìm thấy",
        description: `Không tồn tại endpoint: ${path}`,
      });
      break;
    default:
      notification.error({
        message: "Có lỗi xảy ra",
        description: `Lỗi không xác định`,
      });
      break;
  }
};

// Base query mặc định kèm header Authorization
const rawBaseQuery = fetchBaseQuery({
  baseUrl: APP_CONFIG.apiUrl,
  prepareHeaders: (headers) => {
    const token = getAccessToken(APP_CONFIG.apiKey);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Base query có interceptor xử lý lỗi & format data
const baseQueryWithIntercept: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const url = (result.meta?.request as Request)?.url ?? "";

  // Xử lý HTTP error
  if (result.error) {
    const { status, originalStatus } = result.error as FetchBaseQueryError & {
      originalStatus?: number;
    };
    printHttpError(
      Number(status === "PARSING_ERROR" ? originalStatus : status),
      url
    );
    return { error: result.error };
  }

  // Xử lý lỗi theo convention backend (status code riêng)
  const data: any = result.data;
  if (data?.status === KEY_API_FAIL) {
    printHttpError(Number(data.code), data.message?.[0] || url);
    return {
      error: {
        status: data.code,
        data,
      } as FetchBaseQueryError,
    };
  }

  return { data: data?.data ?? data };
};

export const apiStore = createApi({
  baseQuery: baseQueryWithIntercept,
  reducerPath: "apiStore",
  tagTypes: ["district"],
  keepUnusedDataFor: 180, // 3 phút
  refetchOnMountOrArgChange: 1800, // 30 phút
  endpoints: () => ({}),
});
