import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Filter, Grid, List } from "lucide-react";
import ProductCard from "../../../components/ProductCard";
import { Pagination, PaginationProps, Select, Skeleton, Slider } from "antd";
import {
  FilterDefaultModel,
  OptionSelect,
} from "../../../store/common/interface";
import { filterDefault } from "../../../store/common/constants";
import { CategoryList } from "../../admin/Category/stores/interface";
import { TrademarkList } from "../../admin/Trademark/stores/interface";
import { formatNumber } from "../../../utils/helpers";
import productApi from "../../admin/Product/api/productApi";
import {
  ProductList,
  ProductModel,
} from "../../admin/Product/stores/interface";
import { useAppSelector } from "../../../hooks/hookStore";
import { LoadingLayout } from "../../../components/LoadingLayout";
const Categories: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productData, setProductData] = useState<ProductList[]>([]);
  const [resData, setResData] = useState<ProductModel | undefined>(undefined);
  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
    payload: {
      ...filterDefault.payload,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    },
  });

  const [categoryList, setCategoryList] = useState<OptionSelect[]>([]);
  const [trademarkList, setTrademarkList] = useState<OptionSelect[]>([]);
  const categories: any = useAppSelector((state) => state.common.categories);
  const trademarks: any = useAppSelector((state) => state.common.trademarks);

  useEffect(() => {
    fetchCategory();
    fetchTrademark();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, trademarks]);

  useEffect(() => {
    if (categoryId) {
      setParamFilter({
        ...paramFilter,
        payload: {
          ...paramFilter.payload,
          categoryId: Number(categoryId),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  useEffect(() => {
    if (!isLoading) fetchDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFilter]);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await productApi.list(paramFilter);
    setIsLoading(false);
    if (res?.data) setProductData(res.data);
    if (res?.statusCode == 200) setResData(res as ProductModel);
    else {
      setProductData([]);
      setResData(undefined);
    }
  };

  const fetchCategory = async () => {
    if (categories?.length) {
      const newLst = categories?.map((x: CategoryList) => ({
        value: x?.id,
        label: x?.name,
      }));
      setCategoryList(newLst);
    }
  };

  const fetchTrademark = async () => {
    if (trademarks?.length) {
      const newLst = trademarks?.map((x: TrademarkList) => ({
        value: x?.id,
        label: x?.name,
      }));
      setTrademarkList(newLst);
    }
  };

  const onSearchFilter = (val: string, key: string) => {
    setParamFilter({
      ...paramFilter,
      payload: {
        ...paramFilter.payload,
        [key]: val ?? undefined,
      },
    });
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setParamFilter({
      ...paramFilter,
      payload: {
        ...paramFilter.payload,
        page: current ?? 1,
        pageSize: pageSize ?? 10,
      },
    });
  };

  const debounceRef = useRef<any>(null);
  const onChangePriceRange = (e: number, isMax?: boolean) => {
    setPriceRange([!isMax ? e : priceRange[0], isMax ? e : priceRange[1]]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setParamFilter({
        ...filterDefault,
        payload: {
          ...filterDefault.payload,
          minPrice: !isMax ? e : priceRange[0],
          maxPrice: isMax ? e : priceRange[1],
        },
      });
    }, 600);
  };

  const getPageSize = () => {
    const pageSize = resData?.pageSize ?? 0;
    const total = resData?.total ?? 0;
    if (pageSize > total) return total;
    return pageSize;
  };

  const getCategoryId = () => {
    if (paramFilter?.payload?.categoryId)
      return paramFilter?.payload?.categoryId;
    return undefined;
  };

  const getTrademarkId = () => {
    if (paramFilter?.payload?.trademarkId)
      return paramFilter?.payload?.trademarkId;
    return undefined;
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-20">
      <LoadingLayout isLoading={isLoading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl  font-bold text-gray-900 mb-4">Sản Phẩm</h1>
          <p className="text-gray-700">
            Khám phá những loại nước hoa cao cấp được chế tác theo phong cách
            độc đáo của bạn
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Bộ lọc
              </h3>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <Select
                  showSearch
                  allowClear
                  placeholder="Danh mục"
                  optionFilterProp="label"
                  className="w-full"
                  onChange={(val: any) => onSearchFilter(val, "categoryId")}
                  options={categoryList}
                  disabled={isLoading}
                  value={getCategoryId()}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu
                </label>
                <Select
                  showSearch
                  allowClear
                  placeholder="Sắp xếp theo"
                  optionFilterProp="label"
                  className="w-full"
                  onChange={(val: any) => onSearchFilter(val, "trademarkId")}
                  options={trademarkList}
                  disabled={isLoading}
                  value={getTrademarkId()}
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <Select
                  showSearch
                  allowClear
                  placeholder="Sắp xếp theo"
                  optionFilterProp="label"
                  className="w-full"
                  // onChange={(val) => onSearchFilter(val, "productId")}
                  options={[
                    { value: "price_low", label: "Giá: Thấp đến Cao" },
                    { value: "price_high", label: "Giá: Cao đến Thấp" },
                    { value: "rating", label: "Đánh giá cao nhất" },
                    { value: "name", label: "Tên: A-Z" },
                  ]}
                  disabled={isLoading}
                />
              </div>

              {/* Price Range */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoảng giá: {formatNumber(priceRange[0])}đ -{" "}
                  {formatNumber(priceRange[1])}đ
                </label>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={10000000}
                    onChange={(e) => onChangePriceRange(e)}
                    value={priceRange[0]}
                    disabled={isLoading}
                  />
                  <Slider
                    min={1}
                    max={10000000}
                    onChange={(e) => onChangePriceRange(e, true)}
                    value={priceRange[1]}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-700">
                Hiển thị {getPageSize()} of {resData?.total} sản phẩm
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-pink-500 text-white"
                      : "text-pink-500 hover:bg-pink-100"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-pink-500 text-white"
                      : "text-pink-500 hover:bg-pink-100"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "grid grid-cols-1 gap-4"
              }
            >
              {productData?.length && !isLoading ? (
                <>
                  {productData.map((product) => (
                    <ProductCard key={product?.id} product={product} />
                  ))}
                </>
              ) : null}
              {isLoading ? (
                <>
                  {[...Array(6)].map((_x, idx) => (
                    <Skeleton.Image
                      key={idx}
                      active={isLoading}
                      style={{ width: "100%", height: 320 }}
                    />
                  ))}
                </>
              ) : null}
            </div>

            {productData?.length && !isLoading ? (
              <div className="flex justify-end mt-2">
                <Pagination
                  showSizeChanger
                  onChange={onShowSizeChange}
                  current={resData?.page}
                  pageSize={resData?.pageSize}
                  total={resData?.total}
                  pageSizeOptions={[10, 20, 50, 100, 200]}
                />
              </div>
            ) : null}

            {!productData?.length && !isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
