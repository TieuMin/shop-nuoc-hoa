export interface OrderModel {
  success: boolean;
  data: OrderList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface OrderList {
  id: number;
  orderCode: string;
  userId: number;
  fullName: string;
  address: string;
  phoneNumber: string;
  voucherId: number;
  voucher: {
    id: number;
    code: string;
    name: string;
    quantity: number;
    priceType: string;
    discount: number;
    maxPrice: number;
    price: string;
    status: string;
    type: string;
  };
  discount: number;
  subTotal: number;
  total: number;
  createDate: string;
  shippingDate: string;
  paymentDate: string;
  paidDate: string;
  paymentType: string;
  status: string;
  commentId: number;
  products: {
    id: number;
    orderid: number;
    productId: number;
    product: {
      id: number;
      categoryId: number;
      trademarkId: number;
      name: string;
      description: string;
      priceid: number;
      quantity: number;
      discount: number;
      note: string;
      image: string;
      status: string;
      categoryName: string;
      trademarkName: string;
    };
    priceId: number;
    price: number;
    priceName: string;
    quantity: number;
    discount: number;
  }[];
}
