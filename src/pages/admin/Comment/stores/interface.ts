export interface CommentModel {
  success: boolean;
  data: CommentList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface CommentList {
  id: number;
  productId: string;
  userId: number;
  comment: string;
  rate: number;
  createDate: string;
  userName: string;
  productName: string;
  status: string;
  products: {
    id: string;
    name: string;
  }[];
}
