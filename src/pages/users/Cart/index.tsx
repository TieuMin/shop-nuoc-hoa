import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft } from "lucide-react";
import { CartList } from "./stores/interface";
import {
  FilterDefaultModel,
  OptionSelect,
} from "../../../store/common/interface";
import { filterDefault } from "../../../store/common/constants";
import { formatNumber } from "../../../utils/helpers";
import cartApi from "./api/cartApi";
import { getAccessToken } from "../../../utils/jwt";
import { APP_CONFIG } from "../../../utils/env";
import { useAppDispatch, useAppSelector } from "../../../hooks/hookStore";
import {
  changeTotalCart,
  changeVoucher,
} from "../../../store/common/commonSlice";
import { notification, Select } from "antd";
import { LoadingLayout } from "../../../components/LoadingLayout";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [voucher, setVoucher] = useState<number | undefined>(undefined);
  const [voucherLst, setVoucherLst] = useState<OptionSelect[]>([]);
  const [cartList, setCartList] = useState<CartList[]>([]);
  const profile: any = getAccessToken(APP_CONFIG.profileKey ?? "", true);
  const token = getAccessToken(APP_CONFIG.tokenKey);
  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
  });
  const dispatch = useAppDispatch();
  const vouchers: any = useAppSelector((state) => state.common.vouchers);

  useEffect(() => {
    if (profile?.id) {
      setParamFilter({
        ...filterDefault,
        payload: {
          ...filterDefault.payload,
          userId: profile?.id,
          pageSize: 9999,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile && paramFilter?.payload?.userId && token) fetchDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFilter, token]);

  useEffect(() => {
    if (vouchers?.length) setVoucherLst(vouchers);
  }, [vouchers]);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await cartApi.list(paramFilter, token);
    setIsLoading(false);
    if (res?.totalCart) dispatch(changeTotalCart(res?.totalCart ?? 0));
    if (res?.data?.length) setCartList(res?.data);
    else {
      setCartList([]);
      dispatch(changeTotalCart(0));
    }
  };

  const handleCheckout = () => {
    if (voucher) dispatch(changeVoucher(voucher));
    navigate("/checkout");
  };

  const onChangeQuantityProduct = async (id: number, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await cartApi.update({ id, quantity });
      if (res?.success) {
        fetchDataList();
        notification.success({
          message:
            quantity == 0
              ? "Xóa sản phẩm khỏi giỏ hàng thành công!"
              : "Cập nhật số lượng thành công!",
        });
      }
      setIsLoading(false);
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
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

  if (!cartList?.length) {
    return (
      <div className="min-h-screen bg-pink-50 pt-20">
        <LoadingLayout isLoading={isLoading} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-pink-300 mx-auto mb-6" />
            <h1 className="text-3xl  font-bold text-gray-900 mb-4">
              Giỏ hàng của bạn trống
            </h1>
            <p className="text-gray-700 mb-8">
              Khám phá bộ sưu tập nước hoa sang trọng tuyệt vời của chúng tôi
            </p>
            <Link
              to="/"
              className="bg-pink-500 !text-white px-8 py-4 rounded-xl font-semibold hover:bg-pink-600 transition-colors inline-flex items-center space-x-2"
            >
              <span>Tiếp tục mua sắm</span>
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getPrice = (price: number, discount?: number) => {
    if (discount && discount > 0) return price * (1 - discount / 100);
    return price;
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-20">
      <LoadingLayout isLoading={isLoading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 mb-5"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-4xl  font-bold text-gray-900 mb-8">Giỏ hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartList?.map((item) => (
              <div
                key={`${item?.product?.id}-${item?.id}`}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item?.product?.image}
                    alt={item?.product?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item?.product?.name} ({item?.price?.name})
                    </h3>
                    <p className="text-gray-600">
                      {item?.product?.trademarkName}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-pink-600">
                        {formatNumber(
                          getPrice(item?.price?.price, item.product.discount)
                        )}
                        đ
                      </span>
                      {item.product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatNumber(getPrice(item?.price?.price))}đ
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        onChangeQuantityProduct(item?.id, item?.quantity - 1)
                      }
                      className="w-8 h-8 rounded-full border border-pink-300 flex items-center justify-center hover:bg-pink-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-medium text-gray-900 min-w-[2rem] text-center">
                      {formatNumber(item?.quantity ?? 0)}
                    </span>
                    <button
                      onClick={() =>
                        onChangeQuantityProduct(item?.id, item?.quantity + 1)
                      }
                      className="w-8 h-8 rounded-full border border-pink-300 flex items-center justify-center hover:bg-pink-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => onChangeQuantityProduct(item?.id, 0)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-md h-fit">
            <h2 className="text-2xl  font-semibold text-gray-900 mb-6">
              Đơn hàng
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-700">Tổng phụ</span>
                <span className="text-gray-900 font-medium">
                  {formatNumber(getTotal())}đ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Phí vận chuyển</span>
                <span className="text-gray-900 font-medium">
                  {cartList?.length ? "20.000đ" : "0đ"}
                </span>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Mã giảm giá</span>
                  <span className="text-gray-900 font-medium">
                    {formatNumber(getVoucherQuantity())}đ
                  </span>
                </div>
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn mã giảm giá"
                  optionFilterProp="label"
                  className="w-full mt-1"
                  onChange={setVoucher}
                  options={voucherLst}
                  disabled={!cartList?.length || isLoading}
                  value={voucher}
                />
              </div>
              <div className="border-t border-pink-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Tổng tiền</span>
                  <span className="text-gray-900">
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
            <button
              onClick={handleCheckout}
              disabled={!cartList?.length || isLoading}
              className="w-full bg-pink-500 text-white py-4 rounded-xl font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-slate-400 disabled:cursor-no-drop"
            >
              <span>Thanh toán</span>
              <ShoppingBag className="w-5 h-5" />
            </button>
            <Link
              to="/"
              className="block text-center text-pink-500 hover:text-pink-700 mt-4 underline"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
