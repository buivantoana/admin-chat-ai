import React, { useEffect, useState } from 'react'
import { Card, InputGroup, FormControl, ProgressBar, Dropdown, Button, Modal, Form, Badge, Spinner } from "react-bootstrap";
import { FiFilter, FiSearch, FiRepeat, FiTag, FiSend, FiLink, FiAlertCircle, FiMoreHorizontal } from "react-icons/fi";
import inbox from "../../images/ic_dashboard_inbox.webp";
import facebook from "../../images/ic_dashboard_messenger.webp";
import zalo from "../../images/ic_dashboard_zalo.webp";
import website from "../../images/ic_website.webp";
const MessageManagementView = ({ botChat, setChatBot, loading }) => {
   const [chat, setChat] = useState(null)
   const initialLoad = useRef(true);
   useEffect(() => {
      if (!chat) return;

      const foundChat = botChat.find((item) => item.cid === chat.cid) || null;
      setChat(foundChat);
   }, [botChat]);
   return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
         <ChatSidebar botChat={botChat} initialLoad={initialLoad} setChat={setChat} loading={loading} chat={chat} />
         <ChatUI chat={chat} initialLoad={initialLoad} botChat={botChat} setChatBot={setChatBot} />
      </div>
   )
}

export default MessageManagementView



const ChatSidebar = ({ botChat, setChat, chat, initialLoad, loading }) => {
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
                  {chatChanel == "messenger" && <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={facebook} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Messages</div>}
                  {chatChanel == "zalo" && <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={zalo} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Zalo</div>}
                  {chatChanel == "web" && <div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={website} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Website</div>}
               </Dropdown.Toggle>
               <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setChatChanel("inbox")}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={inbox} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Tất cả kênh chat</div></Dropdown.Item>
                  <Dropdown.Item onClick={() => setChatChanel("messenger")}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={facebook} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Messages</div></Dropdown.Item>
                  <Dropdown.Item onClick={() => setChatChanel("zalo")}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={zalo} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Zalo</div></Dropdown.Item>
                  <Dropdown.Item onClick={() => setChatChanel("web")}><div style={{ display: "flex", alignItems: "center", gap: "10px" }}> <img src={website} width={20} style={{ marginTop: "-3px" }} height={20} alt='' /> Website</div></Dropdown.Item>
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
            {loading ? <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Spinner size='15' /></div> :
               <> {botChat && botChat.length > 0 && botChat.map((item) => {
                  let notify = false
                  console.log(localStorage.getItem("notify_chat"))
                  if (localStorage.getItem("notify_chat")) {
                     if (JSON.parse(localStorage.getItem("notify_chat")).filter((ix) => ix == item.cid)[0]) {
                        notify = true
                     }
                  }
                  if (chatChanel == "inbox") {
                     return <Card onClick={() => {
                        initialLoad.current = true
                        setChat(item)
                     }} className="mb-2 p-2 card-hover2 border-primary" style={{ borderRadius: "8px", marginTop: "18px", border: "1px solid #ddd", position: "relative", background: chat && chat.cid == item.cid ? "#f5e8ff" : "" }}>
                        {notify &&
                           <div style={{ color: "white", borderRadius: "50%", width: "13px", height: "13px", background: "red", position: "absolute", top: "-3px", right: "-1px", zIndex: "100" }}></div>}
                        <div className="d-flex align-items-center">
                           <div className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center"
                              style={{ width: "40px", height: "40px", fontWeight: "bold" }}>
                              {item.avatar ? <img src={item.avatar} style={{ width: "40px", height: "40px", borderRadius: "50%" }} /> : "B"}
                           </div>
                           <div className="ms-2">
                              <div style={{ display: "flex", justifyContent: "space-between", }}>
                                 <div className="fw-bold">{item.name ? item.name : "Bot"}</div>

                              </div>
                              <small className="text-muted" style={{ textTransform: "capitalize" }}>{item.platform}</small>
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
                  }
                  if (chatChanel == item.platform) {
                     return <Card onClick={() => {
                        initialLoad.current = true
                        setChat(item)
                     }} className="mb-2 p-2 card-hover2 border-primary" style={{ borderRadius: "8px", marginTop: "18px", border: "1px solid #ddd", position: "relative", background: chat && chat.cid == item.cid ? "#f5e8ff" : "" }}>
                        {notify &&
                           <div style={{ color: "white", borderRadius: "50%", width: "13px", height: "13px", background: "red", position: "absolute", top: "-3px", right: "-1px", zIndex: "100" }}></div>}
                        <div className="d-flex align-items-center">
                           <div className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center"
                              style={{ width: "40px", height: "40px", fontWeight: "bold" }}>
                              B
                           </div>
                           <div className="ms-2">
                              <div style={{ display: "flex", justifyContent: "space-between", }}>
                                 <div className="fw-bold">Bot</div>

                              </div>
                              <small className="text-muted" style={{ textTransform: "capitalize" }}>{item.platform}</small>
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
                  }
               })}
               </>
            }

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

