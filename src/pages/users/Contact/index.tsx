import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button, Form, Input, notification, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useParams } from "react-router-dom";
import { getAccessToken } from "../../../utils/jwt";
import { APP_CONFIG } from "../../../utils/env";
import questionApi from "../../admin/Question/api/questionApi";
import { LoadingLayout } from "../../../components/LoadingLayout";
import { questionTypeOption } from "../../../store/common/constants";

const Contact: React.FC = () => {
  const [form] = Form.useForm();
  const { orderCode } = useParams<{ orderCode: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [questionType, setQuestionType] = useState<string>("");
  const profile: any = getAccessToken(APP_CONFIG.profileKey ?? "", true);

  useEffect(() => {
    if (orderCode) {
      const type = orderCode.split("_")?.[0] ?? undefined;
      const code = orderCode.split("_")?.[1] ?? "";
      form.setFieldValue("orderCode", code);
      if (type) {
        form.setFieldValue("questionType", type);
        setQuestionType(type);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formData = await form.validateFields();
      const payload = {
        ...formData,
        userId: profile?.id || undefined,
      };
      const res = await questionApi.create(payload);
      setIsLoading(false);
      if (res?.success) {
        notification.success({
          message:
            "Cảm ơn bạn đã nhắn tin! Chúng tôi sẽ phản hồi qua email của bạn trong vòng 24 giờ.",
          duration: 15,
        });
        form.resetFields();
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-20">
      <LoadingLayout isLoading={isLoading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl  font-bold text-gray-900 mb-6">Liên hệ</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Bạn có thắc mắc về nước hoa của chúng tôi hoặc cần hỗ trợ cho đơn
            hàng của mình? Chúng tôi luôn sẵn sàng giúp bạn tìm được mùi hương
            hoàn hảo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl  font-semibold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="w-6 h-6 mr-2" />
              Gửi tin nhắn cho chúng tôi
            </h2>

            <Form layout="vertical" autoComplete="off" form={form}>
              <Form.Item
                label="Họ tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ tên" className="h-10" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  {
                    type: "email",
                    message: "Địa chỉ email không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập email" className="h-10" />
              </Form.Item>
              <Form.Item
                label="Loại câu hỏi"
                name="questionType"
                rules={[
                  { required: true, message: "Vui lòng chọn loại câu hỏi!" },
                ]}
              >
                <Select
                  className="h-10"
                  options={questionTypeOption}
                  placeholder="Chọn loại câu hỏi"
                  onChange={setQuestionType}
                />
              </Form.Item>
              {["shipping", "refund", "payment-support"].includes(
                questionType
              ) && (
                <Form.Item
                  label="Mã đơn hàng"
                  name="orderCode"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã đơn hàng!" },
                  ]}
                >
                  <Input placeholder="Nhập mã đơn hàng" className="h-10" />
                </Form.Item>
              )}
              <Form.Item
                label="Nội dung"
                name="description"
                rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
              >
                <TextArea placeholder="Nhập nội dung" />
              </Form.Item>
            </Form>
            <Button
              disabled={isLoading}
              loading={isLoading}
              icon={<Send className="w-5 h-5" />}
              className="mt-3 w-full h-12"
              onClick={handleSubmit}
            >
              Gửi tin nhắn
            </Button>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl  font-semibold text-gray-900 mb-6">
                Thông tin liên hệ
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Số điện thoại
                    </h3>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-600">
                      Thứ Hai-Thứ Sáu: 9 giờ sáng - 6 giờ chiều
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-700">hello@gmail.com</p>
                    <p className="text-sm text-gray-600">
                      Chúng tôi trả lời trong vòng 24 giờ
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Địa chỉ</h3>
                    <p className="text-gray-700">
                      123 Luxury Lane
                      <br />
                      Fragrance District
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-500 p-8 rounded-2xl text-white">
              <h3 className="text-2xl  font-semibold mb-4">
                Cần trợ giúp lựa chọn?
              </h3>
              <p className="mb-6">
                Các chuyên gia về nước hoa của chúng tôi luôn sẵn sàng giúp bạn
                tìm ra mùi hương hoàn hảo. Hãy đặt lịch tư vấn cá nhân ngay hôm
                nay!
              </p>
              <button
                className="bg-white text-pink-500 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors"
                onClick={() => {
                  form.setFieldValue("orderCode", "");
                  form.setFieldValue("questionType", "other");
                  setQuestionType("other");
                }}
              >
                Tư vấn ngay
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Thời gian vận chuyển mất bao lâu?
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Giao hàng tiêu chuẩn: 3-5 ngày làm việc. Giao hàng nhanh:
                    1-2 ngày làm việc.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Chính sách hoàn trả của bạn là gì?
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Trả hàng trong vòng 30 ngày đối với sản phẩm chưa mở và còn
                    bao bì gốc.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Nước hoa của bạn có phải là hàng chính hãng không?
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Vâng, tất cả nước hoa của chúng tôi đều chính hãng 100% và
                    được đảm bảo chính hãng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
