import { Layout } from "antd";
import PermissionContent from "../middleware/PermissionContent";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

const DefaultLayout = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout className="min-h-screen bg-pink-50 relative">
          <Navigation />
          <PermissionContent />
          <Footer />
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
};

export default DefaultLayout;
