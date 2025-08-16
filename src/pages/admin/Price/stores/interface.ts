export interface PriceModel {
  success: boolean;
  data: PriceList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface PriceList {
  id: number;
  name: string;
  price: number;
  status: string;
}
