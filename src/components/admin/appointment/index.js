import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Popconfirm } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [garageData, setGarageData] = useState({});
  const [serviceData, setServiceData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/admin/appointments/get-all");
      if (response.data.code === 200) {
        const appointments = response.data.data;
        setData(appointments);

        // Lấy danh sách ID khách hàng, garage và dịch vụ
        const customerIds = [...new Set(appointments.map(item => item.customer_id))];
        const garageIds = [...new Set(appointments.map(item => item.garage_id))];
        const serviceIds = [...new Set(appointments.map(item => item.service_id))];

        // Lấy thông tin khách hàng, garage, dịch vụ
        const customerPromises = customerIds.map(id =>
          axios.get(`http://localhost:8080/admin/customers/get-by-id/${id}`)
        );
        const garagePromises = garageIds.map(id =>
          axios.get(`http://localhost:8080/admin/garages/get-by-id/${id}`)
        );
        const servicePromises = serviceIds.map(id =>
          axios.get(`http://localhost:8080/admin/services/get-by-id/${id}`)
        );

        const [customers, garages, services] = await Promise.all([
          Promise.all(customerPromises),
          Promise.all(garagePromises),
          Promise.all(servicePromises),
        ]);

        // Lưu thông tin vào state
        customers.forEach(response => {
          if (response.data.code === 200) {
            setCustomerData(prev => ({ ...prev, [response.data.data.id]: response.data.data.full_name }));
          }
        });
        garages.forEach(response => {
          if (response.data.code === 200) {
            setGarageData(prev => ({ ...prev, [response.data.data.id]: response.data.data.name }));
          }
        });
        services.forEach(response => {
          if (response.data.code === 200 && response.data.data.name) {
            setServiceData(prev => ({ ...prev, [response.data.data.id]: response.data.data.name }));
          }
        });
      } else {
        message.error("Không thể tải dữ liệu cuộc hẹn");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/admin/appointments/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/appointments/create");
  };

  const handleEdit = (id) => {
    navigate(`/admin/appointments/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!id) {
      message.error("Không thể xác định ID cuộc hẹn!");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8080/admin/appointments/delete/${id}`);
      if (response.data.code === 200) {
        message.success("Xóa cuộc hẹn thành công!");
        setData(prevData => prevData.filter(item => item.id !== id));
      } else {
        message.error("Không thể xóa cuộc hẹn");
      }
    } catch (error) {
      message.error("Lỗi khi xóa cuộc hẹn");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_id",
      key: "customer_id",
      render: (customer_id) => customerData[customer_id] || "",
    },
    {
      title: "Garage",
      dataIndex: "garage_id",
      key: "garage_id",
      render: (garage_id) => garageData[garage_id] || "",
    },
    {
      title: "Dịch vụ",
      dataIndex: "service_id",
      key: "service_id",
      render: (service_id) => serviceData[service_id] || "",
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointment_date",
      key: "appointment_date",
      render: (appointment_date) => new Date(appointment_date).toLocaleString(),
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (notes) => notes,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record.id)}>
            Xem
          </Button>
          <Button type="link" onClick={() => handleEdit(record.id)}>
            Sửa
          </Button>
          <Popconfirm
            title="Chắc chắn xóa cuộc hẹn này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleCreate}
      >
        Thêm mới
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        bordered
      />
    </>
  );
};

export default Appointment;
