import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { ProductList } from "../pages/admin/Product/stores/interface";
import { formatNumber } from "../utils/helpers";
import { ObjAny } from "../store/common/interface";
import cartApi from "../pages/users/Cart/api/cartApi";
import { Button, notification, Rate, Space } from "antd";
import { getAccessToken } from "../utils/jwt";
import { APP_CONFIG } from "../utils/env";
import { LoadingLayout } from "./LoadingLayout";
import { useAppDispatch, useAppSelector } from "../hooks/hookStore";
import { changeTotalCart } from "../store/common/commonSlice";

interface ProductCardProps {
  product: ProductList;
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  featured = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const profile: any = getAccessToken(APP_CONFIG.profileKey ?? "", true);
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const totalCart = useAppSelector((state) => state.common.totalCart);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!profile?.id) {
      openNotification();
      return;
    }

    setIsLoading(true);
    try {
      const itemPrice = product?.prices?.[0];
      const res = await cartApi.create({
        productId: product.id ?? 0,
        userId: profile.id ?? 0,
        priceId: itemPrice?.id ?? 0,
        price: itemPrice?.price,
        quantity: 1,
        discount: product.discount ?? 0,
      });
      setIsLoading(false);
      if (res?.success) {
        notification.success({
          message: "Thêm giỏ hàng thành công.",
        });
        dispatch(changeTotalCart(totalCart + 1));
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrice = (prices: ObjAny[], discount?: number) => {
    const price = prices?.[0]?.price ?? 0;
    if (discount && discount > 0) return price * (1 - discount / 100);
    return price;
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
    <Link to={`/product/${product.id}`} className="group">
      <LoadingLayout isLoading={isLoading} />
      {contextHolder}
      <div
        className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden animate-scale-in ${
          featured ? "border-2 border-pink-300" : ""
        }`}
      >
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sale
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingCart className="w-5 h-5 text-pink-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-pink-500">
              {product.trademarkName}
            </span>
            <div className="flex items-center space-x-1">
              <Rate
                allowHalf
                defaultValue={product?.averageRate || 5}
                disabled
              />
              <span className="text-sm text-gray-500">
                ({product?.totalComment ?? 0})
              </span>
            </div>
          </div>

          <h3 className="text-lg  font-semibold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
            {product.name} ({product?.prices?.[0]?.name})
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-pink-600">
                {formatNumber(getPrice(product?.prices, product.discount))}đ
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {formatNumber(getPrice(product?.prices))}đ
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600 capitalize">
              {product.categoryName}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
