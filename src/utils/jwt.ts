import { APP_CONFIG } from "./env";
import { delCookie, getCookie, saveCookie } from "./helpers";

export const getAccessToken = (name: string, isParse?: boolean) => {
  if (getCookie(name) && isParse) return JSON.parse(getCookie(name) ?? "");
  return getCookie(name) || null;
};

export const getAuth = (isAdmin?: boolean) => {
  const cookie = getCookie(
    isAdmin ? APP_CONFIG.profileAdKey : APP_CONFIG.profileKey
  );
  if (!cookie) return null;
  try {
    return JSON.parse(cookie);
  } catch (e) {
    console.error("Invalid JSON in cookie", e);
    return null;
  }
};

export const saveAuth = (auth: any, isAdmin?: boolean, exdays = 1) => {
  saveCookie({
    name: isAdmin ? APP_CONFIG.profileAdKey : APP_CONFIG.profileKey,
    value: JSON.stringify(auth),
    exdays,
  });
};

export const saveToken = (name: string, accessToken: string, exdays = 1) => {
  saveCookie({ name, value: accessToken, exdays });
};

export const destroyLogged = (isAdmin?: boolean) => {
  if (isAdmin) delCookie(APP_CONFIG.tokenAdminKey);
  else delCookie(APP_CONFIG.tokenKey);
  delCookie(APP_CONFIG.profileKey);
  localStorage.clear();
};
