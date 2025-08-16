/** Lấy cookie theo tên */
export const getCookie = (name?: string): string | undefined => {
  if (!name) return;

  const target = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(target));

  return cookie ? decodeURIComponent(cookie.substring(target.length)) : "";
};

/** Lưu cookie */
export const saveCookie = (options: {
  name?: string;
  value: string;
  exdays: number;
}): void => {
  if (!options.name) return;

  const date = new Date();
  date.setTime(date.getTime() + options.exdays * 24 * 60 * 60 * 1000);

  document.cookie = `${options.name}=${encodeURIComponent(
    options.value
  )}; expires=${date.toUTCString()}; path=/`;
};

/** Xóa cookie */
export const delCookie = (name?: string): void => {
  if (!name) return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

/** Format số có dấu phẩy phân cách */
export const formatNumber = (value: string | number): string => {
  const num = Number(value);
  return isNaN(num) ? `${value}` : num.toLocaleString("en-US");
};

/** Chuyển chuỗi thành slug */
export const stringToSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "") // xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, "-") // khoảng trắng thành -
    .replace(/-+/g, "-"); // bỏ dấu - thừa
};

/** Format giá với dấu phẩy */
export const formatPrice = (value?: number): string => {
  return value != null ? value.toLocaleString("en-US") : "";
};

/** Format giá sang VND */
export const formatPriceVND = (value: number): string =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

/** Convert file sang Base64 */
export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
