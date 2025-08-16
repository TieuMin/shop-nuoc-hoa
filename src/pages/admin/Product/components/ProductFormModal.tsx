import { Button, Form, Input, Modal, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { ModalAction, OptionSelect } from "../../../../store/common/interface";
import productApi from "../api/productApi";
import TextArea from "antd/es/input/TextArea";
import categoryApi from "../../Category/api/categoryApi";
import { filterSelectList } from "../../../../store/common/constants";
import { CategoryList } from "../../Category/stores/interface";
import trademarksApi from "../../Trademark/api/trademarkApi";
import { TrademarkList } from "../../Trademark/stores/interface";
import priceApi from "../../Price/api/priceApi";
import { PriceList } from "../../Price/stores/interface";

interface Prop {
  actionData: ModalAction;
  onClose: () => void;
  onSussces: () => void;
}

const ProductFormModal = ({ onClose, onSussces, actionData }: Prop) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCategory, setIsCategory] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<OptionSelect[]>([]);
  const [isTrademark, setIsTrademark] = useState<boolean>(false);
  const [trademarkList, setTrademarkList] = useState<OptionSelect[]>([]);
  const [isPrice, setIsPrice] = useState<boolean>(false);
  const [priceList, setPriceList] = useState<OptionSelect[]>([]);

  useEffect(() => {
    fetchCategory();
    fetchTrademark();
    fetchPrice();
  }, []);

  useEffect(() => {
    if (actionData?.data?.id) {
      const priceId = JSON.parse(actionData?.data?.priceId);
      form.setFieldsValue({ ...actionData?.data, priceId });
    } else form.resetFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  const fetchCategory = async () => {
    setIsCategory(true);
    try {
      const res = await categoryApi.list(filterSelectList);
      setIsCategory(false);
      if (res?.data) {
        const newLst = res.data?.map((x: CategoryList) => ({
          value: x?.id,
          label: x?.name,
        }));
        setCategoryList(newLst);
      } else setCategoryList([]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsCategory(false);
    }
  };

  const fetchTrademark = async () => {
    setIsTrademark(true);
    try {
      const res = await trademarksApi.list(filterSelectList);
      setIsTrademark(false);
      if (res?.data) {
        const newLst = res.data?.map((x: TrademarkList) => ({
          value: x?.id,
          label: x?.name,
        }));
        setTrademarkList(newLst);
      } else setTrademarkList([]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsTrademark(false);
    }
  };

  const fetchPrice = async () => {
    setIsPrice(true);
    try {
      const res = await priceApi.list(filterSelectList);
      setIsPrice(false);
      if (res?.data) {
        const newLst = res.data?.map((x: PriceList) => ({
          value: x?.id,
          label: `Tên: ${x?.name} - Giá: ${x?.price}`,
        }));
        setPriceList(newLst);
      } else setPriceList([]);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsPrice(false);
    }
  };

  const handleOk = async () => {
    setIsLoading(true);
    try {
      const dataForm = await form.validateFields();

      let res = null;
      if (actionData?.data?.id)
        res = await productApi.update({
          ...dataForm,
          id: actionData?.data?.id,
        });
      else res = await productApi.create(dataForm);
      setIsLoading(false);

      if (res?.success) {
        notification.success({
          message: "Lưu sản phẩm thành công!",
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
      loading={isLoading || isCategory || isTrademark || isPrice}
    >
      <Form layout="vertical" autoComplete="off" form={form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            className="col-span-1"
          >
            <Input placeholder="Nhập tên" className="h-10" />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
            className="col-span-1"
          >
            <Input placeholder="Nhập mã" className="h-10" type="number" />
          </Form.Item>
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
          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: "Vui lòng danh mục!" }]}
          >
            <Select
              className="h-10"
              options={categoryList}
              placeholder="Chọn danh mục"
            />
          </Form.Item>
          <Form.Item
            label="Thương hiệu"
            name="trademarkId"
            rules={[{ required: true, message: "Vui lòng thương hiệu!" }]}
          >
            <Select
              className="h-10"
              options={trademarkList}
              placeholder="Chọn thương hiệu"
            />
          </Form.Item>
          <Form.Item
            label="Bảng giá"
            name="priceId"
            rules={[{ required: true, message: "Vui lòng bảng giá!" }]}
          >
            <Select
              mode="multiple"
              className="h-10"
              options={priceList}
              placeholder="Chọn bảng giá"
            />
          </Form.Item>
        </div>
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
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
        >
          <TextArea placeholder="Nhập mã" />
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
            disabled={isLoading || isCategory || isTrademark || isPrice}
            className="w-20 !bg-white !text-black hover:!bg-white hover:!text-black"
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            htmlType="submit"
            disabled={isLoading || isCategory || isTrademark || isPrice}
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

export default ProductFormModal;
