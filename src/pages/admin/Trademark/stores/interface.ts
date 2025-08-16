export interface TrademarkModel {
  success: boolean;
  data: TrademarkList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface TrademarkList {
  id: number;
  name: string;
  code: string;
  status: string;
}
