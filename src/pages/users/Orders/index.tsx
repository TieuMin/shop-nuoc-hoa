import React, { useEffect, useState } from "react";
import {
  Package,
  Truck,
  Clock,
  HandCoins,
  PackageCheck,
  PackageX,
  PackageMinus,
  MessageSquareDashed,
  ChevronLeft,
  MessagesSquare,
} from "lucide-react";
import { OrderList, OrderModel } from "../../admin/Order/stores/interface";
import { getAccessToken } from "../../../utils/jwt";
import { APP_CONFIG } from "../../../utils/env";
import { formatNumber } from "../../../utils/helpers";
import {
  defaultActionData,
  filterDefault,
  OrderStatus,
} from "../../../store/common/constants";
import {
  FilterDefaultModel,
  ModalAction,
} from "../../../store/common/interface";
import orderApi from "../../admin/Order/api/orderApi";
import { LoadingLayout } from "../../../components/LoadingLayout";
import moment from "moment";
import CategoryFormModal from "./components/OrdersCommentModal";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const profile: any = getAccessToken(APP_CONFIG.profileKey ?? "", true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefund, setIsRefund] = useState<boolean>(false);
  const [resData, setResData] = useState<OrderModel | undefined>(undefined);
  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
  });
  const [actionData, setActionData] = useState<ModalAction>(defaultActionData);

  useEffect(() => {
    if (profile?.id) {
      setParamFilter({
        ...filterDefault,
        payload: {
          ...filterDefault.payload,
          userId: profile?.id,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile && paramFilter?.payload?.userId) fetchDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFilter]);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await orderApi.list(paramFilter);
    setIsLoading(false);
    if (res?.statusCode == 200) setResData(res as OrderModel);
    else setResData(undefined);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.Paid:
        return <HandCoins className="w-5 h-5 text-green-500" />;
      case OrderStatus.PendingShipping:
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case OrderStatus.Shipping:
        return <Truck className="w-5 h-5 text-blue-500" />;
      case OrderStatus.Delivered:
        return <PackageCheck className="w-5 h-5 text-green-500" />;
      case OrderStatus.Refund:
        return <PackageX className="w-5 h-5 text-red-500" />;
      case OrderStatus.Cancel:
        return <PackageMinus className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.Paid:
        return "text-green-700 bg-green-100";
      case OrderStatus.PendingShipping:
        return "text-yellow-700 bg-yellow-100";
      case OrderStatus.Shipping:
        return "text-blue-700 bg-blue-100";
      case OrderStatus.Delivered:
        return "text-green-700 bg-green-100";
      case OrderStatus.Refund:
        return "text-red-700 bg-red-100";
      case OrderStatus.Cancel:
        return "text-red-700 bg-red-100";
      default:
        return "text-slate-700 bg-slate-100";
    }
  };

  const getOrderStatus = (status: string) => {
    switch (status) {
      case OrderStatus.Paid:
        return "Đã thanh toán";
      case OrderStatus.PendingShipping:
        return "Chờ giao hàng";
      case OrderStatus.Shipping:
        return "Đang giao hàng";
      case OrderStatus.Delivered:
        return "Đã giao hàng";
      case OrderStatus.Refund:
        return "Hoàn trả";
      case OrderStatus.Cancel:
        return "Hủy đơn hàng";
      default:
        return "Chưa thanh toán";
    }
  };

  const isPaid = (item: any) => {
    if (item?.paymentType !== "QR") return false;
    const blackList = [
      OrderStatus.NotPaid,
      OrderStatus.Refund,
      OrderStatus.Cancel,
    ];
    if (blackList.includes(item?.status) || !item?.status) return false;
    return true;
  };

  if (!resData?.data.length) {
    return (
      <div className="min-h-screen bg-pink-50 pt-20">
        <LoadingLayout isLoading={isLoading} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Package className="w-24 h-24 text-pink-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Chưa có đơn đặt hàng nào
            </h1>
            <p className="text-gray-700 mb-8">
              Bắt đầu mua sắm để xem lịch sử đơn hàng của bạn tại đây
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isShowRefund = (item: OrderList) => {
    const isQr = item?.paymentType === "QR";
    if (!isQr || !item?.paidDate || !item?.id) return false;
    const today = moment();
    if (today.diff(item?.paidDate) > 7) return false;
    return true;
  };

  const isComment = (item: OrderList) => {
    if (!item?.commentId && item?.status === OrderStatus.Delivered) return true;
    return false;
  };

  const handleRefund = async (id: number) => {
    setIsRefund(true);
    const payload = {
      id,
      status: OrderStatus.Refund,
    };
    const res = await orderApi.update(payload);
    setIsRefund(false);
    if (res?.statusCode == 200) setResData(res as OrderModel);
    else setResData(undefined);
  };

  const getCode = (item: OrderList) => {
    let step: string = "payment-support";
    if (item?.status === OrderStatus.Shipping) step = "shipping";
    if (
      item?.status === OrderStatus.Refund ||
      item?.status === OrderStatus.Cancel
    )
      step = "refund";
    if (
      item?.paymentType == "QR" &&
      item?.status === OrderStatus.PendingShipping
    )
      step = "payment-support";

    return `${step}_${item.orderCode}`;
  };

  const getPrice = (price: number, discount?: number) => {
    if (discount && discount > 0) return price * (1 - discount / 100);
    return price;
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-20">
      <LoadingLayout isLoading={isLoading || isRefund} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 mb-5"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-4xl  font-bold text-gray-900 mb-8">
          Lịch sử đặt hàng
        </h1>

        <div className="space-y-6">
          {resData?.data.map((item) => (
            <div
              key={item.orderCode}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
                <div>
                  <h3 className="flex flex-wrap items-center gap-2 text-xl font-semibold text-gray-900">
                    Mã đơn hàng:{" "}
                    <div className="flex gap-2 items-center">
                      <span className="font-bold">{item.orderCode}</span>
                      <Tooltip title="Liên hệ người bán">
                        <Link to={`/contact/${getCode(item)}`}>
                          <div className="bg-pink-100 hover:bg-pink-200 rounded-md p-[3px]">
                            <MessagesSquare className="w-5 h-5 text-pink-800" />
                          </div>
                        </Link>
                      </Tooltip>
                    </div>
                  </h3>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {isPaid(item) && (
                    <div className="flex items-center space-x-1 px-3 py-1 rounded-full text-green-700 bg-green-100">
                      <HandCoins className="w-5 h-5 text-green-500" />
                      <span className="rounded-full text-sm font-medium capitalize">
                        Đã thanh toán
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    <span className="rounded-full text-sm font-medium capitalize">
                      {getOrderStatus(item.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2">
                  <h4 className="font-bold text-gray-900 mb-3">Sản phẩm</h4>
                  <div className="space-y-3">
                    {item.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-3 bg-pink-50 rounded-lg"
                      >
                        <img
                          src={product.product.image}
                          alt={product.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {product.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.product.trademarkName}
                          </p>
                          <p className="text-sm text-gray-600 flex gap-1">
                            <span className="text-pink-600">
                              {formatNumber(
                                getPrice(
                                  product.price,
                                  product?.product?.discount
                                )
                              )}
                              đ
                            </span>
                            {product?.product?.discount > 0 && (
                              <span className="text-gray-500 line-through">
                                {formatNumber(product.price)}đ
                              </span>
                            )}
                            × {product.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-pink-600">
                          {formatNumber(product.price * product.quantity)}đ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-2">
                  <div>
                    <h4 className="text-gray-900 font-bold mb-1">
                      Địa chỉ giao hàng
                    </h4>
                    <div className="text-gray-700 text-sm">
                      <p>
                        <span className="font-semibold w-10">
                          Người nhận hàng:
                        </span>{" "}
                        {item.fullName}
                      </p>
                      <p>
                        <span className="font-semibold w-10">SĐT:</span>{" "}
                        {item.phoneNumber}
                      </p>
                      <p>
                        <span className="font-semibold w-10">Địa chỉ:</span>{" "}
                        {item.address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 items-center justify-between">
                      <h4 className="font-semibold text-gray-600 min-w-40">
                        Ngày đặt hàng
                      </h4>
                      <p className="text-gray-700 text-sm capitalize">
                        {moment(item?.createDate).format("DD-MM-YYYY HH:mmA")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 items-center justify-between">
                      <h4 className="font-semibold text-gray-600 min-w-40">
                        Phương thức thanh toán
                      </h4>
                      <p className="text-gray-700 text-sm capitalize">
                        {item.paymentType === "QR"
                          ? "Chuyển khoản"
                          : "Ship COD"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 items-center justify-between">
                      <h4 className="font-semibold text-gray-600 min-w-40">
                        Thời gian thanh toán
                      </h4>
                      <p className="text-gray-700 text-sm capitalize">
                        {item?.paidDate &&
                          moment(item?.paidDate).format("DD-MM-YYYY HH:mmA")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 items-center justify-between">
                      <h4 className="font-semibold text-gray-600 min-w-40">
                        Ngày vận chuyển
                      </h4>
                      <p className="text-gray-700 text-sm capitalize">
                        {item?.shippingDate &&
                          moment(item?.shippingDate).format(
                            "DD-MM-YYYY HH:mmA"
                          )}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 items-center justify-between">
                      <h4 className="font-semibold text-gray-600 min-w-40">
                        Ngày giao hàng
                      </h4>
                      <p className="text-gray-700 text-sm capitalize">
                        {item?.paidDate &&
                          moment(item?.paidDate).format("DD-MM-YYYY HH:mmA")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2 justify-between border-b">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Tổng phụ
                      </h4>
                      <p className="text-lg font-semibold">
                        {formatNumber(item?.subTotal)}đ
                      </p>
                    </div>
                    <div className="flex gap-2 justify-between border-b">
                      <h4 className="font-semibold text-gray-900 my-1">
                        Vận chuyển
                      </h4>
                      <p className="text-lg font-semibold">20.000đ</p>
                    </div>
                    <div className="flex gap-2 justify-between border-b">
                      <h4 className="font-semibold text-gray-900 my-1">
                        Phiếu giảm giá
                      </h4>
                      <p className="text-lg font-semibold">
                        {formatNumber(item?.discount)}đ
                      </p>
                    </div>
                    <div className="flex gap-2 justify-between">
                      <h4 className="font-semibold text-gray-900 mt-1">
                        Total
                      </h4>
                      <p className="text-xl font-bold text-pink-600">
                        {formatNumber(item?.total)}đ
                      </p>
                    </div>
                    <div
                      className={`flex flex-wrap gap-2 justify-between ${
                        isShowRefund(item) || isComment(item) ? "mt-4" : ""
                      } `}
                    >
                      {isShowRefund(item) && (
                        <button
                          onClick={() => handleRefund(item?.id)}
                          disabled={isLoading || isRefund}
                          className="h-8 min-w-44 px-2 flex-1 bg-pink-500 text-white py-4 rounded-full font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-slate-400 disabled:cursor-no-drop"
                        >
                          <PackageX className="w-5 h-5" />
                          <span>Trả hàng hoàn tiền</span>
                        </button>
                      )}

                      {isComment(item) && (
                        <button
                          onClick={() => {
                            setActionData({ isShow: true, data: item });
                          }}
                          disabled={isLoading || isRefund}
                          className="h-8 px-2 min-w-44 flex-1 bg-pink-500 text-white py-4 rounded-full font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-slate-400 disabled:cursor-no-drop"
                        >
                          <MessageSquareDashed className="w-4 h-4" />
                          <span>Đánh giá</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CategoryFormModal
        actionData={actionData}
        onClose={() => {
          setActionData(defaultActionData);
        }}
        onSussces={() => {
          fetchDataList();
          setActionData(defaultActionData);
        }}
      />
    </div>
  );
};

export default Orders;
