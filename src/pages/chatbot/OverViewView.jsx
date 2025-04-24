import React, { useEffect } from "react";
import Sidebar from "./SideBar";

const OverViewView = ({ setLoading }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          width: "75%",
          background: "white",
          borderBottomRightRadius: "10px",
          borderTopRightRadius: "10px",
          paddingTop: "20px",
          height: "77vh",
          overflowY: "scroll",
        }}
      >
        <ChatBot setLoading={setLoading} />
      </div>
    </div>
  );
};

export default OverViewView;
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Dropdown,
  InputGroup,
} from "react-bootstrap";

const ChatBot = ({ setLoading }) => {
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [avatar, setAvatar] = useState(
    "https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
  );
  const [botName, setBotName] = useState("");
  const [info, setInfo] = useState("");
  const [language, setLanguage] = useState("vi");
  const [speed, setSpeed] = useState(1);
  const [fileImage, setFileImage] = useState(null);
  const context = useChatContext();

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        try {
          let result = await getBot(id);
          if (result && Object.keys(result).length > 0) {
            setBot(result);
            setBotName(result.name || "");
            setInfo(result.info || "");
            setLanguage(result.language || "vi");
            setSpeed(result.speed || 1);
            setAvatar(
              result.avatar ?`data:image/png;base64,${result.avatar}`:
                "https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
            );
          }
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      })();
    }
  }, [id]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setFileImage(file)
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedBot = {
      name: botName,
      avatar: avatar,
      info: info,
      language: language,
      speed: speed,
    };
    const formData = new FormData();
    formData.append("name", botName);
    formData.append("info", info);
    formData.append("language", language);
    formData.append("speed", speed.toString());
    if (fileImage) {
      formData.append("avatar", fileImage);
    }
    try {
      let result = await editBot(id, formData);
      if (result && Object.keys(result).length > 0) {
        localStorage.setItem(
          "bots",
          JSON.stringify(
            context.state.bots.map((item) => {
              if (item.bid == result.bid) {
                return result;
              }
              return item;
            })
          )
        );
        context.dispatch({
          type: "UPDATE_BOT",
          payload: {
            ...context.state,
            bots: context.state.bots.map((item) => {
              if (item.bid == result.bid) {
                return result;
              }
              return item;
            }),
          },
        });
        toast.success("Sửa Bot thành công");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Container>
      <Row>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <h4>Tổng quan</h4>
          <Button variant="outline-primary" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </div>

        {/* Cột trái: Thông tin bot */}
        <Col md={7}>
          <Form.Group className="mb-3">
            <h6>
              Tên <span style={{ color: "red" }}>*</span>
            </h6>
            <Form.Control
              type="text"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <h6>
              Giới thiệu <span style={{ color: "red" }}>*</span>
            </h6>
            <Form.Control
              type="text"
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              placeholder="Giới thiệu chung về cty, email, hotline,..."
            />
          </Form.Group>

          {/* Avatar */}
          <div className="mb-3">
            <h6>Avatar</h6>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <img
              src={avatar}
              alt="Avatar"
              width={50}
              height={50}
              className="rounded-circle"
              style={{ cursor: "pointer", objectFit: "cover" }}
              onClick={() => document.getElementById("avatarInput").click()}
            />
          </div>

          <Form.Group className="mb-3">
            <h6>Ngôn ngữ trả lời</h6>
            <Dropdown>
              <Dropdown.Toggle
                style={{ border: "1px solid grey" }}
                variant="light"
              >
                {language === "vi" ? "Tiếng Việt" : "English"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setLanguage("vi")}>
                  Tiếng Việt
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setLanguage("en")}>
                  English
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Form.Group className="mb-3">
            <h6>Tốc độ bot trả lời</h6>
            <Dropdown>
              <Dropdown.Toggle
                style={{ border: "1px solid grey" }}
                variant="light"
              >
                {speed === 1 ? "Chậm (mặc định)" : "Nhanh"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSpeed(1)}>
                  Chậm (mặc định)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSpeed(2)}>Nhanh</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Form.Group className="mb-3">
            <h6>Hành động khi gặp câu hỏi không xác định </h6>
            <Form.Control type="text" placeholder="Nhập câu trả lời" />
          </Form.Group>

          <Button variant="outline-danger" className="mb-3">
            <i className="fas fa-trash-alt"></i> Xóa
          </Button>
        </Col>

        {/* Cột phải: Cửa sổ chat */}
        <Col md={5}>
          <ChatUI />
        </Col>
      </Row>
    </Container>
  );
};

