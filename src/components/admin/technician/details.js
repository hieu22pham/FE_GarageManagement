import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, message, Spin, Divider } from "antd";
import axios from "axios";

const TechnicianDetail = () => {
  const { id } = useParams(); // Nhận id từ URL
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } else {
        message.error("Unable to fetch technician details.");
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

  if (!technician) {
    return <p>Technician not found</p>;
  }

  return (
    <Card
      title=""
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Row gutter={16}>
        {/* Cột bên trái: Ảnh */}
        <Col span={12}>
          <img
            src={technician.thumbnail}
            alt="Technician"
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
        <Col span={12}>
          <Divider style={{marginLeft: "20px", marginTop: "-10px"}}>Thông tin kỹ thuật viên</Divider>
          <div style={{marginLeft: "125px"}}>
          <p>
            <strong>Họ và tên:</strong> {technician.full_name}
          </p>
          <p>
            <strong>Email:</strong> {technician.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {technician.phone_number || "N/A"}
          </p>
          <p>
            <strong>Chuyên môn:</strong> {technician.specialty}
          </p>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default TechnicianDetail;
