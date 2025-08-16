import { Gift, Shield, Truck } from "lucide-react";

const SpecialOffers = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 p-6 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Miễn phí vận chuyển
            </h3>
            <p className="text-gray-700">
              Giao hàng miễn phí cho đơn hàng trên 200.000đ
            </p>
          </div>
          <div className="text-center space-y-4 p-6 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Mua 2 tặng 1
            </h3>
            <p className="text-gray-700">
              Ưu đãi đặc biệt cho các loại nước hoa được chọn
            </p>
          </div>
          <div className="text-center space-y-4 p-6 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              100% chính hãng
            </h3>
            <p className="text-gray-700">Cam kết hàng chính hãng</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