import { useRef } from "react"; // Thêm useRef để tham chiếu input
import { FiSend, FiTag } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { editBot, getBot } from "../../services/bot";
import { toast } from "react-toastify";
import { useChatContext } from "../../App";

function ChatUI() {
  const [messages, setMessages] = useState([
    {
      text: "👋 Hello! How can I help you today?",
      time: "17:28",
      sender: "other",
    },
    { text: "My email is example@example.com", time: "17:29", sender: "me" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const fileInputRef = useRef(null); // Tham chiếu đến input file

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { text: newMessage, time: "17:31", sender: "me" },
      ]);
      setNewMessage("");
    }
  };

  // Hàm xử lý khi chọn file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho file
      const fileType = file.type.split("/")[0]; // Lấy loại file (image hoặc video)
      const newMsg = {
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }), // Lấy giờ hiện tại
        sender: "me",
      };

      if (fileType === "image") {
        newMsg.image = fileUrl;
      } else if (fileType === "video") {
        newMsg.video = fileUrl;
      }

      setMessages([...messages, newMsg]);
    }
  };

  return (
    <div style={{ width: "100%", height: "20vh" }}>
      <Row>
        <Col md={12}>
          <Card
            className="border-primary mb-3"
            style={{
              background: "#f5f5f9",
              cursor: "pointer",
              border: "1px solid #ddd",
            }}
          >
            <Card.Header
              style={{ background: "white", padding: "10px 20px" }}
              className="d-flex justify-content-between align-items-center"
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <div
                    className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      fontWeight: "bold",
                    }}
                  >
                    B
                  </div>
                  <p
                    style={{
                      padding: "0 2px",
                      background: "rgb(173, 216, 230)",
                      borderRadius: "5px",
                      fontSize: "11px",
                      margin: 0,
                      marginTop: "2px",
                      color: "white",
                    }}
                  >
                    Tư vấn
                  </p>
                </div>
                <div>
                  <strong>
                    Bùi Văn Toản - 0345282233 <FiTag />
                  </strong>
                  <p style={{ fontSize: "13px" }}>Website</p>
                </div>
              </div>
            </Card.Header>
            <Card.Body style={{ height: "33vh", overflowY: "auto" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex mb-2 mt-1 ${
                    msg.sender === "me"
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      msg.sender === "me" ? "bg-primary text-white" : "bg-white"
                    }`}
                    style={{ maxWidth: "70%" }}
                  >
                    {msg.text && <p className="mb-0">{msg.text}</p>}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="attachment"
                        className="img-fluid rounded"
                      />
                    )}
                    {msg.video && (
                      <video controls className="img-fluid rounded">
                        <source src={msg.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <small className="text-muted">{msg.time}</small>
                  </div>
                </div>
              ))}
            </Card.Body>
            <Card.Footer style={{ background: "white" }}>
              <Form onSubmit={handleSendMessage}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tin nhắn của bạn"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  {/* Nút với icon FiLink để tải file */}

                  {/* Input file ẩn */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*,video/*" // Chỉ chấp nhận image và video
                    onChange={handleFileUpload}
                  />
                  <Button variant="primary" type="submit">
                    <FiSend />
                  </Button>
                </InputGroup>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
