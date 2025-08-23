import { HttpService } from "../../../../utils/http";
import { FilterDefaultModel, ObjAny } from "../../../../store/common/interface";
import { ActionType } from "../../../../store/common/constants";

class ProductApi {
  protected model = "";

  constructor(model: string) {
    this.model = model;
  }

  list = async (filter: FilterDefaultModel): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      ...filter,
      action: ActionType.getProducts,
    });
  };
  detail = async (payload: FilterDefaultModel): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      ...payload,
      action: ActionType.getProductDetail,
    });
  };
  create = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.createProduct,
    });
  };
  update = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.updateProduct,
    });
  };
  delete = async (id: number): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { id },
      action: ActionType.deleteProduct,
    });
  };
}

const productApi = new ProductApi("");
export default productApi;
