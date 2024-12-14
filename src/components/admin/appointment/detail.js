import React, { useEffect, useState } from "react";
import { Descriptions, Button, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AppointmentDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [garage, setGarage] = useState(null);
  const [technician, setTechnician] = useState(null);
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/admin/appointments/get-by-id/${id}`);
        console.log("response: ", response)
        if (response.data.code === 200) {
          const appointmentData = response.data.data;
          setAppointment(appointmentData);

          // Fetch additional details
          const customerPromise = await axios.get(
            `http://localhost:8080/admin/customers/get-by-id/${appointmentData.customer_id}`
          );
          const garagePromise = await axios.get(
            `http://localhost:8080/admin/garages/get-by-id/${appointmentData.garage_id}`
          );
        //   const technicianPromise = axios.get(
        //     `http://localhost:8080/admin/technicians/get-by-id/${appointmentData.technician_id}`
        //   );
          const servicePromise = await axios.get(
            `http://localhost:8080/admin/services/get-by-id/${appointmentData.service_id}`
          );

          setCustomer(customerPromise.data.data);
          console.log(customerPromise)
          setGarage(garagePromise.data.data);
          console.log(garagePromise)

        //   setTechnician(technicianRes.data);
        //   console.log(technicianPromise)

          setService(servicePromise.data.data);
          console.log(servicePromise)


          message.success("Tải dữ liệu cuộc hẹn thành công!");
        } else {
          message.error("Không thể tải dữ liệu cuộc hẹn");
        }
      } catch (error) {
        message.error("Lỗi khi lấy dữ liệu cuộc hẹn");
      }
      setLoading(false);
    };

    fetchAppointment();
  }, [id]);

  if (loading) {
    return <Spin tip="Đang tải..." />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        Quay lại
      </Button>
      {appointment ? (
        <Descriptions title="Chi Tiết Cuộc Hẹn" bordered column={1}>
          <Descriptions.Item label="Mã cuộc hẹn">{appointment.id}</Descriptions.Item>
          <Descriptions.Item label="Khách hàng">
            {customer ? customer.full_name : "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Garage">
            {garage ? garage.name : "Không xác định"}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Kỹ thuật viên">
            {technician ? technician.full_name : "Không xác định"}
          </Descriptions.Item> */}
          <Descriptions.Item label="Dịch vụ">
            {service ? service.name : "Không xác định"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày hẹn">
            {new Date(appointment.appointment_date).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{appointment.notes || "Không có"}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không tìm thấy dữ liệu cuộc hẹn.</p>
      )}
    </div>
  );
};

export default AppointmentDetail;
