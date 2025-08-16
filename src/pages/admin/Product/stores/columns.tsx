import {
  Button,
  Image,
  Popconfirm,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { ProductList } from "./interface";
import { ModalAction, ObjAny } from "../../../../store/common/interface";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatNumber } from "../../../../utils/helpers";

export const columnsProduct = ({
  setActionData,
  onDelete,
}: {
  setActionData: (x: ModalAction) => void;
  onDelete: (x: number) => void;
}): TableColumnsType<ProductList> => {
  return [
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
      render: (_v, _r, i) => i + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 150,
      render: (val) => (val ? <Image src={val} width={80} height={50} /> : ""),
    },
    {
      title: "Tên",
      dataIndex: "name",
      width: 180,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 250,
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      width: 180,
    },
    {
      title: "Thương hiệu",
      dataIndex: "trademarkName",
      width: 100,
    },
    {
      title: "Bảng giá",
      dataIndex: "prices",
      width: 250,
      render: (val) => {
        return (
          <div className="flex flex-col gap-2">
            {val?.map((x: ObjAny) => (
              <div className="flex gap-2 justify-between bg-pink-200 rounded-sm px-2">
                <div className="flex-1 border-r">Tên: {x?.name}</div>
                <div className="flex-1">
                  Giá: {x?.price ? formatNumber(x?.price) : x?.price}
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: 180,
      render: (val) => (val ? formatNumber(val) : val),
    },
    {
      title: "Giảm giá %",
      dataIndex: "discount",
      width: 120,
      render: (val) => `${val}%`,
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
            <Tooltip title="Sửa sản phẩm">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => setActionData({ isShow: true, data: row })}
              />
            </Tooltip>
            <Tooltip title="Xóa sản phẩm">
              <Popconfirm
                title="Xóa sản phẩm"
                description="Bạn có chắc chắn muốn xóa sản phẩm này?"
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
