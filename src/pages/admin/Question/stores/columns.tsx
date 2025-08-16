import { Button, Popconfirm, TableColumnsType, Tag, Tooltip } from "antd";
import { QuestionList } from "./interface";
import moment from "moment";
import { CheckCircleOutlined } from "@ant-design/icons";
import { getOrderStatus } from "../../Order/stores/columns";
import { questionTypeOption } from "../../../../store/common/constants";

export const columnsQuestion = ({
  onChangeStatus,
}: {
  onChangeStatus: (row: QuestionList) => void;
}): TableColumnsType<QuestionList> => {
  return [
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
      render: (_v, _r, i) => i + 1,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      width: 150,
    },
    {
      title: "Nội dung",
      dataIndex: "description",
      width: 250,
    },
    {
      title: "Loại câu hỏi",
      dataIndex: "questionType",
      width: 150,
      render: (val) => {
        const item = questionTypeOption.find((x) => x.value == val);
        return item?.label ?? "";
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      width: 100,
    },
    {
      title: "Tài khoản",
      dataIndex: "user",
      width: 150,
      render: (val) => val?.userName,
    },
    {
      title: "Thời gian",
      dataIndex: "createDate",
      width: 150,
      render: (val) =>
        val ? moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss") : val,
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orders",
      width: 150,
      render: (val) => getOrderStatus(val?.status),
    },
    {
      title: "Trạng thái xử lý",
      dataIndex: "status",
      width: 100,
      render: (val) => {
        switch (val) {
          case "pending":
            return <Tag color="default">Chờ xử lý</Tag>;
          case "done":
            return <Tag color="green">Đã hoàn thành</Tag>;
          default:
            return null;
        }
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 80,
      fixed: "right",
      render: (_v, row) => {
        if (row?.status === "done") return;

        return (
          <div className="flex gap-2 justify-center">
            <Tooltip title="Hoàn thành chăm sóc">
              <Popconfirm
                title="Xác nhận đã hoành thành chăm sóc khách hàng!"
                onConfirm={() => onChangeStatus(row)}
                okText="Đồng ý"
                cancelText="Không"
              >
                <Button
                  type="text"
                  className="!bg-red-400 hover:!bg-red-500 !border-none"
                  icon={<CheckCircleOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
