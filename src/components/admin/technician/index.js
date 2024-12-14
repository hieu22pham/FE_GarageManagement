import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Popconfirm } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Technician = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/technicians/get-all"
      );
      if (response.data.code === 200) {
        setData(response.data.data);
      } else {
        message.error("Không thể tải danh sách kỹ thuật viên");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách kỹ thuật viên");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/admin/technicians/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/technicians/create");
  };

  const handleEdit = (id) => {
    navigate(`/admin/technicians/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const API = `${process.env.REACT_APP_API_URL_ADMIN}/technicians/delete/${id}`;
      const response = await axios.delete(API);
      if (response.data.code === 200) {
        message.success("Xóa kỹ thuật viên thành công");
        setData((prev) => prev.filter((technician) => technician.id !== id)); // Cập nhật danh sách sau khi xóa
      } else {
        message.error("Không thể xóa kỹ thuật viên");
      }
    } catch (error) {
      message.error("Lỗi khi xóa kỹ thuật viên");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => (text ? text : "Không có"),
    },
    {
      title: "Chuyên môn",
      dataIndex: "specialty",
      key: "specialty",
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
            title="Bạn có chắc chắn muốn xóa kỹ thuật viên này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
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
        Thêm kỹ thuật viên mới
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </>
  );
};

export default Technician;
