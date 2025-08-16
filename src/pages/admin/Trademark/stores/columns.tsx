import { Button, Popconfirm, TableColumnsType, Tag, Tooltip } from "antd";
import { TrademarkList } from "./interface";
import { ModalAction } from "../../../../store/common/interface";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export const columnsTrademark = ({
  setActionData,
  onDelete,
}: {
  setActionData: (x: ModalAction) => void;
  onDelete: (x: number) => void;
}): TableColumnsType<TrademarkList> => {
  return [
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
      render: (_v, _r, i) => i + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      width: 180,
    },
    {
      title: "Mã",
      dataIndex: "code",
      width: 180,
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
            <Tooltip title="Sửa thương hiệu">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setActionData({ isShow: true, data: row })}
              />
            </Tooltip>
            <Tooltip title="Xóa thương hiệu">
              <Popconfirm
                title="Xóa thương hiệu"
                description="Bạn có chắc chắn muốn xóa thương hiệu này?"
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
