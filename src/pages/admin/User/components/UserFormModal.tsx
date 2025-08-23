import { Button, Form, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { ModalAction } from "../../../../store/common/interface";
import { Lock, User } from "lucide-react";
import TextArea from "antd/es/input/TextArea";
import userApi from "../api/userApi";

interface Prop {
  actionData: ModalAction;
  onClose: () => void;
  onSussces: () => void;
}

const UserFormModal = ({ onClose, onSussces, actionData }: Prop) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (actionData?.data?.id) {
      form.setFieldsValue(actionData?.data);
    } else form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  const handleOk = async () => {
    setIsLoading(true);
    try {
      const dataForm = await form.validateFields();

      let res = null;
      if (actionData?.data?.id)
        res = await userApi.update({ ...dataForm, id: actionData?.data?.id });
      else res = await userApi.create(dataForm);
      setIsLoading(false);
      if (res?.success) {
        notification.success({
          message: "Lưu tài khoản thành công!",
        });
        onSussces();
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={actionData?.data?.id ? "Cập nhật" : "Tạo mới"}
      closable={{ "aria-label": "Custom Close Button" }}
      open={actionData.isShow}
      onCancel={onClose}
      footer={false}
      loading={isLoading}
    >
      <Form layout="vertical" autoComplete="off" form={form}>
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
        {!actionData?.data?.id ? (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              className="h-10"
              prefix={
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
              }
            />
          </Form.Item>
        ) : null}
        <Form.Item
          label="Họ và Tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
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
          <Input placeholder="Nhập họ và tên" className="h-10" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address">
          <TextArea placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Quyền"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
        >
          <Select
            className="h-10"
            options={[
              { value: "Admin", label: "Admin" },
              { value: "User", label: "User" },
            ]}
            placeholder="Chọn Quyền"
          />
        </Form.Item>
        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng trạng thái!" }]}
        >
          <Select
            className="h-10"
            options={[
              { value: "Active", label: "Hoạt Động" },
              { value: "Unactive", label: "Dừng hoạt động" },
              { value: "Delete", label: "Hủy tài khoản" },
              { value: "Baned", label: "Cấm tài khoản" },
            ]}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button
            disabled={isLoading}
            className="w-20 !bg-white !text-black hover:!bg-white hover:!text-black"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            disabled={isLoading}
            loading={isLoading}
            className="w-20"
            onClick={handleOk}
          >
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
