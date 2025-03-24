import React, { useState } from "react";
import { Button, Card, Container, Dropdown, Modal, ToggleButton } from "react-bootstrap";
import { FiGrid, FiImage, FiList, FiSettings, FiTrash2 } from "react-icons/fi";


const ChatBotView = () => {
   const [view, setView] = useState("grid");
   const [show, setShow] = useState(false);
   const [createChatBot, setCreateChatBot] = useState(false);
   const navigate = useNavigate()
   const handleNavigate = () => {
      navigate("/overview")
   }

   const handleShow = () => setShow(true);
   const handleClose = () => setShow(false);

   return (
      <Container className="" style={{ background: "white", borderRadius: "10px", padding: "20px 20px", height: "75vh" }}>
         <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>
               <i className="bi bi-robot"></i> Đào tạo chatbot
            </h4>
            <div>
               <Button variant={view == "grid" ? "secondary" : "light"} className="me-2" onClick={() => setView("grid")}>
                  <FiGrid size={20} />
               </Button>
               <Button variant={view == "list" ? "secondary" : "light"} className="me-2" onClick={() => setView("list")}>
                  <FiList size={20} />
               </Button>
               <Button onClick={() => setCreateChatBot(true)} variant="primary">+ Tạo chatbot</Button>
            </div>
         </div>

         {view === "grid" ? (
            <div className="row">
               <div className="col-md-4">
                  <Card className="border-primary" style={{ cursor: "pointer", border: "1px solid #ddd" }}>
                     <Card.Body>
                        <div className="d-flex align-items-center" onClick={handleNavigate}>
                           <img
                              src="https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
                              width={50}
                              height={50}
                              className="rounded-circle me-2"
                              alt="avatar"
                           />
                           <div>
                              <strong>bot-demo</strong>
                              <div className="text-muted">Cập nhật 21/03/25 - 11:03 AM</div>
                           </div>
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                           <Button variant="outline-dark" size="sm" className="me-2">
                              <FiSettings />
                           </Button>
                           <Button variant="outline-danger" onClick={handleShow} size="sm">
                              <FiTrash2 />

                           </Button>
                        </div>
                     </Card.Body>
                  </Card>
               </div>
            </div>
         ) : (
            <table style={{ background: "white", borderRadius: "10px", boxShadow: "0 2px 6px 0 rgba(67, 89, 113, 0.12)", cursor: "pointer" }} className="table">
               <thead>
                  <tr>
                     <th>Tên</th>
                     <th>Cập nhật ngày</th>
                     <th>Hoạt động</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td onClick={handleNavigate}>
                        <img
                           src="https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
                           width={50}
                           height={50}
                           className="rounded-circle me-2"
                           alt="avatar"
                        />
                        bot-demo
                     </td>
                     <td>21/03/2025 11:28 AM</td>
                     <td>
                        <Button variant="outline-dark" size="sm" className="me-2">
                           <FiSettings />
                        </Button>
                        <Button variant="outline-danger" onClick={handleShow} size="sm">
                           <FiTrash2 />

                        </Button>
                     </td>
                  </tr>
               </tbody>
            </table>
         )}

         <Modal show={show} onHide={handleClose} centered >
            <Modal.Header closeButton>
               <Modal.Title><b>Xóa bot</b></Modal.Title>
            </Modal.Header>

            <Modal.Body>
               <p>Bạn chắc chắn xóa <b>bot-demo</b> chứ ?</p>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>Hủy</Button>
               <Button variant="danger">Xóa</Button>
            </Modal.Footer>
         </Modal>
         <CreateChatbotModal show={createChatBot} setShow={setCreateChatBot} />
      </Container>
   );
};

export default ChatBotView;
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateChatbotModal = ({ show, setShow }) => {
   const handleClose = () => setShow(false);

   const defaultAvatars = [
      "https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png",

   ];

   const [avatars, setAvatars] = useState(defaultAvatars);
   const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0]); // Ảnh mặc định đầu tiên

   // Xử lý chọn ảnh đại diện
   const handleSelectAvatar = (avatar) => {
      setSelectedAvatar(avatar);
   };

   // Xử lý upload ảnh mới
   const handleUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
         const newAvatar = URL.createObjectURL(file);
         setAvatars((prev) => [newAvatar, ...prev]); // Thêm ảnh vào danh sách
         setSelectedAvatar(newAvatar); // Chọn ảnh vừa upload
      }
   };

   return (
      <>
         <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
               <Modal.Title>Tạo chatbot</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="row">
                  {/* Cột trái - Chi tiết bot */}
                  <div className="col-md-6">
                     <h5>Chi tiết bot</h5>

                     {/* Tên bot */}
                     <Form.Group className="mb-3">
                        <Form.Label>Tên bot</Form.Label>
                        <InputGroup>
                           <Form.Control placeholder="Chọn tên bot" maxLength={50} />
                           <InputGroup.Text>0/50</InputGroup.Text>
                        </InputGroup>
                     </Form.Group>

                     {/* Ảnh đại diện */}
                     <Form.Group className="mb-3">
                        <Form.Label>Ảnh đại diện</Form.Label>
                        <div className="d-flex align-items-center">
                           {/* Nút Upload ảnh */}
                           <label className="btn btn-light rounded-circle p-2 me-2" style={{ cursor: "pointer" }}>
                              <FiImage size={25} />
                              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
                           </label>

                           {/* Danh sách ảnh đại diện */}
                           {avatars.map((avatar, index) => (
                              <img
                                 key={index}
                                 src={avatar}
                                 alt="Avatar"
                                 className={`rounded-circle me-2 ${selectedAvatar === avatar ? "border border-primary" : ""}`}
                                 width={50}
                                 height={50}
                                 style={{ cursor: "pointer", objectFit: "cover" }}
                                 onClick={() => handleSelectAvatar(avatar)}
                              />
                           ))}
                        </div>
                     </Form.Group>

                     {/* Câu chào hỏi */}
                     <Form.Group className="mb-3">
                        <Form.Label>Câu chào hỏi</Form.Label>
                        <InputGroup>
                           <Form.Control placeholder="👋 Hello! How can I help you today?" maxLength={200} />
                           <InputGroup.Text>0/200</InputGroup.Text>
                        </InputGroup>
                     </Form.Group>

                     {/* Danh sách ngành nghề */}
                     <Form.Group className="mb-3">
                        <Form.Label>Danh sách ngành nghề</Form.Label>
                        <Form.Select>
                           <option>Lựa chọn ngành nghề</option>
                           <option>Ngành A</option>
                           <option>Ngành B</option>
                        </Form.Select>
                     </Form.Group>
                  </div>

                  {/* Cột phải - Kịch bản mẫu */}
                  <div className="col-md-6">
                     <h5>Kịch bản mẫu</h5>
                     <div className="p-3 bg-light border rounded">
                        <p className="text-muted">
                           Preny cung cấp kịch bản mẫu tối ưu cho từng ngành nghề, giúp bạn dễ dàng chốt sales với các câu hỏi phổ biến nhất.
                           Bạn có thể sử dụng ngay bằng việc tích chọn kịch bản sẵn, tùy chỉnh hoặc tự tạo kịch bản riêng tại mục
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
               <Button variant="primary">Lưu</Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};


