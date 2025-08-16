import { Button, Popconfirm, TableColumnsType, Tag, Tooltip } from "antd";
import { OrderList } from "./interface";
import { CheckCircleOutlined } from "@ant-design/icons";
import { formatNumber } from "../../../../utils/helpers";
import { OrderStatus } from "../../../../store/common/constants";
import { ObjAny } from "../../../../store/common/interface";
import moment from "moment";

export const getOrderStatus = (status: string) => {
  switch (status) {
    case OrderStatus.Paid:
      return <Tag color="green">Đã thanh toán</Tag>;
    case OrderStatus.PendingShipping:
      return <Tag color="yellow">Chờ giao hàng</Tag>;
    case OrderStatus.Shipping:
      return <Tag color="blue">Đang giao hàng</Tag>;
    case OrderStatus.Delivered:
      return <Tag color="green">Đã giao hàng</Tag>;
    case OrderStatus.Refund:
      return <Tag color="green">Hoàn trả</Tag>;
    case OrderStatus.Cancel:
      return <Tag color="green">Hủy đơn hàng</Tag>;
    default:
      return <Tag color="default">Chưa thanh toán</Tag>;
  }
};

export const columnsUsers = ({
  onChangeStatus,
}: {
  onChangeStatus: (row: OrderList) => void;
}): TableColumnsType<OrderList> => {
  return [
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
      render: (_v, _r, i) => i + 1,
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      width: 350,
      render: (products: ObjAny[]) => {
        const getPrice = (price: number, discount?: number) => {
          if (discount && discount > 0) return price * (1 - discount / 100);
          return price;
        };
        return (
          <div className="space-y-4 mb-6">
            {products?.map((item) => (
              <div
                key={`${item.product.id}-${item.id}`}
                className="flex items-center space-x-3"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.product.name} ({item?.priceName})
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatNumber(getPrice(item.price, item.product.discount))}đ
                    x {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-pink-600">
                  {formatNumber(
                    getPrice(item.price, item.product.discount) * item.quantity
                  )}
                  đ
                </p>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Mã giảm giá",
      dataIndex: "discount",
      width: 200,
      render: (val, row) => (
        <div>
          <div>Mã: {row?.voucher?.code}</div>
          <div>Giảm: {formatNumber(val)}đ</div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      width: 120,
      render: (val) => `${formatNumber(val ?? 0)}đ`,
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      width: 150,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 200,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      width: 150,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentType",
      width: 180,
      render: (val) => {
        switch (val) {
          case "QR":
            return "Chuyển khoản";
          default:
            return "Ship COD";
        }
      },
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createDate",
      width: 180,
      render: (val) => (val ? moment(val).format("DD/MM/YYYY HH:mm:ss") : ""),
    },
    {
      title: "Ngày giao hàng",
      dataIndex: "shippingDate",
      width: 180,
      render: (val) => (val ? moment(val).format("DD/MM/YYYY HH:mm:ss") : ""),
    },
    {
      title: "Ngày nhận hàng",
      dataIndex: "paymentDate",
      width: 180,
      render: (val) => (val ? moment(val).format("DD/MM/YYYY HH:mm:ss") : ""),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paidDate",
      width: 180,
      render: (val) => (val ? moment(val).format("DD/MM/YYYY HH:mm:ss") : ""),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      render: (val) => getOrderStatus(val),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      width: 80,
      fixed: "right",
      render: (_v, row) => {
        const blackList = [
          OrderStatus.Cancel,
          OrderStatus.Refund,
          OrderStatus.Shipping,
          OrderStatus.Delivered,
        ];
        if (blackList.includes(row?.status as OrderStatus)) return;
        let title = "";
        if (row?.status === OrderStatus.NotPaid)
          title = "Xác nhận đã thanh toán";
        if (row?.status === OrderStatus.Paid) title = "Xác nhận chờ giao hàng";
        if (row?.status === OrderStatus.PendingShipping)
          title = "Xác nhận đang vận chuyển";

        return (
          <div className="flex gap-2 justify-center">
            <Tooltip title={title}>
              <Popconfirm
                title={title}
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
