import { HttpService } from "../../../../utils/http";
import { FilterDefaultModel, ObjAny } from "../../../../store/common/interface";
import { ActionType } from "../../../../store/common/constants";

class UserApi {
  protected model = "";

  constructor(model: string) {
    this.model = model;
  }

  list = async (filter: FilterDefaultModel): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      ...filter,
      action: ActionType.getUsers,
    });
  };
  create = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.createUser,
    });
  };
  update = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.updateUser,
    });
  };
  delete = async (id: number): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { id },
      action: ActionType.deleteUser,
    });
  };
}

const userApi = new UserApi("");
export default userApi;
