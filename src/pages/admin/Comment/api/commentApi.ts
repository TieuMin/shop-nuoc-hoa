import { HttpService } from "../../../../utils/http";
import { getAccessToken } from "../../../../utils/jwt";
import { APP_CONFIG } from "../../../../utils/env";
import { FilterDefaultModel, ObjAny } from "../../../../store/common/interface";
import { ActionType } from "../../../../store/common/constants";

class CommentApi {
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
      action: ActionType.getComments,
    });
  };
  create = async (payload: ObjAny, token?: string): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { ...payload, token: token ?? this.token },
      action: ActionType.createComment,
    });
  };
  update = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { ...payload, token: this.token },
      action: ActionType.updateComment,
    });
  };
  delete = async (id: number): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { id, token: this.token },
      action: ActionType.deleteComment,
    });
  };
}

const commentApi = new CommentApi("");
export default commentApi;
