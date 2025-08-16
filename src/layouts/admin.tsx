import { Layout } from "antd";
import PermissionAdminContent from "../middleware/PermissionAdminContent";
import { APP_CONFIG } from "../utils/env";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/jwt";
import NavigationAdmin from "../components/NavigationAdmin";

const DefaultAdminLayout = () => {
  const tokenAdmin = getAccessToken(APP_CONFIG.tokenAdminKey ?? "");
  const navigate = useNavigate();
  useEffect(() => {
    const redirectTo = "/admin/login";
    if (!tokenAdmin) navigate(redirectTo);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAdmin]);

  if (!tokenAdmin) return null;

  return (
    <Layout className="min-h-screen bg-pink-50 relative">
      <NavigationAdmin />
      <div className="min-h-[calc(100vh-64px)] py-2 px-3">
        <PermissionAdminContent />
      </div>
    </Layout>
  );
};

export default DefaultAdminLayout;
