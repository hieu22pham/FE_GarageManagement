import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, message, Spin, Divider } from "antd";
import axios from "axios";

const AdminDetail = () => {
  const { id } = useParams(); // Nhận id từ URL
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDetail(id);
  }, [id]);

  const fetchAdminDetail = async (adminId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/admin/get-by-id/${adminId}`
      );
      if (response.data.code === 200) {
        setAdmin(response.data.data);
      } else {
        message.error("Unable to fetch admin details.");
      }
    } catch (error) {
      message.error("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (!admin) {
    return <p>Admin not found</p>;
  }

  return (
    <Card
      title="Chi tiết Admin"
      style={{
        maxWidth: 800,
        margin: "20px auto",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
      }}
    >
      <Row gutter={[16, 16]}>
        {/* Cột bên trái: Ảnh */}
        <Col xs={24} md={12}>
          <img
            src={admin.thumbnail}
            alt="Admin"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              objectFit: "cover",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Col>

        {/* Cột bên phải: Thông tin */}
        <Col xs={24} md={12}>
          <Divider  style={{marginLeft: "20px", marginTop: "-10px"}}>Thông tin Admin</Divider>
          <div style={{marginLeft: "135px"}}>
            <p>
              <strong>Họ và tên:</strong> {admin.full_name}
            </p>
            <p>
              <strong>User name:</strong> {admin.username}
            </p>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default AdminDetail;
