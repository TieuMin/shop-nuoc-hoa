import { HttpService } from "../../../../utils/http";
import { FilterDefaultModel, ObjAny } from "../../../../store/common/interface";
import { ActionType } from "../../../../store/common/constants";

class CommentApi {
  protected model = "";

  constructor(model: string) {
    this.model = model;
  }

  list = async (filter: FilterDefaultModel): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      ...filter,
      action: ActionType.getComments,
    });
  };
  create = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.createComment,
    });
  };
  update = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.updateComment,
    });
  };
  delete = async (id: number): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { id },
      action: ActionType.deleteComment,
    });
  };
}

const commentApi = new CommentApi("");
export default commentApi;
