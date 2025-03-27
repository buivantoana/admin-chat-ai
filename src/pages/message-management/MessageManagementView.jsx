import React, { useEffect, useState } from 'react'
import { Card, InputGroup, FormControl, ProgressBar, Dropdown, Button, Modal, Form, Badge } from "react-bootstrap";
import { FiFilter, FiSearch, FiRepeat, FiTag, FiSend, FiLink, FiAlertCircle, FiMoreHorizontal } from "react-icons/fi";
import inbox from "../../images/ic_dashboard_inbox.webp";
import facebook from "../../images/ic_dashboard_messenger.webp";
import zalo from "../../images/ic_dashboard_zalo.webp";
import website from "../../images/ic_website.webp";
const MessageManagementView = ({ botChat }) => {
   const [chat, setChat] = useState(null)
   useEffect(() => {
      if (!chat) return;

      const foundChat = botChat.find((item) => item.cid === chat.cid) || null;
      setChat(foundChat);
   }, [botChat]);
   return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
         <ChatSidebar botChat={botChat} setChat={setChat} chat={chat} />
         <ChatUI chat={chat} />
      </div>
   )
}

export default MessageManagementView



const ChatSidebar = ({ botChat, setChat, chat }) => {
   const [show, setShow] = useState(false);
   const [chatChanel, setChatChanel] = useState('inbox');
   const handleShow = () => setShow(true);
   const handleClose = () => setShow(false);
   return (
      <div className="p-3" style={{ width: "30%", borderRadius: "12px", background: "white", height: "77vh" }}>
         {/* Header */}
         <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Chat</h5>
            <Dropdown>
               <Dropdown.Toggle variant="link" className="text-dark p-0">
                  {chatChanel == "inbox" && <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={inbox} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Tất cả kênh chat</div>}
                  {chatChanel == "facebook" && <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={facebook} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Messages</div>}
                  {chatChanel == "zalo" && <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={zalo} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Zalo</div>}
                  {chatChanel == "website" && <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={website} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Website</div>}
               </Dropdown.Toggle>
               <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setChatChanel("inbox")}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={inbox} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Tất cả kênh chat</div></Dropdown.Item>
                  <Dropdown.Item onClick={() => setChatChanel("facebook")}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={facebook} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Messages</div></Dropdown.Item>
                  <Dropdown.Item onClick={() => setChatChanel("zalo")}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={zalo} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Zalo</div></Dropdown.Item>
                  <Dropdown.Item onClick={() => setChatChanel("website")}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={website} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Website</div></Dropdown.Item>
               </Dropdown.Menu>
            </Dropdown>
         </div>

         {/* Search Box */}
         <InputGroup className="mb-3">
            <InputGroup.Text><FiSearch /></InputGroup.Text>
            <FormControl placeholder="Tìm kiếm" />
         </InputGroup>

         {/* Progress */}
         <div className="mb-3">
            <div className="d-flex justify-content-between text-muted small">
               <span>Cuộc hội thoại</span>
               <span>{botChat.length} / 2.000</span>
            </div>
            <ProgressBar now={2} max={2000} variant="purple" style={{ height: "5px" }} />
         </div>

         {/* Sorting & Filtering */}
         <div className="d-flex justify-content-between align-items-center mb-2">
            <Button variant="light" className="p-0 text-dark border-0">
               Gần nhất <FiRepeat style={{ marginLeft: "10px" }} />
            </Button>
            <Button variant="light" onClick={handleShow} style={{ border: "1px solid #dddddd" }} className="p-1 text-dark">
               <FiFilter style={{ marginRight: "10px" }} /> Lọc
            </Button>
         </div>

         {/* Chat Item */}
         <div className='card-hover3' style={{ height: "45vh", overflowY: "scroll" }}>
            {botChat && botChat.length > 0 && botChat.map((item) => {
               return <Card onClick={() => setChat(item)} className="mb-2 p-2 card-hover2 border-primary" style={{ borderRadius: "8px", marginTop: "18px", border: "1px solid #ddd", position: "relative", background: chat && chat.cid == item.cid ? "#f5e8ff" : "" }}>
                  <div className="d-flex align-items-center">
                     <div className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center"
                        style={{ width: "40px", height: "40px", fontWeight: "bold" }}>
                        B
                     </div>
                     <div className="ms-2">
                        <div style={{ display: "flex", justifyContent: "space-between", }}>
                           <div className="fw-bold">Bot</div>

                        </div>
                        <small className="text-muted">Mình không thể trả lời cho...</small>
                     </div>
                  </div>
                  <div className="mt-1 d-flex align-items-center">
                     <span style={{ background: "rgb(173, 216, 230)", color: "white", borderRadius: "5px", fontSize: "11px", padding: "1px 2px" }}>Tư vấn</span>

                  </div>
                  <Dropdown key={"none"} className="custom-dropdown" style={{ position: "absolute", right: "10px", top: "10px" }}>
                     <Dropdown.Toggle as="div" variant="link" className="text-dark p-0">
                        <FiMoreHorizontal style={{ cursor: "pointer" }} size={23} />
                     </Dropdown.Toggle>
                     <Dropdown.Menu>
                        <Dropdown.Item>Bỏ xem</Dropdown.Item>
                        <Dropdown.Item style={{ color: "red" }}>Xóa cuộc hội thoại</Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
               </Card>
            })}

         </div>

         <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
               <Modal.Title><b>Lọc</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>
               <div className="row">
                  {/* Kênh */}
                  <div className="col-md-6 mb-3">
                     <h6>Kênh</h6>
                     <Form.Check type="checkbox" label="Kênh 1" />
                     <Form.Check type="checkbox" label="Kênh 2" />
                  </div>

                  {/* Bot */}
                  <div className="col-md-6 mb-3">
                     <h6>Bot</h6>
                     <Form.Check type="checkbox" label="bot-demo" />
                  </div>

                  {/* Trạng thái hội thoại */}
                  <div className="col-md-6 mb-3">
                     <h6>Trạng thái hội thoại</h6>
                     <Form.Check type="checkbox" label="Tư vấn" />
                     <Form.Check type="checkbox" label="Tiềm năng" />
                     <Form.Check type="checkbox" label="Chốt đơn" />
                  </div>

                  {/* Tags */}
                  <div className="col-md-6 mb-3">
                     <h6>Tags</h6>
                     <Form.Check type="checkbox" label={<Badge bg="success">Chốt đơn</Badge>} />
                     <Form.Check type="checkbox" label={<Badge bg="danger">Bot không trả lời được</Badge>} />
                     <Form.Check type="checkbox" label={<Badge bg="secondary">Khách không phản hồi</Badge>} />
                  </div>
                  <div className="col-md-6 mb-3">
                     <h6>Trạng thái trả lời</h6>
                     <Form.Check type="checkbox" label={'Chưa xem'} />
                     <Form.Check type="checkbox" label={'Đã xem'} />

                  </div>
               </div>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>Thoát</Button>
               <Button variant="primary">Áp dụng</Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};









