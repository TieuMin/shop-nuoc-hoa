import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ChevronLeft,
  Plus,
  Minus,
  UserRound,
} from "lucide-react";
import { ProductList } from "../../admin/Product/stores/interface";
import { filterDefault } from "../../../store/common/constants";
import productApi from "../../admin/Product/api/productApi";
import { LoadingLayout } from "../../../components/LoadingLayout";
import { Button, Image, notification, Rate, Space } from "antd";
import { formatNumber } from "../../../utils/helpers";
import moment from "moment";
import { FilterDefaultModel } from "../../../store/common/interface";
import { getAccessToken } from "../../../utils/jwt";
import { APP_CONFIG } from "../../../utils/env";
import cartApi from "../Cart/api/cartApi";
import { PriceList } from "../../admin/Price/stores/interface";
import { useAppDispatch } from "../../../hooks/hookStore";
import { changeTotalCart } from "../../../store/common/commonSlice";

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const profile: any = getAccessToken(APP_CONFIG.profileKey ?? "", true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchCart, setIsFetchCart] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [api, contextHolder] = notification.useNotification();
  const [productData, setProductData] = useState<ProductList | undefined>(
    undefined
  );
  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
  });
  const [priceSelected, setPriceSelected] = useState<PriceList | undefined>(
    undefined
  );

  useEffect(() => {
    if (id) {
      setParamFilter({
        ...filterDefault,
        payload: {
          ...filterDefault.payload,
          productId: Number(id),
        },
      });
    }
  }, [id]);

  useEffect(() => {
    if (paramFilter?.payload?.productId) fetchDataList(paramFilter);
  }, [paramFilter]);

  const fetchDataList = async (filters: FilterDefaultModel) => {
    setIsLoading(true);
    const res = await productApi.detail(filters);
    setIsLoading(false);
    if (res?.data?.prices) setPriceSelected(res?.data?.prices[0]);
    if (res?.data) {
      setProductData(res?.data);
    } else setProductData(undefined);
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-pink-50 pt-20 flex items-center justify-center">
        <LoadingLayout isLoading={isLoading} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-pink-500 hover:text-pink-700 underline"
          >
            Return to homepage
          </button>
        </div>
      </div>
    );
  }

  const getPrice = (discount?: number) => {
    const price = priceSelected?.price ?? 0;
    if (discount && discount > 0) return price * (1 - discount / 100);
    return price;
  };

  const handleAddToCart = async () => {
    if (!profile?.id) {
      openNotification();
      return;
    }

    setIsLoading(true);
    try {
      const res = await cartApi.create({
        productId: productData?.id ?? 0,
        userId: profile.id ?? 0,
        priceId: priceSelected?.id ?? 0,
        price: priceSelected?.price,
        quantity: quantity,
        discount: productData.discount ?? 0,
      });
      setIsLoading(false);
      if (res?.success) {
        notification.success({
          message: "Thêm giỏ hàng thành công.",
        });
        fetchDataCart();
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataCart = async () => {
    setIsFetchCart(true);
    const res = await cartApi.list(paramFilter);
    setIsFetchCart(false);
    if (res?.totalCart) dispatch(changeTotalCart(res?.totalCart ?? 0));
    else dispatch(changeTotalCart(0));
  };

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button
          size="small"
          onClick={(e) => {
            e.preventDefault();
            api.destroy();
          }}
          className="!text-white"
        >
          Hủy
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/login?redirect=${location.pathname}`);
          }}
        >
          Đăng nhập
        </Button>
      </Space>
    );
    api.open({
      message: <div className="font-bold">Yêu cầu đăng nhập!</div>,
      description:
        "Bạn cần đăng nhập để có thể thêm sản phẩm vào giỏ hàng của mình.",
      btn,
      key,
      onClose: () => api.destroy(),
    });
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-20">
      <LoadingLayout isLoading={isLoading || isFetchCart} />
      {contextHolder}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={productData?.image}
                alt={productData?.name}
                className="w-full !h-96 lg:!h-[550px] object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-pink-500 font-medium mb-2">
                {productData?.trademarkName}
              </p>
              <h1 className="text-4xl  font-bold text-gray-900 mb-4">
                {productData?.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <Rate
                  allowHalf
                  defaultValue={productData?.averageRate || 5}
                  disabled
                />
                <span className="text-gray-600">
                  ({productData?.comments?.length} đánh giá)
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-pink-600">
                  {formatNumber(getPrice(productData?.discount))}
                </span>
                {productData?.discount > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatNumber(getPrice())}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-pink-200 pt-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                {productData?.description}
              </p>

              <div className="mb-3">
                <span className="font-bold text-gray-600 mr-2">
                  Thành phần:
                </span>
                <span className="text-gray-600">{productData?.note}</span>
              </div>

              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Phân loại
                </h3>
                <div className="flex space-x-3">
                  {productData?.prices.map((price) => (
                    <button
                      key={price.id}
                      onClick={() => setPriceSelected(price)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        priceSelected?.id === price.id
                          ? "border-pink-500 bg-pink-500 text-white"
                          : "border-pink-300 text-gray-700 hover:border-pink-500"
                      }`}
                    >
                      {price?.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Số lượng
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity == 1}
                    className="w-8 h-8 rounded-lg border border-pink-300 flex items-center justify-center hover:bg-pink-100 transition-colors disabled:cursor-no-drop"
                  >
                    <Minus className="w-3 h-3 text-gray-800" />
                  </button>
                  <span className="text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                    {formatNumber(quantity)}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity == productData?.quantity}
                    className="w-8 h-8 rounded-lg border border-pink-300 flex items-center justify-center hover:bg-pink-100 transition-colors disabled:cursor-no-drop"
                  >
                    <Plus className="w-3 h-3 text-gray-800" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-pink-500 text-white py-4 rounded-xl font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>
                    Thêm giỏ hàng{" "}
                    {formatNumber(getPrice(productData?.discount) * quantity)}đ
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-pink-200 pt-16">
          <h2 className="text-3xl  font-bold text-gray-900 mb-8">Đánh giá</h2>
          <div className="space-y-6">
            {productData?.comments.map((item) => (
              <div
                key={item?.id}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        <UserRound />
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item?.userName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item?.createDate &&
                          moment(item?.createDate).format("DD-MM-YYYY HH:mmA")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Rate allowHalf defaultValue={item?.rate ?? 5} disabled />
                  </div>
                </div>
                <p className="text-gray-700">{item?.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
