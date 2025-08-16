import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Menu, X, ChevronDown } from "lucide-react";
import { destroyLogged, getAuth } from "../utils/jwt";
import routesAdmin from "../routes/routesAdmin";

const NavigationAdmin: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const user = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const onLogout = () => {
    destroyLogged();
    setIsDropdownOpen(false);
    navigate("/admin/login");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 left-0 right-0 z-50">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full"></div>
            <span className="text-xl  font-semibold text-gray-900">
              Rose Parfum
            </span>
          </div>

          {/* Desktop NavigationAdmin */}
          <div className="hidden xl:flex items-center space-x-8">
            {routesAdmin?.map((x, idx) => (
              <Link
                to={`/admin${x.path}`.replace(/\/+$/, "")}
                key={idx}
                className={`font-medium transition-colors ${
                  isActive(`/admin${x.path}`.replace(/\/+$/, ""))
                    ? "text-pink-600"
                    : "text-gray-700 hover:text-pink-600"
                }`}
              >
                {x.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User className="w-6 h-6" />
                <span className="hidden sm:block">{user?.fullName}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 border border-pink-200">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    onClick={onLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="xl:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile NavigationAdmin */}
        {isMenuOpen && (
          <div className="xl:hidden py-4 border-t border-pink-200">
            <div className="flex flex-col space-y-3">
              {routesAdmin?.map((x, idx) => (
                <Link
                  to={`/admin${x.path}`.replace(/\/+$/, "")}
                  key={idx}
                  className="text-gray-700 hover:text-pink-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {x.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationAdmin;
