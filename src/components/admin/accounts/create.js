import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL_ADMIN;

const AdminCreate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    folder: 'Sale-bear-images/admin/products',
    thumbnail: null
  });

  const onFinish = async (values) => {
    setLoading(true);

    try {
      values.thumbnail = formData.thumbnail;
      console.log(values)
      values.folder = formData.folder;
      const response = await axios.post(`${API}/create`, values, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }) // axios tự động stringify body
      if (response.data.code === 201) {
        message.success("Tạo Admin thành công!");
        form.resetFields();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Đã xảy ra lỗi khi tạo Admin!");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, thumbnail: e.target.files[0] }); // Set file in formData
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tạo Admin mới</h2>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          label="Avatar"
          name="thumbnail"
          rules={[{ required: true, message: 'Vui lòng chọn file!' }]}
        >
          <input type="file" name="thumbnail" onChange={handleFileChange} required />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo Admin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminCreate;
