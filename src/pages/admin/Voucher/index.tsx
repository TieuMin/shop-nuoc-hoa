import {
  Button,
  notification,
  Pagination,
  PaginationProps,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { VoucherList, VoucherModel } from "./stores/interface";
import {
  FilterDefaultModel,
  ModalAction,
} from "../../../store/common/interface";
import {
  defaultActionData,
  filterDefault,
  statusOption,
} from "../../../store/common/constants";
import { columnsVoucher } from "./stores/columns";
import voucherApi from "./api/voucherApi";
import { PlusOutlined } from "@ant-design/icons";
import VoucherFormModal from "./components/VoucherFormModal";
import InputSearchDebounce from "../../../components/InputSearchDebounce/InputSearchDebounce";

const Voucher = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionData, setActionData] = useState<ModalAction>(defaultActionData);
  const [resData, setResData] = useState<VoucherModel | undefined>(undefined);
  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
  });

  useEffect(() => {
    if (!isLoading) fetchDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFilter]);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await voucherApi.list(paramFilter);
    setIsLoading(false);
    if (res?.statusCode == 200) setResData(res as VoucherModel);
    else setResData(undefined);
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
      const res = await voucherApi.delete(id);
      if (res?.success) {
        notification.success({
          message: "Xóa mã giảm giá thành công.",
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

  return (
    <div>
      <div className="flex justify-between gap-2 pb-1">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-2">
          <InputSearchDebounce
            fetchDataByKeyword={(val) => onSearchFilter(val, "name")}
            keyParams={(paramFilter?.payload?.name as string) ?? ""}
            placeHolder="Tìm kiếm tên"
            disabled={isLoading}
          />
          <Select
            showSearch
            allowClear
            placeholder="Trạng thái"
            optionFilterProp="label"
            onChange={(val) => onSearchFilter(val, "status")}
            options={statusOption}
            disabled={isLoading}
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
      <Table<VoucherList>
        columns={columnsVoucher({
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

      <VoucherFormModal
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

export default Voucher;
