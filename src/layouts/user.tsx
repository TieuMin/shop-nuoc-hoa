import { Layout } from "antd";
import PermissionContent from "../middleware/PermissionContent";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

const DefaultLayout = () => {
  return (
    <Layout className="min-h-screen bg-pink-50 relative">
      <Navigation />
      <PermissionContent />
      <Footer />
    </Layout>
  );
};

export default DefaultLayout;
