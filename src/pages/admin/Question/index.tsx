import { notification, Pagination, PaginationProps, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { QuestionList, QuestionModel } from "./stores/interface";
import { FilterDefaultModel } from "../../../store/common/interface";
import { filterDefault, questionStatus } from "../../../store/common/constants";
import { columnsQuestion } from "./stores/columns";
import { getAccessToken } from "../../../utils/jwt";
import { APP_CONFIG } from "../../../utils/env";
import questionApi from "./api/questionApi";
import InputSearchDebounce from "../../../components/InputSearchDebounce/InputSearchDebounce";

const Question = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resData, setResData] = useState<QuestionModel | undefined>(undefined);
  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
  });
  const token = getAccessToken(APP_CONFIG.tokenAdminKey);

  useEffect(() => {
    if (token && !isLoading) fetchDataList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFilter, token]);

  const fetchDataList = async () => {
    setIsLoading(true);
    const res = await questionApi.list(paramFilter, token);
    setIsLoading(false);
    if (res?.statusCode == 200) setResData(res as QuestionModel);
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

  const onSearchFilter = (val: string, key: string) => {
    setParamFilter({
      ...paramFilter,
      payload: {
        ...paramFilter.payload,
        [key]: val ?? undefined,
      },
    });
  };

  const onChangeStatus = async (row: QuestionList) => {
    if (!row?.id) return;
    setIsLoading(true);
    try {
      const payload = {
        id: row?.id,
        status: "done",
      };
      const res = await questionApi.update(payload);
      if (res?.success) {
        notification.success({
          message: "Xác nhận hoàn thành chăm sóc khách hàng thành công.",
        });
        fetchDataList();
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-2">
        <InputSearchDebounce
          fetchDataByKeyword={(val) => onSearchFilter(val, "orderCode")}
          keyParams={(paramFilter?.payload?.name as string) ?? ""}
          placeHolder="Mã đơn hàng"
          disabled={isLoading}
        />
        <Select
          showSearch
          allowClear
          placeholder="Trạng thái"
          optionFilterProp="label"
          onChange={(val) => onSearchFilter(val, "status")}
          options={questionStatus}
          disabled={isLoading}
        />
      </div>
      <Table<QuestionList>
        columns={columnsQuestion({ onChangeStatus })}
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
    </div>
  );
};

export default Question;
