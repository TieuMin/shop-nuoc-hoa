import { HttpService } from "../../../../utils/http";
import { FilterDefaultModel, ObjAny } from "../../../../store/common/interface";
import { ActionType } from "../../../../store/common/constants";

class OrderApi {
  protected model = "";

  constructor(model: string) {
    this.model = model;
  }

  list = async (filter: FilterDefaultModel): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      ...filter,
      action: ActionType.getOrders,
    });
  };
  create = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.createOrder,
    });
  };
  update = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.updateOrder,
    });
  };
  delete = async (id: number): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { id },
      action: ActionType.deleteOrder,
    });
  };
}

const orderApi = new OrderApi("");
export default orderApi;
