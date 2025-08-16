import { Button, Form, Modal, notification, Rate } from "antd";
import { useEffect, useState } from "react";
import { ModalAction } from "../../../../store/common/interface";
import TextArea from "antd/es/input/TextArea";
import commentApi from "../../../admin/Comment/api/commentApi";
import { getAccessToken } from "../../../../utils/jwt";
import { APP_CONFIG } from "../../../../utils/env";

interface Prop {
  actionData: ModalAction;
  onClose: () => void;
  onSussces: () => void;
}

const CategoryFormModal = ({ onClose, onSussces, actionData }: Prop) => {
  const [form] = Form.useForm();
  const token = getAccessToken(APP_CONFIG.tokenKey);
  const profile: any = getAccessToken(APP_CONFIG.profileKey ?? "", true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!actionData?.isShow) form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  const handleOk = async () => {
    setIsLoading(true);
    try {
      const dataForm = await form.validateFields();
      const ids: number[] = [];
      actionData?.data?.products?.map(
        (x: any) => !ids.includes(x.productId) && ids.push(x.productId)
      );
      const payload = {
        ...dataForm,
        rate: dataForm?.rate ?? 5,
        productId: ids,
        userId: profile?.id ?? 0,
        orderId: actionData?.data?.id ?? 0,
      };
      const res = await commentApi.create(payload, token);
      setIsLoading(false);

      if (res?.success) {
        notification.success({
          message: "Đánh giá sản phẩm thành công.",
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
        <Form.Item label="Đánh giá" name="rate">
          <Rate allowHalf defaultValue={5} />
        </Form.Item>
        <Form.Item
          label="Đánh giá"
          name="comment"
          rules={[{ required: true, message: "Vui lòng nhập đánh giá!" }]}
        >
          <TextArea placeholder="Nhập đánh giá" />
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
