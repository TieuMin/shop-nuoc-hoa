import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 via-purple-100 to-cream-100">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/1190829/pexels-photo-1190829.jpeg)",
        }}
      ></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Khám phá
          <span className="text-amber-300"> Mùi hương đặc trưng </span>
          của bạn
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Hương thơm sang trọng được chế tác để lưu giữ bản sắc độc đáo của bạn
          và tạo nên những kỷ niệm khó quên
        </p>
        <Link
          to="/categories/women"
          className="inline-flex items-center bg-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-pink-600 transition-all shadow-lg hover:text-white "
        >
          Mua ngay
          <ChevronRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default Banner;
