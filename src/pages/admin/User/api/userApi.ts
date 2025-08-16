import { HttpService } from "../../../../utils/http";
import { getAccessToken } from "../../../../utils/jwt";
import { APP_CONFIG } from "../../../../utils/env";
import { FilterDefaultModel, ObjAny } from "../../../../store/common/interface";
import { ActionType } from "../../../../store/common/constants";

class UserApi {
  protected model = "";
  protected token = getAccessToken(APP_CONFIG.tokenAdminKey);

  constructor(model: string) {
    this.model = model;
  }

  list = async (
    filter: FilterDefaultModel,
    token?: string
  ): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      ...filter,
      payload: { ...filter.payload, token: token ?? this.token },
      action: ActionType.getUsers,
    });
  };
  create = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { ...payload, token: this.token },
      action: ActionType.createUser,
    });
  };
  update = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { ...payload, token: this.token },
      action: ActionType.updateUser,
    });
  };
  delete = async (id: number): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { id, token: this.token },
      action: ActionType.deleteUser,
    });
  };
}

const userApi = new UserApi("");
export default userApi;
