import React, { useEffect, useState } from "react";
import { Form, Input, DatePicker, Button, message, Spin } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const AppointmentEdit = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  // Dữ liệu của khách hàng, dịch vụ và garage
  const [customer, setCustomer] = useState({});
  const [service, setService] = useState({});
  const [garage, setGarage] = useState({});

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Lấy thông tin cuộc hẹn
        const appointmentRes = await axios.get(
          `http://localhost:8080/admin/appointments/get-by-id/${id}`
        );

        if (appointmentRes.data.code === 200) {
          const appointmentData = appointmentRes.data.data;
          setAppointment(appointmentData);

          // Lấy thông tin liên quan
          const customerRes = await axios.get(
            `http://localhost:8080/admin/customers/get-by-id/${appointmentData.customer_id}`
          );
          const serviceRes = await axios.get(
            `http://localhost:8080/admin/services/get-by-id/${appointmentData.service_id}`
          );
          const garageRes = await axios.get(
            `http://localhost:8080/admin/garages/get-by-id/${appointmentData.garage_id}`
          );

          setCustomer(customerRes.data.data);
          setService(serviceRes.data.data);
          setGarage(garageRes.data.data);

          // Gán giá trị vào form
          form.setFieldsValue({
            appointment_date: appointmentData.appointment_date
              ? dayjs(appointmentData.appointment_date)
              : null,
            notes: appointmentData.notes || "",
            customer_name: customerRes.data.data.full_name,
            service_name: serviceRes.data.data.name,
            garage_name: garageRes.data.data.name,
          });
        } else {
          message.error("Không tìm thấy dữ liệu cuộc hẹn");
        }
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu cuộc hẹn");
      }
      setLoading(false);
    };

    fetchAppointment();
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        appointment_date: values.appointment_date
          ? values.appointment_date.format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      console.log("payload: ", payload)

      // Cập nhật cuộc hẹn
      const response = await axios.put(
        `http://localhost:8080/admin/appointments/update/${id}`,
        payload
      );

      // Cập nhật thông tin khách hàng, dịch vụ, garage
    //   await axios.put(`http://localhost:8080/admin/customers/update/${appointment.customer_id}`, {
    //     full_name: values.customer_name,
    //   });
    //   await axios.put(`http://localhost:8080/admin/services/update/${appointment.service_id}`, {
    //     name: values.service_name,
    //   });
    //   await axios.put(`http://localhost:8080/admin/garages/update/${appointment.garage_id}`, {
    //     name: values.garage_name,
    //   });

      if (response.data.code === 200) {
        message.success("Cập nhật thành công!");
      } else {
        message.error("Cập nhật cuộc hẹn thất bại");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật dữ liệu");
    }
    setLoading(false);
  };

  if (loading) {
    return <Spin tip="Đang tải dữ liệu..." />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>
        Quay lại
      </Button>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={appointment}
      >
        <Form.Item
          label="Tên khách hàng"
          name="customer_name"
          rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        <Form.Item
          label="Tên dịch vụ"
          name="service_name"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>

        <Form.Item
          label="Tên garage"
          name="garage_name"
          rules={[{ required: true, message: "Vui lòng nhập tên garage" }]}
        >
          <Input placeholder="Nhập tên garage" />
        </Form.Item>

        <Form.Item
          label="Ngày hẹn"
          name="appointment_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày hẹn" }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea rows={4} placeholder="Nhập ghi chú nếu có" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AppointmentEdit;
