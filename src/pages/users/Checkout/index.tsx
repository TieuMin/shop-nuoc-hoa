import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, Clock, ChevronLeft } from "lucide-react";
import { CartList } from "../Cart/stores/interface";
import { OptionSelect } from "../../../store/common/interface";
import { getAccessToken } from "../../../utils/jwt";
import { APP_CONFIG } from "../../../utils/env";
import { formatNumber } from "../../../utils/helpers";
import { useAppDispatch, useAppSelector } from "../../../hooks/hookStore";
import { Button, Form, Input, notification, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import orderApi from "../../admin/Order/api/orderApi";
import { LoadingLayout } from "../../../components/LoadingLayout";
import {
  changeCarts,
  changeTotalCart,
  changeVoucher,
  changeVouchers,
} from "../../../store/common/commonSlice";
import voucherApi from "../../admin/Voucher/api/voucherApi";
import { VoucherList } from "../../admin/Voucher/stores/interface";

const Checkout: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const profile: any = getAccessToken(APP_CONFIG.profileKey ?? "", true);
  const token = getAccessToken(APP_CONFIG.tokenKey);
  const voucher = useAppSelector((state) => state.common.voucher);
  const [voucherLst, setVoucherLst] = useState<OptionSelect[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showQR, setShowQR] = useState(false);
  const [cartList, setCartList] = useState<CartList[]>([]);
  const carts: any = useAppSelector((state) => state.common.carts);
  const vouchers: any = useAppSelector((state) => state.common.vouchers);

  const navigate = useNavigate();

  useEffect(() => {
    if (carts?.length) setCartList(carts);
    if (vouchers?.length) setVoucherLst(vouchers);
  }, [carts, vouchers]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQR && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showQR, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = await form.validateFields();
      const payload = {
        ...formData,
        cartIds: cartList?.map((x) => x.id),
        userId: profile?.id,
        subTotal: getTotal(),
        discount: getVoucherQuantity(),
        total: getTotal(cartList?.length ? 20000 : 0, getVoucherQuantity()),
        voucherId: voucher || "",
        token,
      };
      const res = await orderApi.create(payload);
      setIsLoading(false);
      if (res?.success) {
        notification.success({
          message: "Đặt hàng thành công!",
        });
        dispatch(changeTotalCart(0));
        dispatch(changeCarts([]));
        dispatch(changeVoucher(""));
        if (formData?.paymentType == "QR") setShowQR(true);
        else navigate("/orders");
        fetchVoucherList();
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoucherList = async () => {
    const res = await voucherApi.listUser(profile?.id ?? 0, token);
    if (res?.data?.length) {
      const newData: OptionSelect[] = res?.data?.map((x: VoucherList) => ({
        ...x,
        value: x.id,
        label: x.name,
      }));
      dispatch(changeVouchers(newData));
    } else dispatch(changeVouchers([]));
  };

  const getTotal = (shipping?: number, voucher?: number) => {
    const total = cartList?.reduce((prev, curr) => (prev += curr.total), 0);
    if (shipping) {
      const price = (total || 0) + shipping;
      return price - (voucher || 0);
    }
    return total ?? 0;
  };

  const getVoucherQuantity = () => {
    if (!voucher || !cartList?.length) return 0;

    const item: any = voucherLst.find((x) => x.value == `${voucher}`);
    if (item?.priceType == "Percent") {
      const total = getTotal() + 20000;
      const discount = total * (item?.discount / 100);
      return Math.min(discount, item?.maxPrice);
    } else return item?.price;
  };

  const handlePaymentComplete = () => {
    notification.success({
      message: "Thanh toán của bạn đã được ghi nhận!",
      description:
        "Hãy theo dõi đơn hàng để cập nhật trạng thái mới nhất, hệ thống sẽ duyệt đơn hàng của bạn trong 30 phút kể từ khi chuyển khoản thành công. Nếu bạn có thắc mắc về đơn hàng có thể liên hệ với chúng tôi tại mục Liên hệ. Xin cảm ơn!",
      duration: 25,
    });
    navigate("/orders");
  };

  const getPrice = (price: number, discount?: number) => {
    if (discount && discount > 0) return price * (1 - discount / 100);
    return price;
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-20">
      <LoadingLayout isLoading={isLoading} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 mb-5"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-4xl  font-bold text-gray-900 mb-8">
          Thông tin thanh toán
        </h1>

        {!showQR && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Form */}
            <div className="bg-white p-8 rounded-2xl shadow-md">
              <h2 className="text-2xl  font-semibold text-gray-900 mb-6 flex items-center">
                <Truck className="w-6 h-6 mr-2" />
                Thông tin vận chuyển
              </h2>
              <Form
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
                form={form}
              >
                <Form.Item
                  label="Họ và Tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" className="h-10" />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại!",
                    },
                    {
                      message: "Vui lòng chỉ nhập số!",
                      pattern: new RegExp(/^[0-9]*$/),
                    },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.reject();
                        if (value.length > 10) {
                          return Promise.reject(
                            "Số điện thoại không vượt quá 10 ký tự"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" className="h-10" />
                </Form.Item>
                <Form.Item
                  label="Địa chỉ giao hàng"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ giao hàng!",
                    },
                  ]}
                >
                  <TextArea placeholder="Nhập địa chỉ" />
                </Form.Item>
                <Form.Item
                  label="Phương thức thanh toán"
                  name="paymentType"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phương thức thanh toán!",
                    },
                  ]}
                >
                  <Select
                    className="h-10"
                    options={[
                      { value: "QR", label: "Chuyển khoản" },
                      { value: "Money", label: "Ship COD" },
                    ]}
                    placeholder="Chọn phương thức thanh toán"
                  />
                </Form.Item>
              </Form>
              <Button
                disabled={isLoading}
                loading={isLoading}
                className="mt-3 w-full h-12"
                onClick={handleSubmit}
              >
                Đặt hàng
              </Button>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-8 rounded-2xl shadow-md h-fit">
              <h2 className="text-2xl  font-semibold text-gray-900 mb-6">
                Tóm tắt đơn hàng
              </h2>
              <div className="space-y-4 mb-6">
                {cartList?.map((item) => (
                  <div
                    key={`${item.product.id}-${item.id}`}
                    className="flex items-center space-x-3"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.product.name} ({item?.price?.name})
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(
                          getPrice(item.price.price, item.product.discount)
                        )}
                        đ x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-pink-600">
                      {formatNumber(
                        getPrice(item.price.price, item.product.discount) *
                          item.quantity
                      )}
                      đ
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-pink-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Tổng phụ</span>
                  <span>{formatNumber(getTotal())}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{cartList?.length ? "20.000đ" : "0đ"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Mã giảm giá</span>
                  <span> {formatNumber(getVoucherQuantity())}đ</span>
                </div>
                {voucher ? (
                  <>
                    <Select
                      showSearch
                      allowClear
                      placeholder="Chọn mã giảm giá"
                      optionFilterProp="label"
                      className="w-full mt-1"
                      options={voucherLst}
                      disabled={true}
                      value={voucher}
                    />
                  </>
                ) : null}

                <div className="flex justify-between text-lg font-semibold border-t border-pink-200 pt-2">
                  <span>Tổng tiền</span>
                  <span>
                    {formatNumber(
                      getTotal(
                        cartList?.length ? 20000 : 0,
                        getVoucherQuantity()
                      )
                    )}
                    đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showQR && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-md text-center">
              <h2 className="text-2xl  font-semibold text-gray-900 mb-6">
                Hoàn tất thanh toán của bạn
              </h2>
              <div className="bg-pink-50 p-8 rounded-xl mb-6">
                <div className="w-64 h-64 bg-white border-2 border-dashed border-pink-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-center">
                    <CreditCard className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                    <p className="text-gray-600">Quét mã QR Tại Đây</p>
                    <p className="text-sm text-gray-500">Quét để thanh toán</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">
                  Số tiền:{" "}
                  <span className="font-bold">
                    {formatNumber(
                      getTotal(
                        cartList?.length ? 20000 : 0,
                        getVoucherQuantity()
                      )
                    )}
                    đ
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-6">
                <Clock className="w-5 h-5" />
                <span>Thời gian còn lại: {formatTime(timeLeft)}</span>
              </div>
              <p className="text-gray-700 mb-6">
                Quét mã QR bằng ứng dụng ngân hàng của bạn để hoàn tất thanh
                toán
              </p>
              <button
                onClick={handlePaymentComplete}
                className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                Hoàn tất thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