import { FiPaperclip } from "react-icons/fi"; // Sửa FiLink thành FiPaperclip



function ChatUI({ chat, setChatBot, botChat, initialLoad }) {
   const [messages, setMessages] = useState(chat && chat.messages ? chat.messages : []);
   const { id } = useParams();
   const [newMessage, setNewMessage] = useState("");
   const [show, setShow] = useState(false);
   const [unreadCount, setUnreadCount] = useState(0);
   const fileInputRef = useRef(null);
   const chatRef = useRef(null);
   const lastScrollTop = useRef(0);
   const [loading, setLoading] = useState(false);
   const [selectedFile, setSelectedFile] = useState(null); // State để lưu file được chọn
   const [filePreview, setFilePreview] = useState(null); // State để lưu URL preview của file
   const [loadingSend, setLoadingSend] = useState(false);

   // Tính số tin nhắn chưa đọc và cuộn xuống cuối khi khởi tạo
   useEffect(() => {
      if (chat && chat.messages) {
         const updatedMessages = chat.messages.map((msg) => ({
            ...msg,
            isRead: msg.isRead || false,
         }));
         setMessages(updatedMessages);
         const unread = updatedMessages.filter((msg) => !msg.isRead).length;
         setUnreadCount(unread);

         if (initialLoad.current && chatRef.current) {
            setLoading(true);
            setTimeout(() => {
               chatRef.current.scrollTop = chatRef.current.scrollHeight;
               setLoading(false);
               initialLoad.current = false;
            }, 300);
         }
      }
   }, [chat]);

   // Xử lý cuộn và đánh dấu đã đọc
   useEffect(() => {
      const chatElement = chatRef.current;
      if (!chatElement) return;

      const handleScroll = () => {
         const { scrollTop, scrollHeight, clientHeight } = chatElement;
         lastScrollTop.current = scrollTop;

         if (messages.filter((item) => !item.isRead)[0]) {
            if (scrollTop + clientHeight >= scrollHeight - 5) {
               const updatedMessages = messages.map((msg) => ({
                  ...msg,
                  isRead: true,
               }));

               setChatBot(
                  botChat.map((item) => {
                     if (item.cid === chat.cid) {
                        return {
                           ...item,
                           messages: updatedMessages,
                        };
                     }
                     return item;
                  })
               );
               if (localStorage.getItem("notify_chat")) {
                  localStorage.setItem(
                     "notify_chat",
                     JSON.stringify(
                        JSON.parse(localStorage.getItem("notify_chat")).filter(
                           (item) => item !== chat.cid
                        )
                     )
                  );
               }
               setUnreadCount(0);
            }
         }
      };

      chatElement.addEventListener("scroll", handleScroll);
      return () => chatElement.removeEventListener("scroll", handleScroll);
   }, [messages]);

   // Hàm xử lý khi chọn file
   const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const fileUrl = URL.createObjectURL(file);
         const fileType = file.type.split("/")[0];
         setSelectedFile(file);
         setFilePreview({ type: fileType, url: fileUrl });
      }
   };

   // Hàm xóa file preview
   const removeFilePreview = () => {
      setSelectedFile(null);
      setFilePreview(null);
      fileInputRef.current.value = "";
   };

   // Hàm gửi tin nhắn và file lên server
   const handleSendMessage = async (e) => {
      e.preventDefault();
      setLoadingSend(true)
      if (!newMessage.trim() && !selectedFile) return;

      const newMsg = {
         content: newMessage || "",
         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
         role: "user",
         isRead: false,
      };

      let fileBase64 = "";
      if (selectedFile) {
         fileBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result); // Giữ nguyên chuỗi base64 với prefix
            reader.readAsDataURL(selectedFile);
         });

         const fileType = selectedFile.type.split("/")[0];
         if (fileType === "image") {
            newMsg.image = URL.createObjectURL(selectedFile);
         } else if (fileType === "video") {
            newMsg.video = URL.createObjectURL(selectedFile);
         }
      }

      // const updatedMessages = [...messages, newMsg];
      // setMessages(updatedMessages);

      // Cập nhật số tin nhắn chưa đọc nếu không ở cuối
      if (chatRef.current.scrollTop + chatRef.current.clientHeight < chatRef.current.scrollHeight - 50) {
         setUnreadCount((prev) => prev + 1);
      }

      // setNewMessage("");
      // setSelectedFile(null);
      // setFilePreview(null);
      // fileInputRef.current.value = "";

      // Gửi dữ liệu lên server (giả sử botChatMakeDemo là API để gửi tin nhắn)
      const payload = {
         content: newMessage || "",
         platform: "messenger", // Theo body bạn cung cấp
         file_raw: fileBase64 || "", // Chuỗi base64 với prefix nếu có file
      };

      try {
         const response = await replyChatMake(id, payload, chat.cid)

         if (response && Object.keys(response).length > 0) {
            setNewMessage("");
            setSelectedFile(null);
            setFilePreview(null);
            fileInputRef.current.value = "";
            // const serverMsg = {
            //    content: response.content || "Tin nhắn đã được gửi!",
            //    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            //    role: "assistant",
            //    isRead: false,
            // };
            // setMessages((prevMessages) => [...prevMessages, serverMsg]);
         } else {
            toast.error("Failed to send message.");
         }
      } catch (error) {
         console.error("Error sending message:", error);
         toast.error("Error sending message.");
      }
      setLoadingSend(false)
   };

   const triggerFileInput = () => {
      fileInputRef.current.click();
   };

   const handleShow = () => setShow(true);
   const handleClose = () => setShow(false);

   return (
      <>
         {!chat && (
            <div style={{ width: "68%" }}>
               <Row>
                  <Col md={12}>
                     <Card
                        className="mb-3"
                        style={{
                           background: "#f5f5f9",
                           height: "77vh",
                           display: "flex",
                           justifyContent: "center",
                           alignItems: "center",
                        }}
                     >
                        <div
                           style={{
                              display: "flex",
                              justifyContent: "center",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "15px",
                           }}
                        >
                           <img src={nochat} alt="" />
                           <h5 style={{ fontWeight: "bold" }}>Cuộc hội thoại sẽ xuất hiện ở đây</h5>
                        </div>
                     </Card>
                  </Col>
               </Row>
            </div>
         )}

         {chat && (
            <div style={{ width: "68%" }}>
               <Row>
                  <Col md={12}>
                     <Card
                        className="mb-3"
                        style={{ background: "#f5f5f9", height: "77vh", position: "relative" }}
                     >
                        {loading && (
                           <div
                              className="d-flex justify-content-center align-items-center"
                              style={{
                                 position: "absolute",
                                 width: "100%",
                                 height: "100%",
                                 background: "white",
                                 zIndex: 1,
                                 borderRadius: "10px",
                              }}
                           >
                              <Spinner animation="border" variant="primary" />
                           </div>
                        )}
                        <Card.Header
                           style={{ background: "white", padding: "10px 20px" }}
                           className="d-flex justify-content-between align-items-center"
                        >
                           <div style={{ display: "flex", gap: "10px" }}>
                              <div>
                                 <div
                                    className="rounded-circle bg-warning text-dark d-flex justify-content-center align-items-center"
                                    style={{ width: "40px", height: "40px", fontWeight: "bold" }}
                                 >
                                    {chat.avatar ? (
                                       <img
                                          src={chat.avatar}
                                          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                                       />
                                    ) : (
                                       "B"
                                    )}
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
                                    {chat.name ? chat.name : "Bot"} <FiTag />
                                 </strong>
                                 <p style={{ fontSize: "13px", textTransform: "capitalize" }}>
                                    {chat.platform}
                                 </p>
                              </div>
                           </div>
                           <div className="d-flex align-items-center gap-2">
                              {unreadCount > 0 && <Badge bg="danger">{unreadCount} chưa đọc</Badge>}
                              <AutoReplyToggle botChat={botChat} chat={chat} setChatBot={setChatBot} />
                              <FiAlertCircle
                                 style={{ cursor: "pointer" }}
                                 size={23}
                                 onClick={handleShow}
                              />
                           </div>
                        </Card.Header>
                        <Card.Body
                           ref={chatRef}
                           style={{ height: "55vh", overflowY: "auto", transition: "1s" }}
                        >
                           {messages.map((msg, index) => (
                              <div
                                 key={index}
                                 className={`d-flex mb-2 mt-1 ${msg.role === "assistant" || msg.role !== "user"
                                    ? "justify-content-end"
                                    : "justify-content-start"
                                    }`}
                              >
                                 <div
                                    className={`p-2 rounded ${msg.role === "user" ? "bg-primary text-white" : "bg-white"
                                       }`}
                                    style={{
                                       maxWidth: "70%",
                                       opacity: msg.isRead ? 1 : 0.7,
                                    }}
                                 >
                                    {msg.content && msg.role !== "system" && (
                                       <p className="mb-0">{msg.content}</p>
                                    )}
                                    {msg.file_url && (
                                       <img
                                          src={msg.file_url}
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
                                    <small>{msg.time}</small>
                                 </div>
                              </div>
                           ))}
                        </Card.Body>
                        <Card.Footer
                           style={{ background: "white", display: chat.active == false ? "block" : "none" }}
                        >
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
                                          top: "-10px",
                                          right: "-5px",
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
                                    onClick={triggerFileInput}
                                    style={{
                                       border: "1px solid #ccc",


                                    }}
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
                                    variant="primary"
                                    type="submit"
                                    disabled={!newMessage && !selectedFile}
                                 >
                                    {loadingSend ? (
                                       <Spinner
                                          as="span"
                                          animation="border"
                                          size="sm"
                                          role="status"
                                          aria-hidden="true"
                                       />
                                    ) : (
                                       <FiSend />
                                    )}
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
            </div>
         )}
      </>
   );
}



import { OverlayTrigger, Popover } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { botChatActive, replyChatMake } from '../../services/chat_all';


const AutoReplyToggle = ({ chat, setChatBot, botChat }) => {
   console.log("Auto complate", chat)
   const [loading, setLoading] = useState(false);
   const [isAutoReplyOn, setIsAutoReplyOn] = useState(false);
   const { id } = useParams();
   useEffect(() => {
      if (chat) {
         setIsAutoReplyOn(chat.active)
      }
   }, [chat])

   const toggleAutoReply = async () => {
      setLoading(true)
      try {
         let result = await botChatActive(id, { active: !isAutoReplyOn }, chat.cid)
         if (result && (result.active == true || result.active == false)) {
            setIsAutoReplyOn(result.active)
            setChatBot(botChat.map((item) => {
               if (item.cid == result.cid) {
                  return { ...item, active: result.active }
               }
               return item
            }))
            toast.success(`Auto reply ${!isAutoReplyOn == true ? "ON" : "OFF"} Thành công`)
         } else {
            toast.warning(`Auto reply ${!isAutoReplyOn == true ? "ON" : "OFF"} Thất bại`)
         }

      } catch (error) {
         console.log(error)
      }
      setLoading(false)
   };

   const popover = (
      <Popover id="auto-reply-popover">
         <Popover.Body>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
               <strong>Auto-reply</strong>
               {loading ? <Spinner size='20' color='blue' /> :
                  <Form.Check
                     type="switch"
                     id="auto-reply-switch"
                     label=""
                     checked={isAutoReplyOn}
                     onChange={toggleAutoReply}
                  />}
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




const ChatComponent = ({ messages, chat }) => {
   const chatRef = useRef(null);


   useEffect(() => {
      if (chatRef.current) {
         chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
   }, [messages]);
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
                  {/* <small>{msg.created ? msg.created.split("T")[1].split(":").slice(0, 2).join(":") : ""}</small> */}
               </div>
            </div>
         ))}
      </Card.Body>
   );
};





