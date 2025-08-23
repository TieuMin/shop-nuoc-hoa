import { HttpService } from "../../../../utils/http";
import { getAccessToken } from "../../../../utils/jwt";
import { APP_CONFIG } from "../../../../utils/env";
import { FilterDefaultModel, ObjAny } from "../../../../store/common/interface";
import { ActionType } from "../../../../store/common/constants";

class CartApi {
  protected model = "";
  protected token = getAccessToken(APP_CONFIG.tokenKey);

  constructor(model: string) {
    this.model = model;
  }

  list = async (filter: FilterDefaultModel, token: string): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      ...filter,
      payload: { ...filter.payload, token },
      action: ActionType.getCarts,
    });
  };
  create = async (payload: ObjAny, token?: string): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { ...payload, token: token ?? this.token },
      action: ActionType.createCart,
    });
  };
  update = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { ...payload, token: this.token },
      action: ActionType.updateCart,
    });
  };
  delete = async (id: number): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { id, token: this.token },
      action: ActionType.deleteCart,
    });
  };
}

const cartApi = new CartApi("");
export default cartApi;
