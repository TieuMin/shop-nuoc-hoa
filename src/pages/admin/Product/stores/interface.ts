export interface ProductModel {
  success: boolean;
  data: ProductList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface ProductList {
  id: number;
  name: string;
  code: string;
  description: string;
  quantity: number;
  status: string;

  categoryId: number;
  trademarkId: number;
  priceId: number[];
  discount: number;
  note: string;
  image: string;
  categoryName: string;
  trademarkName: string;
  prices: {
    id: number;
    price: number;
    name: string;
    status: string;
  }[];
  averageRate: number;
  totalComment: number;
  comments: {
    id: number;
    productId: string;
    userId: number;
    comment: string;
    rate: number;
    createDate: string;
    status: string;
    deleted: string;
    userName: string;
  }[];
}
