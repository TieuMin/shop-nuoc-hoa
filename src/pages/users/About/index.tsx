import React from "react";
import { Award, Heart, Leaf, Users } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl  font-bold text-gray-900 mb-6">
            Giới thiệu về Rose Perfume
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi đam mê sáng tạo và tuyển chọn những loại nước hoa hảo hạng
            nhất thế giới, mang đến cho bạn những mùi hương sang trọng, kể câu
            chuyện độc đáo của bạn và thể hiện phong cách riêng của bạn.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl  font-bold text-gray-900">
              Câu chuyện của chúng tôi
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Được thành lập vào năm 2020, Rose Perfume ra đời từ một niềm tin
              giản dị: hương thơm là một trong những hình thức thể hiện bản thân
              mạnh mẽ nhất. Những người sáng lập của chúng tôi, những người đam
              mê nước hoa, đã đặt mục tiêu mang hương thơm cao cấp đến gần hơn
              với tất cả mọi người.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi hợp tác trực tiếp với các bậc thầy nước hoa và các nhà
              sản xuất nước hoa nổi tiếng để mang đến cho bạn những loại nước
              hoa chính hãng, chất lượng cao với mức giá ưu đãi. Mỗi chai nước
              hoa trong bộ sưu tập của chúng tôi đều được tuyển chọn kỹ lưỡng
              bởi tay nghề thủ công tinh xảo, tính độc đáo và khả năng khơi gợi
              cảm xúc.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Luxury perfume collection"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl  font-bold text-gray-900 text-center mb-12">
            Giá trị của chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Chất lượng đầu tiên",
                description:
                  "Chúng tôi chỉ cung cấp nước hoa chính hãng, cao cấp từ các nhà cung cấp đáng tin cậy trên toàn thế giới.",
              },
              {
                icon: Heart,
                title: "Chăm sóc khách hàng",
                description:
                  "Sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi. Chúng tôi cung cấp dịch vụ và hỗ trợ đặc biệt.",
              },
              {
                icon: Leaf,
                title: "Tính bền vững",
                description:
                  "Chúng tôi cam kết sử dụng bao bì thân thiện với môi trường và hỗ trợ các hoạt động bền vững.",
              },
              {
                icon: Users,
                title: "Cộng đồng",
                description:
                  "Xây dựng một cộng đồng những người yêu thích nước hoa cùng chia sẻ niềm đam mê với những mùi hương xa xỉ.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center space-y-4 p-6 bg-white rounded-2xl shadow-md"
              >
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl  font-bold text-gray-900 mb-6">
            Gặp gỡ đội ngũ của chúng tôi
          </h2>
          <p className="text-gray-700 mb-12 max-w-2xl mx-auto">
            Đội ngũ chuyên gia về nước hoa và dịch vụ khách hàng tận tâm của
            chúng tôi luôn sẵn sàng giúp bạn tìm được mùi hương hoàn hảo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Laurent",
                role: "Người sáng lập & Người quản lý nước hoa",
                image:
                  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
              },
              {
                name: "Marcus Chen",
                role: "Giám đốc trải nghiệm khách hàng",
                image:
                  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
              },
              {
                name: "Isabella Rodriguez",
                role: "Trưởng phòng phát triển sản phẩm",
                image:
                  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300",
              },
            ].map((member, index) => (
              <div key={index} className="space-y-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 object-cover rounded-full mx-auto shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
