import { FilterDefaultModel, ModalAction } from "./interface";

export const KEY_API_FAIL = "Error";

export enum ActionType {
  // User
  login = "login",
  getUsers = "getUsers",
  createUser = "createUser",
  updateUser = "updateUser",
  deleteUser = "deleteUser",
  changePassword = "changePassword",
  getUserProfile = "getUserProfile",

  // Category
  getCategories = "getCategories",
  createCategory = "createCategory",
  updateCategory = "updateCategory",
  deleteCategory = "deleteCategory",

  // Price
  getPrices = "getPrices",
  createPrice = "createPrice",
  updatePrice = "updatePrice",
  deletePrice = "deletePrice",

  // Trademark
  getTrademarks = "getTrademarks",
  createTrademark = "createTrademark",
  updateTrademark = "updateTrademark",
  deleteTrademark = "deleteTrademark",

  // Product
  getProducts = "getProducts",
  getProductDetail = "getProductDetail",
  createProduct = "createProduct",
  updateProduct = "updateProduct",
  deleteProduct = "deleteProduct",

  // Comment
  getComments = "getComments",
  createComment = "createComment",
  updateComment = "updateComment",
  deleteComment = "deleteComment",

  // Cart
  getCarts = "getCarts",
  createCart = "createCart",
  updateCart = "updateCart",
  deleteCart = "deleteCart",

  // Order
  getOrders = "getOrders",
  createOrder = "createOrder",
  updateOrder = "updateOrder",
  deleteOrder = "deleteOrder",

  // Voucher
  getVouchers = "getVouchers",
  createVoucher = "createVoucher",
  updateVoucher = "updateVoucher",
  deleteVoucher = "deleteVoucher",
  getVouchersForUser = "getVouchersForUser",

  // Question
  getQuestions = "getQuestions",
  createQuestion = "createQuestion",
  updateQuestionStatus = "updateQuestionStatus",
}

export const filterDefault: FilterDefaultModel = {
  action: "",
  payload: {
    token: "",
    page: 1,
    pageSize: 10,
  },
};

export const filterSelectList = {
  ...filterDefault,
  payload: { ...filterDefault.payload, pageSize: 999, page: 1 },
};

export const defaultActionData: ModalAction = {
  isShow: false,
  data: undefined,
};

export enum OrderStatus {
  NotPaid = "NotPaid", // chưa thánh toán
  Paid = "Paid", // Đã thanh toán
  PendingShipping = "PendingShipping", // chờ giao hàng
  Shipping = "Shipping", // đang giao hàng
  Delivered = "Delivered", // đã giao hàng
  Refund = "Refund", // Hoàn trả
  Cancel = "Cancel", // Hủy đơn hàng
}

export const orderOption = [
  { value: OrderStatus.NotPaid, label: "Chưa thanh toán" },
  { value: OrderStatus.Paid, label: "Đã thanh toán" },
  { value: OrderStatus.PendingShipping, label: "Chờ giao hàng" },
  { value: OrderStatus.Shipping, label: "Đang giao hàng" },
  { value: OrderStatus.Delivered, label: "Đã giao hàng" },
  { value: OrderStatus.Refund, label: "Hoàn trả" },
  { value: OrderStatus.Cancel, label: "Hủy đơn hàng" },
];

export const rateOption = [
  { value: 1, label: "1 sao" },
  { value: 2, label: "2 sao" },
  { value: 3, label: "3 sao" },
  { value: 4, label: "4 sao" },
  { value: 5, label: "5 sao" },
];

export const questionStatus = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "done", label: "Đã hoàn thành" },
];

export const questionTypeOption = [
  { value: "product", label: "Sản phẩm" },
  { value: "order-support", label: "Đặt hàng" },
  { value: "shipping", label: "Vận chuyển" },
  { value: "refund", label: "Trả lại & Đổi hàng" },
  { value: "payment-support", label: "Thanh toán" },
  { value: "other", label: "Khác" },
];

export const statusOption = [
  { value: "Active", label: "Hoạt động" },
  { value: "Unactive", label: "không hoạt động" },
];