import { Row, Col } from 'react-bootstrap';
import { useRef } from 'react'; // Thêm useRef để tham chiếu input
import Offcanvas from 'react-bootstrap/Offcanvas';
import nochat from "../../images/img_no_message.webp"
function ChatUI({ chat }) {
   const [messages, setMessages] = useState(chat && chat.messages ? chat.messages : []);
   const [newMessage, setNewMessage] = useState('');
   const [show, setShow] = useState(false);
   const fileInputRef = useRef(null); // Tham chiếu đến input file

   useEffect(() => {
      if (chat) {
         setMessages(chat.messages)
      }
   }, [chat])





   const handleSendMessage = (e) => {
      e.preventDefault();
      if (newMessage.trim()) {
         setMessages([...messages, { content: newMessage, time: '17:31', role: 'assistant' }]);
         setNewMessage('');
      }
   };

   const handleShow = () => setShow(true);
   const handleClose = () => setShow(false);

   // Hàm xử lý khi chọn file
   const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const fileUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho file
         const fileType = file.type.split('/')[0]; // Lấy loại file (image hoặc video)
         const newMsg = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Lấy giờ hiện tại
            sender: 'me',
         };

         if (fileType === 'image') {
            newMsg.image = fileUrl;
         } else if (fileType === 'video') {
            newMsg.video = fileUrl;
         }

         setMessages([...messages, newMsg]);
      }
   };

   // Hàm kích hoạt input file khi nhấn icon
   const triggerFileInput = () => {
      fileInputRef.current.click();
   };
   console.log(messages);
   return (
      <>
         {!chat && <div style={{ width: "68%" }} >
            <Row>
               <Col md={12} >
                  <Card className="mb-3" style={{ background: "#f5f5f9", height: "77vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                     <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                        <img src={nochat} alt="" />
                        <h5 style={{ fontWeight: "bold" }}>Cuộc hội thoại sẽ xuất hiện ở đây</h5>
                     </div>

                  </Card>
               </Col>
            </Row>


         </div>}
         {chat && <div style={{ width: "68%" }} >
            <Row>
               <Col md={12} >
                  <Card className="mb-3" style={{ background: "#f5f5f9", height: "77vh" }}>
                     <Card.Header style={{ background: "white", padding: "10px 20px" }} className="d-flex justify-content-between align-items-center">
                        <div style={{ display: "flex", gap: "10px" }}>
                           <div>
                              <div className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center"
                                 style={{ width: "40px", height: "40px", fontWeight: "bold" }}>
                                 B
                              </div>
                              <p style={{ padding: "0 2px", background: "rgb(173, 216, 230)", borderRadius: "5px", fontSize: "11px", margin: 0, marginTop: "2px", color: "white" }}>Tư vấn</p>
                           </div>
                           <div>
                              <strong>Bot <FiTag /></strong>
                              <p style={{ fontSize: "13px", textTransform: "capitalize" }}>{chat.platform}</p>
                           </div>
                        </div>
                        <AutoReplyToggle />
                        <FiAlertCircle
                           style={{ cursor: "pointer" }}
                           size={23}
                           onClick={handleShow}
                        />
                     </Card.Header>
                     <ChatComponent messages={messages} />
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
                              <Button variant="outline-secondary" onClick={triggerFileInput}>
                                 <FiLink />
                              </Button>
                              {/* Input file ẩn */}
                              <input
                                 type="file"
                                 ref={fileInputRef}
                                 style={{ display: 'none' }}
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

            <Offcanvas show={show} onHide={handleClose} placement="end">
               <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Thông tin</Offcanvas.Title>
               </Offcanvas.Header>
               <Offcanvas.Body>
                  <Card>
                     <Card.Body>
                        <h5>Bùi Văn Toản</h5>
                        <p>Website</p>
                        <hr />
                        <Form.Group className="mb-3">
                           <Form.Label>Tag</Form.Label>
                           <Form.Select>
                              <option>Đang tương tác</option>
                           </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                           <Form.Label>Trang thái</Form.Label>
                           <Form.Select>
                              <option>Tư vấn</option>
                           </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                           <Form.Label>Note</Form.Label>
                           <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                           <Button variant="outline-danger">Đóng</Button>
                           <Button variant="primary">Lưu</Button>
                        </div>
                     </Card.Body>
                  </Card>
               </Offcanvas.Body>
            </Offcanvas>
         </div>}
      </>
   );
}

import { OverlayTrigger, Popover } from "react-bootstrap";


const AutoReplyToggle = () => {
   const [isAutoReplyOn, setIsAutoReplyOn] = useState(false);

   const toggleAutoReply = () => {
      setIsAutoReplyOn(!isAutoReplyOn);
   };

   const popover = (
      <Popover id="auto-reply-popover">
         <Popover.Body>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
               <strong>Auto-reply</strong>
               <Form.Check
                  type="switch"
                  id="auto-reply-switch"
                  label=""
                  checked={isAutoReplyOn}
                  onChange={toggleAutoReply}
               />
            </div>
            <p>Khi bật lên, bot sẽ tự trả lời tin nhắn của khách hàng</p>

         </Popover.Body>
      </Popover>
   );

   return (
      <Dropdown>
         <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose>
            <Button variant="light" className="d-flex align-items-center" style={{ border: "1px solid #dddddd", borderRadius: "20px" }}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  style={{ marginRight: "10px" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bot text-disable-text-1"
               >
                  <path d="M12 8V4H8" />
                  <rect width={16} height={12} x={4} y={8} rx={2} />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
               </svg>
               Auto-reply: <strong className="ms-1">{isAutoReplyOn ? "ON" : "OFF"}</strong>
            </Button>
         </OverlayTrigger>
      </Dropdown>
   );
};




const ChatComponent = ({ messages }) => {
   const chatRef = useRef(null);

   // ✅ Khi vào màn hình hoặc có tin nhắn mới, luôn cuộn xuống dưới cùng
   useEffect(() => {
      if (chatRef.current) {
         chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
   }, [messages]); // Chạy mỗi khi messages thay đổi

   return (
      <Card.Body ref={chatRef} style={{ height: "55vh", overflowY: "auto" }}>
         {messages.map((msg, index) => (
            <div
               key={index}
               className={`d-flex mb-2 mt-1 ${msg.role === "assistant" ? "justify-content-end" : "justify-content-start"}`}
            >
               <div
                  className={`p-2 rounded ${msg.role === "user" ? "bg-primary text-white" : "bg-white"}`}
                  style={{ maxWidth: "70%" }}
               >
                  {msg.content && msg.role !== "system" && <p className="mb-0">{msg.content}</p>}
                  {msg.image && <img src={msg.image} alt="attachment" className="img-fluid rounded" />}
                  {msg.video && (
                     <video controls className="img-fluid rounded">
                        <source src={msg.video} type="video/mp4" />
                        Your browser does not support the video tag.
                     </video>
                  )}
                  <small>{msg.created ? msg.created.split("T")[1].split(":").slice(0, 2).join(":") : ""}</small>
               </div>
            </div>
         ))}
      </Card.Body>
   );
};





