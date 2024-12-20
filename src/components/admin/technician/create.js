import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const CreateTechnician = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    folder: 'Sale-bear-images/admin/products',
    thumbnail: null
  });

  const onFinish = async (values) => {
    setLoading(true);
    try {
      values.thumbnail = formData.thumbnail;
      values.folder = formData.folder;

      console.log("Value: ", values)
      const response = await axios.post("http://localhost:8080/admin/technicians/create", values, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }) // axios tự động stringify body
        
      if (response.data.code === 201) {
        message.success("Kỹ thuật viên được tạo thành công!");
        form.resetFields(); // Reset form sau khi tạo thành công
      } else {
        message.error(response.data.message || "Thêm kỹ thuật viên thất bại.");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, thumbnail: e.target.files[0] }); // Set file in formData
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>Thêm mới kỹ thuật viên</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          full_name: "",
          email: "",
          phone_number: "",
          specialty: "",
        }}
      >
        <Form.Item
          name="full_name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên kỹ thuật viên" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email hợp lệ" },
            { type: "email", message: "Định dạng email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item name="specialty" label="Chuyên môn">
          <Input placeholder="Nhập chuyên môn (tùy chọn)" />
        </Form.Item>

        <Form.Item
          label="Ảnh"
          name="thumbnail"
          rules={[{ required: true, message: 'Vui lòng chọn file!' }]}
        >
          <input type="file" name="thumbnail" onChange={handleFileChange} required />
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

export default CreateTechnician;
