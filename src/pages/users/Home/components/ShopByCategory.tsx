import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategoryList } from "../../../admin/Category/stores/interface";
import { Skeleton } from "antd";
import { useAppSelector } from "../../../../hooks/hookStore";

const ShopByCategory = () => {
  const [categorys, setCategorys] = useState<CategoryList[]>([]);
  const categories = useAppSelector(
    (state) => state.common.categories as unknown as CategoryList[]
  );

  useEffect(() => {
    if (categories?.length && categories?.length > 3) {
      setCategorys(categories?.splice(0, 4));
    } else if (categories?.length) setCategorys(categories);
  }, [categories]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Danh mục đề xuất
          </h2>
          <p className="text-xl text-gray-700">
            Tìm mùi hương hoàn hảo cho mọi cá tính
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {!categorys?.length ? (
            <>
              {[...Array(3)].map((_x, idx) => (
                <Skeleton.Image
                  key={idx}
                  active={true}
                  style={{ width: "100%", height: 320 }}
                />
              ))}
            </>
          ) : (
            <>
              {categorys.map((category, index) => (
                <Link
                  key={index}
                  to={`/categories/${category?.id}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <h3 className="text-2xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="text-pink-100">{category.description}</p>
                      <div className="mt-4 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <span className="font-medium">Mua ngay</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
