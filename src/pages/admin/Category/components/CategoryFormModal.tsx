import { Button, Form, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { ModalAction } from "../../../../store/common/interface";
import categoryApi from "../api/categoryApi";
import TextArea from "antd/es/input/TextArea";

interface Prop {
  actionData: ModalAction;
  onClose: () => void;
  onSussces: () => void;
}

const CategoryFormModal = ({ onClose, onSussces, actionData }: Prop) => {
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
        res = await categoryApi.update({
          ...dataForm,
          id: actionData?.data?.id,
        });
      else res = await categoryApi.create(dataForm);
      setIsLoading(false);

      if (res?.success) {
        notification.success({
          message: "Lưu thành công!",
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
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Nhập tên" className="h-10" />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <TextArea placeholder="Nhập mô tả" />
        </Form.Item>
        <Form.Item
          label="Link ảnh"
          name="image"
          rules={[
            { required: true, message: "Vui lòng nhập link ảnh sản phẩm!" },
          ]}
        >
          <Input placeholder="Nhập link ảnh sản phẩm" className="h-10" />
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
            ]}
            placeholder="Chọn trạng thái"
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button
            htmlType="submit"
            disabled={isLoading}
            className="w-20 !bg-white !text-black hover:!bg-white hover:!text-black"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            htmlType="submit"
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

export default CategoryFormModal;
