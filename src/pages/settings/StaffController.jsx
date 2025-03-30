import React, { useEffect, useState } from "react";
import StaffView from "./StaffView";

const StaffController = () => {
  const [staff, setStaff] = useState(
    localStorage.getItem("managed_users")
      ? JSON.parse(localStorage.getItem("managed_users"))
      : []
  );
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "support",
    bots: [],
  });
  const context = useChatContext();
  useEffect(() => {
    if (context && context.state && context.state.users) {
      setStaff(context.state.users);
    }
  }, [context.state.users]);
  console.log(context);
  const handleCreateUser = async (userData) => {
    console.log("User Created:", userData);
    setLoading(true);
    try {
      let result = await Register(userData);
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "support",
        bots: [],
      });
      if (result && result.uid) {
        localStorage.setItem(
          "managed_users",
          JSON.stringify([
            ...JSON.parse(localStorage.getItem("managed_users")),
            result,
          ])
        );
        context.dispatch({
          type: "REGISTER",
          payload: {
            ...context.state,
            users: [
              ...JSON.parse(localStorage.getItem("managed_users")),
              result,
            ],
          },
        });
        toast.success("Tạo thành công");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    // Gửi dữ liệu user lên API tại đây
  };
  return (
    <div>
      {loading && <Loading />}
      <StaffView setShowModal={setShowModal} staff={staff} />
      <CreateUserModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        handleCreate={handleCreateUser}
      />
    </div>
  );
};

export default StaffController;

import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select"; // Import thư viện react-select
import Loading from "../../components/Loading";
import { Register } from "../../services/auth";
import { toast } from "react-toastify";
import { useChatContext } from "../../App";

const CreateUserModal = ({
  show,
  handleClose,
  handleCreate,
  formData,
  setFormData,
}) => {
  const roles = ["admin", "support"];
  const botsList = JSON.parse(localStorage.getItem("bots")).map((item) => {
    return {
      value: item.bid,
      label: item.name,
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý chọn nhiều bots
  const handleBotChange = (selectedOptions) => {
    const selectedBots = selectedOptions.map((option) => option.value);
    setFormData({ ...formData, bots: selectedBots });
  };

  const handleSubmit = () => {
    handleCreate(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tạo User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vai trò</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chọn Bots</Form.Label>
            <Select
              options={botsList}
              isMulti
              value={botsList.filter((bot) =>
                formData.bots.includes(bot.value)
              )}
              onChange={handleBotChange}
              placeholder="Chọn bot..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Tạo User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
