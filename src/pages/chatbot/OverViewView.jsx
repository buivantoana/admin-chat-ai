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
  Modal,
  Spinner,
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
              result.avatar ? `data:image/png;base64,${result.avatar}` :
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

import { useRef } from "react";
import { FiSend, FiTag, FiPaperclip } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { editBot, getBot } from "../../services/bot";
import { toast } from "react-toastify";
import { useChatContext } from "../../App";
import { botChatMakeDemo, botDeleteChat, botGetAllChatDemo } from "../../services/chat_all";


function ChatUI() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // State để lưu file được chọn
  const [filePreview, setFilePreview] = useState(null); // State để lưu URL preview của file
  const fileInputRef = useRef(null);
  const [chatId, setChatId] = useState(null);
  const [show, setShow] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  // Hàm xử lý khi chọn file
  const handleFileUpload = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      const fileUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setFilePreview({ type: fileType, url: fileUrl });
    }
  };
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();

  }, [messages]);
  useEffect(() => {
    getChatDemo();
  }, []);
  const getChatDemo = async () => {
    try {
      let result = await botGetAllChatDemo(id);
      if (result && result.length > 0) {
        setChatId(result[0].cid)
        setMessages(result[0].messages.filter((_, index) => index != 0))
      } else {
        setMessages([])
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(messages);
  // Hàm xóa file preview
  const removeFilePreview = () => {
    setSelectedFile(null);
    setFilePreview(null);
    fileInputRef.current.value = "";
  };

  // Hàm gửi tin nhắn và file lên server
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    const newMsg = {
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }), // Thời gian hiện tại (23:11)
      role: "user",
      content: newMessage || "",
    };

    let fileBase64 = "";
    if (selectedFile) {
      fileBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(selectedFile);
      });

      const fileType = selectedFile.type.split("/")[0];
      if (fileType === "image") {
        newMsg.file_url = URL.createObjectURL(selectedFile);
      } else if (fileType === "video") {
        newMsg.video = URL.createObjectURL(selectedFile);
      }
    }

    // Thêm tin nhắn vào danh sách
    setMessages([...messages, newMsg]);
    setNewMessage("");
    setSelectedFile(null);
    setFilePreview(null);
    fileInputRef.current.value = "";

    // Gửi dữ liệu lên server
    const payload = {
      senderid: "demo_chatbot",
      content: newMessage || "",
      platform: "web",
      file_raw: fileBase64 || "",
    };

    try {
      const response = await botChatMakeDemo(id, payload);

      if (response && Object.keys(response).length > 0) {
        getChatDemo()
        toast.success("Message sent successfully!");
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message.");
    }
  };

  const handleReset = async () => {
    setShow(false)
    setLoadingInit(true);
    try {
      if (chatId) {
        let result = await botDeleteChat(id, chatId);
        if (result && Object.keys(result).length > 0) {

          getChatDemo()
          toast.success(result.message);
        } else {
          toast.error(result.detail);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingInit(false);
  }
  return (
    <div style={{ width: "100%", height: "20vh" }}>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Khởi tạo lại</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Bạn có muốn khởi tạo lại đoạn chát dùng thử ko?
          </p>
        </Modal.Body>

        {/* Footer */}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Hủy
          </Button>
          <Button onClick={handleReset} variant="danger">Đồng ý</Button>
        </Modal.Footer>
      </Modal>
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
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
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
                      Demo <FiTag />
                    </strong>
                    <p style={{ fontSize: "13px" }}>Website</p>
                  </div>
                </div>
                <Button
                  variant="outline-primary"
                  disabled={messages.length === 0 || loadingInit}
                  onClick={() => setShow(true)}
                  style={{
                    height: "max-content",
                    fontSize: "12px",
                    padding: "5px 7px",
                    minWidth: "90px",
                  }}
                >
                  {loadingInit ? (
                    <>
                      <Spinner animation="border" size="sm" style={{ marginRight: 5 }} />
                      Đang khởi tạo...
                    </>
                  ) : (
                    "Khởi tạo lại"
                  )}
                </Button>
              </div>
            </Card.Header>
            <Card.Body ref={messagesEndRef} style={{ height: "38vh", overflowY: "auto" }}>
              {messages && messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex mb-2 mt-1 ${msg.role === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                    }`}
                >
                  <div
                    className={`p-2 rounded ${msg.role === "user" ? "bg-primary text-white" : "bg-white"
                      }`}
                    style={{ maxWidth: "70%" }}
                  >
                    {msg.content && <p className="mb-0">{msg.content}</p>}
                    <div style={{ display: "flex", flexDirection: "column" }}>

                      {msg.file_url && (
                        <img
                          src={msg.file_url}
                          alt="attachment"
                          className="img-fluid rounded"
                          style={{ maxWidth: "100%", marginTop: "5px" }}
                        />
                      )}
                      {msg.video && (
                        <video
                          controls
                          className="img-fluid rounded"
                          style={{ maxWidth: "100%", marginTop: "5px" }}
                        >
                          <source src={msg.video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {/* <small style={{ color: msg.sender === "user" ? "white" : "#697A8D" }} >{msg.time}</small> */}
                    </div>
                  </div>
                </div>
              ))}
            </Card.Body>
            <Card.Footer style={{ background: "white", padding: "10px" }}>
              <Form onSubmit={handleSendMessage}>
                {/* Hiển thị preview file nếu có */}
                {filePreview && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      position: "relative",
                    }}
                  >
                    {filePreview.type === "image" ? (
                      <img
                        src={filePreview.url}
                        alt="preview"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          borderRadius: "5px",
                          marginRight: "10px",
                        }}
                      />
                    ) : (
                      <video
                        src={filePreview.url}
                        style={{
                          maxWidth: "100px",
                          maxHeight: "100px",
                          borderRadius: "5px",
                          marginRight: "10px",
                        }}
                      />
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={removeFilePreview}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        borderRadius: "50%",
                        padding: "0 6px",
                      }}
                    >
                      ×
                    </Button>
                  </div>
                )}
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tin nhắn của bạn"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ borderRadius: "5px", borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => fileInputRef.current.click()}
                    style={{ border: "1px solid #ccc", }}
                  >
                    <FiPaperclip />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                  />
                  <Button
                    disabled={!newMessage && !selectedFile}
                    variant="primary"
                    type="submit"
                    style={{}}
                  >
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

