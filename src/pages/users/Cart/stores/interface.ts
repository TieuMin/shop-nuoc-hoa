export interface CartModel {
  success: boolean;
  data: CartList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
  totalCart: number;
}

export interface CartList {
  id: number;
  status: string;
  productId: number;
  userId: number;
  priceId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    image: string;
    trademarkName: string;
    trademarkId: number;
    discount: number;
  };
  price: {
    id: number;
    price: number;
    name: string;
    status: string;
  };
  user: {
    id: number;
    name: string;
  };
  total: number;
}
