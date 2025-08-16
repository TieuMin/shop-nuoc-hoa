import React from "react";
const User = React.lazy(() => import("../pages/admin/User"));
const Category = React.lazy(() => import("../pages/admin/Category"));
const Price = React.lazy(() => import("../pages/admin/Price"));
const Trademark = React.lazy(() => import("../pages/admin/Trademark"));
const Voucher = React.lazy(() => import("../pages/admin/Voucher"));
const Product = React.lazy(() => import("../pages/admin/Product"));
const Comment = React.lazy(() => import("../pages/admin/Comment"));
const Order = React.lazy(() => import("../pages/admin/Order"));
const Question = React.lazy(() => import("../pages/admin/Question"));

const routesAdmin = [
  { path: "/", exact: true, name: "Người dùng", component: User },
  {
    path: "/category",
    exact: true,
    name: "Danh mục",
    component: Category,
  },
  {
    path: "/price",
    exact: true,
    name: "Bảng giá",
    component: Price,
  },
  {
    path: "/trademark",
    exact: true,
    name: "Thương hiệu",
    component: Trademark,
  },
  {
    path: "/voucher",
    exact: true,
    name: "Mã giảm giá",
    component: Voucher,
  },
  {
    path: "/product",
    exact: true,
    name: "Sản phẩm",
    component: Product,
  },
  {
    path: "/comment",
    exact: true,
    name: "Đánh giá",
    component: Comment,
  },
  {
    path: "/order",
    exact: true,
    name: "Đơn hàng",
    component: Order,
  },
  {
    path: "/question",
    exact: true,
    name: "Chăm sóc khách hàng",
    component: Question,
  },
];

export default routesAdmin;
