import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { Button, Form, Input } from "antd";
import authApi from "./api/authApi";
import { ActionType } from "../../../store/common/constants";

const LoginAdmin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const dataForm = await form.validateFields();
      const param = {
        action: ActionType.login,
        payload: {
          userName: dataForm?.userName ?? "",
          password: dataForm?.password ?? "",
          expectedRole: "Admin",
        },
      };
      const res = await authApi.login(param);
      setIsLoading(false);
      if (res) navigate("/admin");
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 pt-20 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl  font-bold text-gray-900">Xin Chào</h1>
            <p className="text-gray-700 mt-2">
              Đăng nhập vào tài khoản quản trị của bạn
            </p>
          </div>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            form={form}
          >
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
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu của bạn"
                prefix={
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
                }
              />
            </Form.Item>
            <Button
              htmlType="submit"
              disabled={isLoading}
              loading={isLoading}
              className="mt-3 w-full h-12"
            >
              Đăng nhập
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
