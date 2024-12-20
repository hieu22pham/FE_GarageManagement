import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TechnicianEdit = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Dùng để chuyển hướng sau khi lưu
  const [loading, setLoading] = useState(true);
  const [technician, setTechnician] = useState(null);
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    fetchTechnicianDetail(id);
  }, [id]);

  const fetchTechnicianDetail = async (technicianId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/admin/technicians/get-by-id/${technicianId}`
      );
      if (response.data.code === 200) {
        setTechnician(response.data.data);
        form.setFieldsValue(response.data.data); // Thiết lập giá trị của biểu mẫu
      } else {
        message.error("Unable to fetch technician details.");
      }
    } catch (error) {
      message.error("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("full_name", values.full_name);
    formData.append("email", values.email);
    formData.append("phone_number", values.phone_number);
    formData.append("specialty", values.specialty);

    // Nếu có tệp mới được chọn, thêm tệp đó vào FormData
    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    console.log("formData", formData)

    try {
      const response = await axios.put(
        `http://localhost:8080/admin/technicians/edit/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.code === 200) {
        message.success("Technician updated successfully!");
        navigate("/admin/technicians"); // Chuyển hướng sau khi lưu thành công
      } else {
        message.error("Failed to update technician");
      }
    } catch (error) {
      message.error("Error updating technician");
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

  if (!technician) {
    return <p>Technician not found</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Sửa thông tin</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={technician}
        layout="vertical"
      >
        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: "Full name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone_number"
          rules={[{ required: true, message: "Phone number is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Chuyên môn"
          name="specialty"
          rules={[{ required: true, message: "Specialty is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Ảnh">
          <input type="file" onChange={handleFileChange} />
          {technician.thumbnail && !thumbnailFile && (
            <div>
              <p>Current image:</p>
              <img
                src={technician.thumbnail}
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

export default TechnicianEdit;
