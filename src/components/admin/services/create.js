import React, { useState } from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import axios from "axios";

const CreateService = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/admin/services/create", values);
      if (response.data.code === 201) {
        message.success("Dịch vụ được tạo thành công!");
      } else {
        message.error(response.data.message || "Thêm dịch vụ thất bại.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>Thêm mới dịch vụ</h2>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          name: "",
          description: "",
          price: 0,
        }}
      >
        <Form.Item
          name="name"
          label="Tên dịch vụ"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: false }]}
        >
          <Input.TextArea placeholder="Nhập mô tả (tùy chọn)" rows={4} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá dịch vụ"
          rules={[
            { required: true, message: "Vui lòng nhập giá dịch vụ" },
            { type: "number", min: 0, message: "Giá phải là số dương" },
          ]}
        >
          <InputNumber
            placeholder="Nhập giá dịch vụ"
            style={{ width: "100%" }}
            step={0.01}
            min={0}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateService;
