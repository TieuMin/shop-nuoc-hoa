import { HttpService } from "../../../../utils/http";
import { FilterDefaultModel, ObjAny } from "../../../../store/common/interface";
import { ActionType } from "../../../../store/common/constants";

class VoucherApi {
  protected model = "";

  constructor(model: string) {
    this.model = model;
  }

  list = async (filter: FilterDefaultModel): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      ...filter,
      action: ActionType.getVouchers,
    });
  };
  listUser = async (userId: number | string): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { userId },
      action: ActionType.getVouchersForUser,
    });
  };
  create = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.createVoucher,
    });
  };
  update = async (payload: ObjAny): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload,
      action: ActionType.updateVoucher,
    });
  };
  delete = async (id: number): Promise<ObjAny> => {
    return HttpService.post(`${this.model}`, {
      payload: { id },
      action: ActionType.deleteVoucher,
    });
  };
}

const voucherApi = new VoucherApi("");
export default voucherApi;
