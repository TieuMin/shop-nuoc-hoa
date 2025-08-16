import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useAppSelector } from "../hooks/hookStore";

const Footer: React.FC = () => {
  const categories: any = useAppSelector((state) => state.common.categories);

  return (
    <footer className="bg-pink-50 border-t border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full"></div>
              <span className="text-xl  font-semibold text-gray-900">
                Rose Parfum
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Khám phá nghệ thuật nước hoa xa xỉ. Chúng tôi tuyển chọn những
              loại nước hoa hảo hạng nhất từ khắp nơi trên thế giới để mang đến
              cho bạn những mùi hương đặc biệt, kể câu chuyện độc đáo của riêng
              bạn.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Liên kết nhanh
            </h3>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-gray-700 hover:text-pink-600 transition-colors"
              >
                Trang chủ
              </Link>
              {categories?.map((x: any) => (
                <Link
                  to={`/categories/${x?.id}`}
                  className="block text-gray-700 hover:text-pink-600 transition-colors"
                >
                  {x?.name}
                </Link>
              ))}
              <Link
                to="/about"
                className="block text-gray-700 hover:text-pink-600 transition-colors"
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-pink-600 transition-colors"
              >
                Liên hệ
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Liên hệ với chúng tôi
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-pink-500" />
                <span className="text-gray-700">hello@roseparfum.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-pink-500 mt-0.5" />
                <span className="text-gray-700">
                  123 Luxury Lane
                  <br />
                  Fragrance District
                  <br />
                  New York, NY 10001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-pink-200">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © 2025 Rose Parfum. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-600"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
