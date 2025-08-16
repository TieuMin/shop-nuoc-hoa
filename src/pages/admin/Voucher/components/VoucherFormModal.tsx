import { Button, Form, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { ModalAction } from "../../../../store/common/interface";
import voucherApi from "../api/voucherApi";

interface Prop {
  actionData: ModalAction;
  onClose: () => void;
  onSussces: () => void;
}

const VoucherFormModal = ({ onClose, onSussces, actionData }: Prop) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [priceType, setPriceType] = useState<string>("");

  useEffect(() => {
    if (actionData?.data?.id) {
      form.setFieldsValue(actionData?.data);
      setPriceType(actionData?.data?.priceType ?? "");
    } else form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  const handleOk = async () => {
    setIsLoading(true);
    try {
      const dataForm = await form.validateFields();

      let res = null;
      if (actionData?.data?.id)
        res = await voucherApi.update({
          ...dataForm,
          discount: dataForm?.discount ?? 0,
          maxPrice: dataForm?.maxPrice ?? 0,
          price: dataForm?.price ?? 0,
          id: actionData?.data?.id,
        });
      else res = await voucherApi.create(dataForm);
      setIsLoading(false);

      if (res?.success) {
        notification.success({
          message: "Lưu mã giảm giá thành công!",
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
          label="Mã"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
        >
          <Input placeholder="Nhập mã" className="h-10" />
        </Form.Item>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Nhập tên" className="h-10" />
        </Form.Item>
        <Form.Item
          label="Loại mã"
          name="priceType"
          rules={[{ required: true, message: "Vui lòng chọn loại mã!" }]}
        >
          <Select
            className="h-10"
            options={[
              { value: "Percent", label: "Chiết khấu %" },
              { value: "Money", label: "Chiết khấu trực tiếp" },
            ]}
            placeholder="Chọn loại mã"
            onChange={setPriceType}
          />
        </Form.Item>

        {priceType === "Percent" && (
          <Form.Item
            label="Giảm giá %"
            name="discount"
            rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
            className="col-span-1"
          >
            <Input
              placeholder="Nhập giảm giá: 0 => 100"
              className="h-10"
              type="number"
              min={0}
              max={100}
            />
          </Form.Item>
        )}
        {priceType === "Percent" && (
          <Form.Item label="Chiết khấu tối đa" name="maxPrice">
            <Input
              placeholder="Nhập mức chiết khấu tối đa"
              className="h-10"
              type="number"
            />
          </Form.Item>
        )}
        {priceType === "Money" && (
          <Form.Item
            label="Chiết khấu trực tiếp"
            name="price"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập chiết khấu trực tiếp!",
              },
            ]}
          >
            <Input
              placeholder="Nhập mức chiết khấu trực tiếp"
              className="h-10"
              type="number"
            />
          </Form.Item>
        )}

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
        >
          <Input placeholder="Nhập mã" className="h-10" type="number" />
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

export default VoucherFormModal;
