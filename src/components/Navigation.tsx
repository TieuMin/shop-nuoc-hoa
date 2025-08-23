import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { destroyLogged, getAccessToken } from "../utils/jwt";
import { APP_CONFIG } from "../utils/env";
import { FilterDefaultModel, OptionSelect } from "../store/common/interface";
import { filterDefault, filterSelectList } from "../store/common/constants";
import cartApi from "../pages/users/Cart/api/cartApi";
import { CategoryList } from "../pages/admin/Category/stores/interface";
import categoryApi from "../pages/admin/Category/api/categoryApi";
import { Skeleton } from "antd";
import { useAppDispatch, useAppSelector } from "../hooks/hookStore";
import {
  changeCarts,
  changeCategories,
  changeTotalCart,
  changeTrademarks,
  changeVouchers,
} from "../store/common/commonSlice";
import { LoadingLayout } from "./LoadingLayout";
import trademarksApi from "../pages/admin/Trademark/api/trademarkApi";
import voucherApi from "../pages/admin/Voucher/api/voucherApi";
import { VoucherList } from "../pages/admin/Voucher/stores/interface";

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const profile: any = getAccessToken(APP_CONFIG.profileKey ?? "", true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCategory, setIsCategory] = useState<boolean>(false);

  const location = useLocation();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const totalCart = useAppSelector((state) => state.common.totalCart);

  const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [isTrademark, setIsTrademark] = useState<boolean>(false);
  const [isVoucher, setIsVoucher] = useState<boolean>(false);
  const [isCart, setIsCart] = useState<boolean>(false);

  const [paramFilter, setParamFilter] = useState<FilterDefaultModel>({
    ...filterDefault,
  });

  useEffect(() => {
    fetchCategory();
    fetchTrademark();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile?.id) {
      setParamFilter({
        ...filterDefault,
        payload: {
          ...filterDefault.payload,
          userId: profile?.id,
          pageSize: 9999,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile && paramFilter?.payload?.userId) {
      fetchTotalCart();
      fetchVoucherList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFilter]);

  const fetchTotalCart = async () => {
    setIsCart(true);
    const res = await cartApi.list(paramFilter);
    setIsCart(false);
    dispatch(changeTotalCart(res?.totalCart ?? 0));
    if (res?.data?.length) dispatch(changeCarts(res?.data));
  };

  const fetchVoucherList = async () => {
    setIsVoucher(true);
    const res = await voucherApi.listUser(profile?.id ?? 0);
    setIsVoucher(false);
    if (res?.data?.length) {
      const newData: OptionSelect[] = res?.data?.map((x: VoucherList) => ({
        ...x,
        value: x.id,
        label: x.name,
      }));
      dispatch(changeVouchers(newData));
    } else dispatch(changeVouchers([]));
  };

  const fetchCategory = async () => {
    setIsCategory(true);
    const res = await categoryApi.list(filterSelectList);
    setIsCategory(false);
    if (res?.data) {
      setCategoryList(res.data);
      dispatch(changeCategories(res.data));
    } else setCategoryList([]);
  };

  const fetchTrademark = async () => {
    setIsTrademark(true);
    const res = await trademarksApi.list(filterSelectList);
    setIsTrademark(false);
    if (res?.data?.length) dispatch(changeTrademarks(res?.data));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current?.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const isActiveCategory = (path: string, isMenu?: boolean) => {
    const pathname = location.pathname.split("/")?.[1] ?? "";

    if (isMenu && pathname === "categories") return true;
    if (!isMenu && path === location.pathname) return true;
    return false;
  };

  const onLogout = () => {
    destroyLogged();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <LoadingLayout
        isLoading={isCategory || isTrademark || isVoucher || isCart}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full"></div>
            <span className="text-xl  font-semibold text-gray-900">
              Rose Perfume
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive("/")
                  ? "text-pink-600"
                  : "text-gray-700 hover:text-pink-600"
              }`}
            >
              Trang chủ
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                className={`flex items-center space-x-1 ${
                  isActiveCategory("", true) ? "text-pink-600" : "text-gray-700"
                }  hover:text-pink-600 font-medium transition-colors`}
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
              >
                <span>Danh mục</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 border border-pink-200">
                  {categoryList?.length ? (
                    <>
                      {categoryList.map((x) => (
                        <Link
                          key={x.id}
                          to={`/categories/${x?.id}`}
                          className={`block px-4 py-2 ${
                            isActiveCategory(`/categories/${x?.id}`)
                              ? "bg-pink-50 text-pink-600"
                              : "text-gray-700"
                          } hover:bg-pink-50 hover:text-pink-600 transition-colors`}
                        >
                          {x?.name}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <>
                      {[...Array(3)].map((_x, idx) => (
                        <Skeleton.Input
                          key={idx}
                          active={true}
                          className="!w-44 ml-1 mb-0.5"
                          size="small"
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`font-medium transition-colors ${
                isActive("/about")
                  ? "text-pink-600"
                  : "text-gray-700 hover:text-pink-600"
              }`}
            >
              Về chúng tôi
            </Link>
            <Link
              to="/contact"
              className={`font-medium transition-colors ${
                isActive("/contact")
                  ? "text-pink-600"
                  : "text-gray-700 hover:text-pink-600"
              }`}
            >
              Liên hệ
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalCart > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCart}
                </span>
              )}
            </Link>

            {profile ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <User className="w-6 h-6" />
                  <span className="hidden sm:block">
                    Hello, {profile?.fullName}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 border border-pink-200">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Lịch sử đặt hàng
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={onLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="hidden sm:block">Đăng nhập</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700"
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-pink-200">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-pink-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              {categoryList?.length ? (
                <>
                  {categoryList.map((x) => (
                    <Link
                      to={`/categories/${x?.id}`}
                      className="text-gray-700 hover:text-pink-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {x?.name}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {[...Array(3)].map((_x, idx) => (
                    <Skeleton.Input
                      key={idx}
                      active={true}
                      className="!w-44 ml-1 mb-0.5"
                      size="small"
                    />
                  ))}
                </>
              )}
              <Link
                to="/about"
                className="text-gray-700 hover:text-pink-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-pink-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
