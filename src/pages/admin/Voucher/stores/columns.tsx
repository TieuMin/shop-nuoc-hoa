import { Button, Popconfirm, TableColumnsType, Tag, Tooltip } from "antd";
import { VoucherList } from "./interface";
import { ModalAction } from "../../../../store/common/interface";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatNumber } from "../../../../utils/helpers";

export const columnsVoucher = ({
  setActionData,
  onDelete,
}: {
  setActionData: (x: ModalAction) => void;
  onDelete: (x: number) => void;
}): TableColumnsType<VoucherList> => {
  return [
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
      render: (_v, _r, i) => i + 1,
    },
    {
      title: "Mã",
      dataIndex: "code",
      width: 120,
    },
    {
      title: "Tên",
      dataIndex: "name",
      width: 250,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 100,
      render: (val) => (val ? formatNumber(val) : val),
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "discount",
      width: 180,
    },
    {
      title: "Chiết khấu tối đa",
      dataIndex: "maxPrice",
      width: 150,
      render: (val) => `${formatNumber(val ?? 0)}đ`,
    },
    {
      title: "Số tiền giảm",
      dataIndex: "price",
      width: 150,
      render: (val) => `${formatNumber(val ?? 0)}đ`,
    },
    {
      title: "Loại mã",
      dataIndex: "priceType",
      width: 180,
      render: (val) =>
        val === "Percent" ? (
          <Tag color="cyan">Chiết khấu %</Tag>
        ) : (
          <Tag color="blue">Chiết khấu trực tiếp</Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (val) => {
        switch (val) {
          case "Active":
            return <Tag color="green">Hoạt động</Tag>;
          case "Unactive":
            return <Tag color="green">Không hoạt động</Tag>;
          default:
            return null;
        }
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 100,
      fixed: "right",
      render: (_v, row) => {
        return (
          <div className="flex gap-2">
            <Tooltip title="Sửa mã giảm giá">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setActionData({ isShow: true, data: row })}
              />
            </Tooltip>
            <Tooltip title="Xóa mã giảm giá">
              <Popconfirm
                title="Xóa mã giảm giá"
                description="Bạn có chắc chắn muốn xóa mã giảm giá này?"
                onConfirm={() => onDelete(row?.id)}
                okText="Đồng ý"
                cancelText="Không"
              >
                <Button
                  type="text"
                  className="!bg-red-400 hover:!bg-red-500 !border-none"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];
};
