export interface VoucherModel {
  success: boolean;
  data: VoucherList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface VoucherList {
  id: number;
  name: string;
  code: string;
  quantity: number;
  status: string;
  priceType: string;
  discount: number;
  maxPrice: number;
  price: string;
  type: string;
}
