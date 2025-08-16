import { Rate, TableColumnsType, Tag } from "antd";
import { CommentList } from "./interface";
import moment from "moment";

export const columnsComment = (): TableColumnsType<CommentList> => {
  return [
    {
      title: "STT",
      dataIndex: "stt",
      width: 50,
      render: (_v, _r, i) => i + 1,
    },
    {
      title: "Tên Sản phẩm",
      dataIndex: "products",
      width: 150,
      render: (products) =>
        products?.map((x: any, idx: number) => (
          <div key={x?.id}>
            {idx}. {x?.name}
          </div>
        )),
    },
    {
      title: "Người bình luận",
      dataIndex: "userName",
      width: 150,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      width: 250,
    },
    {
      title: "Đánh giá",
      dataIndex: "rate",
      width: 100,
      render: (val) => <Rate allowHalf defaultValue={val ?? 5} disabled />,
    },
    {
      title: "Thời gian",
      dataIndex: "createDate",
      width: 100,
      render: (val) =>
        val ? moment(new Date(val)).format("DD/MM/YYYY HH:mm:ss") : val,
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
  ];
};
