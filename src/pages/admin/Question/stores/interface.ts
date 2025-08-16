export interface QuestionModel {
  success: boolean;
  data: QuestionList[];
  total: number;
  page: number;
  pageSize: number;
  statusCode: number;
}

export interface QuestionList {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  questionType: string;
  orderCode: string;
  description: string;
  status: string;
  createDate: string;
  deleted: false;
  orders: {
    id: number;
    orderCode: string;
    userId: number;
    fullName: string;
    address: string;
    phoneNumber: string;
    voucherId: number;
    discount: number;
    subTotal: number;
    total: number;
    createDate: string;
    shippingDate: string;
    paymentDate: string;
    paidDate: string;
    paymentType: string;
    status: string;
    commentId: string;
    deleted: string;
  };
  user: {
    id: number;
    userName: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    status: string;
  };
}
