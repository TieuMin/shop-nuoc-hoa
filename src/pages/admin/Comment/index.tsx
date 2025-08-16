import { Pagination, PaginationProps, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { CommentList, CommentModel } from "./stores/interface";
import {
  FilterDefaultModel,
  OptionSelect,
} from "../../../store/common/interface";
import {
  filterDefault,
  filterSelectList,
  rateOption,
} from "../../../store/common/constants";
import { columnsComment } from "./stores/columns";
import commentApi from "./api/commentApi";
import productApi from "../Product/api/productApi";
import { ProductList } from "../Product/stores/interface";
import { getAccessToken } from "../../../utils/jwt";
import { APP_CONFIG } from "../../../utils/env";

const Comment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resData, setResData] = useState<CommentModel | undefined>(undefined);
  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
  });
  const [isProduct, setIsProduct] = useState<boolean>(false);
  const [productList, setProductList] = useState<OptionSelect[]>([]);
  const token = getAccessToken(APP_CONFIG.tokenAdminKey);

  useEffect(() => {
    if (token && !isLoading) fetchDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFilter, token]);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await commentApi.list(paramFilter, token);
    setIsLoading(false);
    if (res?.statusCode == 200) setResData(res as CommentModel);
    else setResData(undefined);
  };

  const fetchProduct = async () => {
    setIsProduct(true);
    try {
      const res = await productApi.list(filterSelectList, token);
      setIsProduct(false);
      if (res?.data) {
        const newLst = res.data?.map((x: ProductList) => ({
          value: x?.id,
          label: x?.name,
        }));
        setProductList(newLst);
      } else setProductList([]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsProduct(false);
    }
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

  const onSearchFilter = (val: string, key: string) => {
    setParamFilter({
      ...paramFilter,
      payload: {
        ...paramFilter.payload,
        [key]: val ?? undefined,
      },
    });
  };

  const loading = isLoading || isProduct;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-2">
        <Select
          showSearch
          allowClear
          placeholder="Sản phẩm"
          optionFilterProp="label"
          onChange={(val) => onSearchFilter(val, "productId")}
          options={productList}
          disabled={loading}
        />
        <Select
          showSearch
          allowClear
          placeholder="Trạng thái"
          optionFilterProp="label"
          onChange={(val) => onSearchFilter(val, "rate")}
          options={rateOption}
          disabled={loading}
        />
      </div>
      <Table<CommentList>
        columns={columnsComment()}
        dataSource={resData?.data}
        scroll={{ x: "max-content" }}
        pagination={false}
        loading={loading}
      />
      {resData?.data && !loading ? (
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
    </div>
  );
};

export default Comment;
