import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { Button, Form, Input, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import authUserApi from "./api/authUserApi";
import userApi from "../../admin/User/api/userApi";
import { ActionType } from "../../../store/common/constants";
import { LoadingLayout } from "../../../components/LoadingLayout";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/";

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const dataForm = await form.validateFields();
      if (isLogin) {
        const res = await authUserApi.login(dataForm);
        setIsLoading(false);
        if (res) navigate(redirectTo);
      } else {
        const res = await userApi.create({
          action: ActionType.createUser,
          payload: dataForm,
        });
        setIsLoading(false);
        if (res?.success) {
          notification.success({
            message: "Tạo tài khoản thành công!",
          });
        }
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-20 flex items-center justify-center py-12">
      <LoadingLayout isLoading={isLoading} />
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl  font-bold text-gray-900">
              {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản"}
            </h1>
            <p className="text-gray-700 mt-2">
              {isLogin
                ? "Đăng nhập vào tài khoản của bạn"
                : "Tham gia cộng đồng nước hoa cao cấp của chúng tôi"}
            </p>
          </div>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            form={form}
          >
            {isLogin ? (
              <>
                <Form.Item
                  label="Tài khoản"
                  name="userName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tài khoản!" },
                    { type: "email", message: "Tài khoản không hợp lệ!" },
                  ]}
                >
                  <Input
                    placeholder="Nhập tài khoản của bạn"
                    prefix={
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu của bạn"
                    prefix={
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                    }
                  />
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  label="Tài khoản"
                  name="userName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tài khoản!" },
                    {
                      type: "email",
                      message:
                        "Tài khoản không hợp lệ. Tài khoản phải là địa chỉ email!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tài khoản"
                    className="h-10"
                    prefix={
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu"
                    className="h-10"
                    prefix={
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Họ và Tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" className="h-10" />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số điện thoại!",
                    },
                    {
                      message: "Vui lòng chỉ nhập số!",
                      pattern: new RegExp(/^[0-9]*$/),
                    },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.reject();
                        if (value.length > 10) {
                          return Promise.reject(
                            "Số điện thoại không vượt quá 10 ký tự"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" className="h-10" />
                </Form.Item>
                <Form.Item label="Địa chỉ" name="address">
                  <TextArea placeholder="Nhập địa chỉ" />
                </Form.Item>
              </>
            )}
          </Form>

          <Button
            disabled={isLoading}
            loading={isLoading}
            className="mt-3 w-full h-12"
            onClick={handleSubmit}
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-gray-700">
              {isLogin ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                }}
                className="text-pink-500 hover:text-pink-700 font-medium ml-1 underline"
              >
                {isLogin ? "Đăng ký" : "Đăng nhập"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
