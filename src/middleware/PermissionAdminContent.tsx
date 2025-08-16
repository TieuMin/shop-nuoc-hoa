import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import { RouteProps } from "../store/common/interface";
import routesAdmin from "../routes/routesAdmin";

const PermissionAdminContent = () => {
  return (
    <Routes>
      {routesAdmin.map((route: RouteProps, idx: number) => {
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

export default PermissionAdminContent;
