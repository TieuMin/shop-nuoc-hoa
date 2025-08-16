import { notification } from "antd";
import { HttpService } from "../../../../utils/http";
import { LoginModel } from "../stores/interface";
import { saveAuth, saveToken } from "../../../../utils/jwt";
import { APP_CONFIG } from "../../../../utils/env";

class AuthApi {
  protected model = "";

  constructor(model: string) {
    this.model = model;
  }
  login = async (payload: LoginModel) => {
    return HttpService.post(`${this.model}`, payload)
      .then(async (res: any) => {
        if (!res?.token) {
          return notification.error({
            message: "Tên đăng nhập hoặc mật khẩu không hợp lệ",
          });
        }

        const token = res?.token;
        if (token) await saveToken(APP_CONFIG.tokenAdminKey, token);
        if (res?.user) await saveAuth(res?.user);

        notification.success({
          message: "Đăng nhập thành công",
        });

        return res || {};
      })
      .catch(() => {
        return false;
      });
  };
}

const authApi = new AuthApi("");
export default authApi;
