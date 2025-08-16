import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import { RouteProps } from "../store/common/interface";
import routes from "../routes/routes";

const PermissionContent = () => {
  return (
    <Routes>
      {routes.map((route: RouteProps, idx: number) => {
        return (
          route.component && (
            <Route
              key={idx}
              path={route.path}
              element={
                <Suspense fallback={<Spin />}>
                  <route.component />
                </Suspense>
              }
            />
          )
        );
      })}
    </Routes>
  );
};

export default PermissionContent;
