import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL_ADMIN;

const AdminEdit = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Chuyển hướng sau khi chỉnh sửa
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    fetchAdminDetail(id);
  }, [id]);

  const fetchAdminDetail = async (adminId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/get-by-id/${adminId}`);
      if (response.data.code === 200) {
        setAdmin(response.data.data);
        form.setFieldsValue(response.data.data); // Thiết lập giá trị của biểu mẫu
      } else {
        message.error("Không thể lấy thông tin Admin.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi lấy dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);
    formData.append("full_name", values.full_name);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    try {
      const response = await axios.put(`${API}/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.code === 200) {
        message.success("Chỉnh sửa Admin thành công!");
        navigate("/admin"); // Chuyển hướng sau khi chỉnh sửa thành công
      } else {
        message.error(response.data.message || "Không thể chỉnh sửa Admin.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi chỉnh sửa Admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!admin) {
    return <p>Không tìm thấy Admin</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Chỉnh sửa Admin</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={admin}
        layout="vertical"
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Ảnh đại diện">
          <input type="file" onChange={handleFileChange} />
          {admin.thumbnail && !thumbnailFile && (
            <div>
              <p>Ảnh hiện tại:</p>
              <img
                src={admin.thumbnail}
                alt="Current Thumbnail"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminEdit;
