import React from "react";
const Home = React.lazy(() => import("../pages/users/Home"));
const Categories = React.lazy(() => import("../pages/users/Categories"));
const ProductDetail = React.lazy(() => import("../pages/users/productDetail"));
const Cart = React.lazy(() => import("../pages/users/Cart"));
const Checkout = React.lazy(() => import("../pages/users/Checkout"));
const Orders = React.lazy(() => import("../pages/users/Orders"));
const About = React.lazy(() => import("../pages/users/About"));
const Contact = React.lazy(() => import("../pages/users/Contact"));

const routes = [
  { path: "/", exact: true, name: "Trang chủ", component: Home },
  {
    path: "/categories/:categoryId",
    exact: true,
    name: "Danh mục",
    component: Categories,
  },
  {
    path: "/product/:id",
    exact: true,
    name: "Chi tiết sản phẩm",
    component: ProductDetail,
  },
  { path: "/cart", exact: true, name: "Giỏ hàng", component: Cart },
  { path: "/checkout", exact: true, name: "Thanh toán", component: Checkout },
  { path: "/orders", exact: true, name: "Đặt hàng", component: Orders },
  { path: "/about", exact: true, name: "Về chúng tôi", component: About },
  {
    path: "/contact",
    exact: true,
    name: "Liên hệ",
    component: Contact,
  },
  {
    path: "/contact/:orderCode",
    exact: true,
    name: "Liên hệ",
    component: Contact,
  },
];

export default routes;
