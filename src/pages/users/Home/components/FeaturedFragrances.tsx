import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductList } from "../../../admin/Product/stores/interface";
import productApi from "../../../admin/Product/api/productApi";
import { filterDefault } from "../../../../store/common/constants";
import { Skeleton } from "antd";
import ProductCard from "../../../../components/ProductCard";

const FeaturedFragrances = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductList[]>([]);

  useEffect(() => {
    fetchDataList();
  }, []);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await productApi.list({
      ...filterDefault,
      payload: { ...filterDefault.payload, pageSize: 6 },
    });
    setIsLoading(false);
    if (res?.data) setProducts(res?.data as ProductList[]);
    else setProducts([]);
  };

  return (
    <section className="py-16 bg-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nước hoa nổi bật
          </h2>
          <p className="text-xl text-gray-700">
            Khám phá những mùi hương phổ biến và được yêu thích nhất của chúng
            tôi
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              {[...Array(3)].map((_x, idx) => (
                <Skeleton.Image
                  key={idx}
                  active={isLoading}
                  style={{ width: "100%", height: 320 }}
                />
              ))}
            </>
          ) : (
            <>
              {products.map((product) => (
                <Link to={`/product/${product.id}`} className="group">
                  <ProductCard key={product?.id} product={product} />
                </Link>
              ))}
            </>
          )}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/categories/women"
            className="bg-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-pink-600 hover:text-white transition-colors inline-flex items-center space-x-2"
          >
            <span>Xem tất cả</span>
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedFragrances;
