import {
  Button,
  notification,
  Pagination,
  PaginationProps,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { ProductList, ProductModel } from "./stores/interface";
import {
  FilterDefaultModel,
  ModalAction,
  OptionSelect,
} from "../../../store/common/interface";
import {
  defaultActionData,
  filterDefault,
  filterSelectList,
  statusOption,
} from "../../../store/common/constants";
import { columnsProduct } from "./stores/columns";
import productApi from "./api/productApi";
import { PlusOutlined } from "@ant-design/icons";
import ProductFormModal from "./components/ProductFormModal";
import InputSearchDebounce from "../../../components/InputSearchDebounce/InputSearchDebounce";
import categoryApi from "../Category/api/categoryApi";
import { CategoryList } from "../Category/stores/interface";
import trademarksApi from "../Trademark/api/trademarkApi";
import { TrademarkList } from "../Trademark/stores/interface";

const Product = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionData, setActionData] = useState<ModalAction>(defaultActionData);
  const [resData, setResData] = useState<ProductModel | undefined>(undefined);
  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
  });
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<OptionSelect[]>([]);
  const [isTrademark, setIsTrademark] = useState<boolean>(false);
  const [trademarkList, setTrademarkList] = useState<OptionSelect[]>([]);

  useEffect(() => {
    fetchCategory();
    fetchTrademark();
  }, []);

  useEffect(() => {
    if (!isLoading) fetchDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFilter]);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await productApi.list(paramFilter);
    setIsLoading(false);
    if (res?.statusCode == 200) setResData(res as ProductModel);
    else setResData(undefined);
  };

  const fetchCategory = async () => {
    setIsCategory(true);
    try {
      const res = await categoryApi.list(filterSelectList);
      setIsCategory(false);
      if (res?.data) {
        const newLst = res.data?.map((x: CategoryList) => ({
          value: x?.id,
          label: x?.name,
        }));
        setCategoryList(newLst);
      } else setCategoryList([]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsCategory(false);
    }
  };
  const fetchTrademark = async () => {
    setIsTrademark(true);
    try {
      const res = await trademarksApi.list(filterSelectList);
      setIsTrademark(false);
      if (res?.data) {
        const newLst = res.data?.map((x: TrademarkList) => ({
          value: x?.id,
          label: x?.name,
        }));
        setTrademarkList(newLst);
      } else setTrademarkList([]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsTrademark(false);
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

  const onDelete = async (id: number) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await productApi.delete(id);
      if (res?.success) {
        notification.success({
          message: "Xóa sản phẩm thành công.",
        });
        fetchDataList();
      }
    } catch (err) {
      console.log("err", err);
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

  const loading = isLoading || isCategory || isTrademark;

  return (
    <div>
      <div className="flex justify-between gap-2 pb-1">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-2">
          <InputSearchDebounce
            fetchDataByKeyword={(val) => onSearchFilter(val, "name")}
            keyParams={(paramFilter?.payload?.name as string) ?? ""}
            placeHolder="Tìm kiếm tên"
            disabled={loading}
          />
          <Select
            showSearch
            allowClear
            placeholder="Danh mục"
            optionFilterProp="label"
            onChange={(val) => onSearchFilter(val, "categoryId")}
            options={categoryList}
            disabled={loading}
          />
          <Select
            showSearch
            allowClear
            placeholder="Thương hiệu"
            optionFilterProp="label"
            onChange={(val) => onSearchFilter(val, "trademarkId")}
            options={trademarkList}
            disabled={loading}
          />
          <Select
            showSearch
            allowClear
            placeholder="Trạng thái"
            optionFilterProp="label"
            onChange={(val) => onSearchFilter(val, "status")}
            options={statusOption}
            disabled={loading}
          />
        </div>
        <div>
          <Button
            disabled={isLoading}
            icon={<PlusOutlined />}
            onClick={() => setActionData({ isShow: true, data: undefined })}
          >
            Tạo
          </Button>
        </div>
      </div>
      <Table<ProductList>
        columns={columnsProduct({
          setActionData,
          onDelete,
        })}
        dataSource={resData?.data}
        scroll={{ x: "max-content" }}
        pagination={false}
        loading={isLoading}
      />
      {resData?.data && !isLoading ? (
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

      <ProductFormModal
        actionData={actionData}
        onClose={() => {
          setActionData({ isShow: false, data: undefined });
        }}
        onSussces={() => {
          setActionData({ isShow: false, data: undefined });
          fetchDataList();
        }}
      />
    </div>
  );
};

export default Product;
