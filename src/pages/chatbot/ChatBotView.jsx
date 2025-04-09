import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Dropdown,
  Modal,
  ToggleButton,
} from "react-bootstrap";
import { FiGrid, FiImage, FiList, FiSettings, FiTrash2 } from "react-icons/fi";

const ChatBotView = ({ bots, setLoading }) => {
  const [view, setView] = useState("grid");
  const [show, setShow] = useState(false);
  const [createChatBot, setCreateChatBot] = useState(false);
  const [deleteChatBot, setDeleteChatBot] = useState(false);
  const context = useChatContext();
  const navigate = useNavigate();
  const handleNavigate = (id) => {
    navigate(`/overview/${id}`);
  };

  const handleShow = (data) => {
    setDeleteChatBot(data)
    setShow(true)};
  const handleClose = () => setShow(false);
  const handleDeleteBot = async ()=>{
    setLoading(true)
    try {
      if(deleteChatBot){
        let result = await deleteBot(deleteChatBot.bid)
        if(result && result.message){
          toast.success(result.message)
          handleClose()
          setDeleteChatBot(null)
          localStorage.setItem(
            "bots",
            JSON.stringify(JSON.parse(localStorage.getItem("bots")).filter((item)=>item.bid != deleteChatBot.bid))
          );
          context.dispatch({
            type: "DELETE_BOT",
            payload: {
              ...context.state,
              bots: JSON.parse(localStorage.getItem("bots")).filter((item)=>item.bid != deleteChatBot.bid),
            },
          });
        }
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  return (
    <Container
      className=""
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "20px 20px",
        height: "75vh",
        overflowY: "scroll",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <i className="bi bi-robot"></i> Đào tạo chatbot
        </h4>
        <div>
          <Button
            variant={view == "grid" ? "secondary" : "light"}
            className="me-2"
            onClick={() => setView("grid")}
          >
            <FiGrid size={20} />
          </Button>
          <Button
            variant={view == "list" ? "secondary" : "light"}
            className="me-2"
            onClick={() => setView("list")}
          >
            <FiList size={20} />
          </Button>
          <Button onClick={() => setCreateChatBot(true)} variant="primary">
            + Tạo chatbot
          </Button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="row">
          {bots.length &&
            bots.map((item, indx) => {
              return (
                <div className="col-md-4" style={{ marginTop: "10px" }}>
                  <Card
                    className="border-primary card-hover"
                    style={{ cursor: "pointer", border: "1px solid #ddd" }}
                  >
                    <Card.Body>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          className="d-flex align-items-center"
                          onClick={() => handleNavigate(item.bid)}
                        >
                          <img
                            src="https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
                            width={50}
                            height={50}
                            className="rounded-circle me-2"
                            alt="avatar"
                          />
                          <div>
                            <strong>{item.name}</strong>

                            <div className="text-muted">{item.created}</div>
                          </div>
                        </div>
                        <img
                          src={
                            item.language == "vi"
                              ? "https://flagcdn.com/w320/vn.png"
                              : "https://flagcdn.com/w320/us.png"
                          }
                          width={30}
                          height={20}
                          style={{ borderRadius: "5px" }}
                          alt=""
                        />
                      </div>

                      <div className="d-flex justify-content-end mt-2">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          className="me-2"
                        >
                          <FiSettings />
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={()=>{
                            handleShow(item)

                          }}
                          size="sm"
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
        </div>
      ) : (
        <table
          style={{
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 6px 0 rgba(67, 89, 113, 0.12)",
            cursor: "pointer",
          }}
          className="table"
        >
          <thead>
            <tr>
              <th>Tên</th>
              <th>Ngôn ngữ</th>
              <th>Cập nhật ngày</th>
              <th>Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {bots.length &&
              bots.map((item) => {
                return (
                  <tr>
                    <td onClick={() => handleNavigate(item.bid)}>
                      <img
                        src="https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
                        width={50}
                        height={50}
                        className="rounded-circle me-2"
                        alt="avatar"
                      />
                      {item.name}
                    </td>
                    <td>
                      <img
                        src={
                          item.language == "vi"
                            ? "https://flagcdn.com/w320/vn.png"
                            : "https://flagcdn.com/w320/us.png"
                        }
                        width={30}
                        height={20}
                        style={{ borderRadius: "5px" }}
                        alt=""
                      />
                    </td>
                    <td>{item.created}</td>
                    <td>
                      <Button variant="outline-dark" size="sm" className="me-2">
                        <FiSettings />
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={()=>{
                          handleShow(item)
                        }}
                        size="sm"
                      >
                        <FiTrash2 />
                      </Button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Xóa bot</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Bạn chắc chắn xóa <b>bot-demo</b> chứ ?
          </p>
        </Modal.Body>

        {/* Footer */}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleDeleteBot} variant="danger">Xóa</Button>
        </Modal.Footer>
      </Modal>
      <CreateChatbotModal
        show={createChatBot}
        setLoading={setLoading}
        setShow={setCreateChatBot}
      />
    </Container>
  );
};

export default ChatBotView;
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { createBot, deleteBot } from "../../services/bot";
import { toast } from "react-toastify";
import { useChatContext } from "../../App";

const CreateChatbotModal = ({ show, setShow, setLoading }) => {
  const handleClose = () => setShow(false);
  const [botName, setBotName] = useState("");
  const [info, setInfo] = useState("");
  const [language, setLanguage] = useState("vi");
  const [speed, setSpeed] = useState(1);
  const [active, setActive] = useState(true);
  const [owner, setOwner] = useState(null);
  const context = useChatContext();
  useEffect(() => {
    (async () => {
      if (localStorage.getItem("token")) {
        let decode = await jwtDecode(localStorage.getItem("token"));
        if (Object.keys(decode).length > 0) {
          setOwner(decode.email);
        }
      }
    })();
  }, [localStorage.getItem("token")]);
  const defaultAvatars = [
    "https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png",
  ];
  const [avatars, setAvatars] = useState(defaultAvatars);
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0]);

  const handleSelectAvatar = (avatar) => setSelectedAvatar(avatar);
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newAvatar = URL.createObjectURL(file);
      setAvatars((prev) => [newAvatar, ...prev]);
      setSelectedAvatar(newAvatar);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      name: botName,
      owner: owner,
      // avatar: selectedAvatar || null,
      info: info,
      language: language,
      speed: speed,
      active: active,
      created: new Date().toISOString(),
    };
    try {
      let result = await createBot(payload);
      if (result && result.bid) {
        toast.success("Tạo Bot thành công");
        setBotName("");
        setInfo("");
        localStorage.setItem(
          "bots",
          JSON.stringify([...JSON.parse(localStorage.getItem("bots")), result])
        );
        context.dispatch({
          type: "CREATE_BOT",
          payload: {
            ...context.state,
            bots: [...JSON.parse(localStorage.getItem("bots")), result],
          },
        });
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Tạo chatbot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <h5>Chi tiết bot</h5>
            <Form.Group className="mb-3">
              <Form.Label>Tên bot</Form.Label>
              <Form.Control
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="Chọn tên bot"
                maxLength={50}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ảnh đại diện</Form.Label>
              <div className="d-flex align-items-center">
                <label
                  className="btn btn-light rounded-circle p-2 me-2"
                  style={{ cursor: "pointer" }}
                >
                  <FiImage size={25} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    style={{ display: "none" }}
                  />
                </label>
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt="Avatar"
                    className={`rounded-circle me-2 ${selectedAvatar === avatar ? "border border-primary" : ""
                      }`}
                    width={50}
                    height={50}
                    style={{ cursor: "pointer", objectFit: "cover" }}
                    onClick={() => handleSelectAvatar(avatar)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giới thiệu</Form.Label>
              <Form.Control
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                placeholder="Giới thiệu"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tốc độ Bot trả lời</Form.Label>
              <Form.Select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              >
                <option value={1}>Chậm (Mặc định)</option>
                <option value={2}>Nhanh</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngôn ngữ</Form.Label>
              <Form.Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Auto Reply</Form.Label>
              <Form.Select
                value={active}
                onChange={(e) => setActive(e.target.value === "true")}
              >
                <option value="true">Active</option>
                <option value="false">Deactive</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-6">
            <h5>Kịch bản mẫu</h5>
            <div className="p-3 bg-light border rounded">
              <p className="text-muted">
                Chat Bot AI cung cấp kịch bản mẫu tối ưu cho từng ngành nghề,
                giúp bạn dễ dàng chốt sales với các câu hỏi phổ biến nhất. Bạn
                có thể sử dụng ngay bằng việc tích chọn kịch bản sẵn, tùy chỉnh
                hoặc tự tạo kịch bản riêng tại mục
                <strong> "Kịch bản chốt sales"</strong>. Cảm ơn bạn!
              </p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
