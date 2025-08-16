import { Button, Popconfirm, TableColumnsType, Tag, Tooltip } from "antd";
import { UserList } from "./interface";
import { ModalAction } from "../../../../store/common/interface";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export const columnsUsers = ({
  setActionData,
  onDelete,
}: {
  setActionData: (x: ModalAction) => void;
  onDelete: (x: number) => void;
}): TableColumnsType<UserList> => {
  return [
    {
      title: "STT",
      dataIndex: "stt",
      width: 80,
      render: (_v, _r, i) => i + 1,
    },
    {
      title: "Tài khoản",
      dataIndex: "userName",
      width: 180,
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      width: 180,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 250,
    },
    {
      title: "Quyền",
      dataIndex: "role",
      width: 100,
      render: (val) => (
        <Tag color={val == "Admin" ? "processing" : "default"}>{val}</Tag>
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
          case "Delete":
            return <Tag color="green">Đã hủy</Tag>;
          case "Baned":
            return <Tag color="green">Bị cấm</Tag>;
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
            <Tooltip title="Sửa tài khoản">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setActionData({ isShow: true, data: row })}
              />
            </Tooltip>
            <Tooltip title="Xóa tài khoản">
              <Popconfirm
                title="Xóa tài khoản"
                description="Bạn có chắc chắn muốn xóa tài khoản này?"
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
