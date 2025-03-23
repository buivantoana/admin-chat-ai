import React, { useState } from 'react'
import { Button, Col, Container, Form, Pagination, Row, Table } from 'react-bootstrap';
import { FaEdit, FaSortAmountDownAlt, FaSortAmountUp, FaTrash } from 'react-icons/fa';
import Sidebar from './SideBar';
import { FiSend } from 'react-icons/fi';

const ChatView = () => {
   const [isChat, setIsChat] = useState(false)
   const [faqs, setFaqs] = useState([
      { id: 1, name: 'Toản', role: 'admin', status: true },
   ]);

   // State cho phân trang
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(10); // Mặc định 10 item mỗi trang

   // Hàm xóa FAQ
   const handleDeleteFAQ = (id) => {
      setFaqs(faqs.filter((faq) => faq.id !== id));
   };

   // Hàm chỉnh sửa FAQ
   const handleEditFAQ = (id) => {
      alert(`Chỉnh sửa FAQ với ID: ${id}`);
   };

   // Tính toán phân trang
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = faqs.slice(indexOfFirstItem, indexOfLastItem);
   const totalPages = Math.ceil(faqs.length / itemsPerPage);

   // Hàm thay đổi trang
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   // Hàm thay đổi số lượng item mỗi trang
   const handleItemsPerPageChange = (e) => {
      setItemsPerPage(parseInt(e.target.value));
      setCurrentPage(1); // Reset về trang 1 khi thay đổi số lượng item
   };

   return (

      <div style={{ display: "flex" }}><Sidebar />
         <div style={{ width: "75%", background: "white", borderBottomRightRadius: "10px", borderTopRightRadius: "10px", paddingTop: "20px", height: "77vh", overflowY: "scroll" }}>
            {isChat ? <ChatMessage /> : <ChatForm setIsChat={setIsChat} />}

         </div>
      </div>

   );
}

export default ChatView




function ChatForm({ setIsChat }) {
   // State để lưu giá trị của các input
   const [fullName, setFullName] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');

   // Hàm xử lý khi nhấn nút "Bắt đầu"
   const handleSubmit = (e) => {
      e.preventDefault();
      setIsChat(true)
      console.log('Họ tên:', fullName);
      console.log('Số điện thoại:', phoneNumber);
      // Bạn có thể thêm logic gửi dữ liệu lên server tại đây
   };

   return (
      <Container className="mt-5">
         <h4 className="mb-4">Chat với bot</h4>
         <p className="text-muted mb-4">
            Vui lòng cung cấp một số thông tin sau đây để chúng tôi có thể hỗ trợ tốt hơn.
         </p>

         <Form onSubmit={handleSubmit} style={{ width: "50%" }}>
            {/* Trường Họ Tên */}
            <Form.Group className="mb-3" controlId="formFullName">
               <Form.Label>
                  Họ Tên <span className="text-danger">*</span>
               </Form.Label>
               <Form.Control
                  type="text"
                  placeholder="Nhập họ tên của bạn..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}

               />
            </Form.Group>

            {/* Trường Số Điện Thoại */}
            <Form.Group className="mb-3" controlId="formPhoneNumber">
               <Form.Label>
                  Số điện thoại <span className="text-danger">*</span>
               </Form.Label>
               <Form.Control
                  type="tel"
                  placeholder="Nhập số điện thoại của bạn..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}

               />
            </Form.Group>

            {/* Nút Bắt đầu */}
            <Button
               type="submit"
               style={{ borderColor: '#6f42c1' }}
            >
               Bắt đầu
            </Button>
         </Form>
      </Container>
   );
}




function ChatMessage() {
   const [messages, setMessages] = useState([
   ]);
   const [inputText, setInputText] = useState('');
   const [isBotTyping, setIsBotTyping] = useState(false); // Trạng thái để hiển thị hiệu ứng "đang nhập"

   const handleSendMessage = () => {
      if (inputText.trim() === '') return;

      const newMessage = {
         text: inputText,
         sender: 'user',
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...messages, newMessage]);
      setInputText('');

      // Hiển thị hiệu ứng "đang nhập" và giả lập phản hồi từ bot
      setIsBotTyping(true);
      setTimeout(() => {
         setIsBotTyping(false); // Ẩn hiệu ứng "đang nhập"
         setMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Được thôi!', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
         ]);
      }, 20000); // Bot "suy nghĩ" trong 2 giây
   };

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         handleSendMessage();
      }
   };

   return (
      <div className="container mt-3">
         <h5 className="mb-3">Chat với bot</h5>
         <div className="chat-box border rounded p-3 mb-3" style={{ height: '400px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
            {messages.map((message, index) => (
               <div
                  key={index}
                  className={`d-flex mb-2 ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
               >
                  {message.sender === 'bot' && (
                     <div className="me-2">
                        <img
                           src="https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
                           alt="Bot Avatar"
                           className="rounded-circle"
                           style={{ width: '30px', height: '30px' }}
                        />
                     </div>
                  )}
                  <div
                     className={`p-2 rounded ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-white text-black'}`}
                     style={{ maxWidth: '70%' }}
                  >
                     {message.text}
                     <div className="text-end small">{message.time}</div>
                  </div>
               </div>
            ))}
            {isBotTyping && (
               <div className="d-flex justify-content-start mb-2">
                  <div className="me-2">
                     <img
                        src="https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
                        alt="Bot Avatar"
                        className="rounded-circle"
                        style={{ width: '30px', height: '30px' }}
                     />
                  </div>
                  <div className="p-2 rounded ">
                     <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                     </div>
                  </div>
               </div>
            )}
         </div>
         <div className="input-group">
            <input
               type="text"
               className="form-control"
               placeholder="Nhập tin nhắn của bạn"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSendMessage}>
               <FiSend />
            </Button>
         </div>
      </div>
   );
}



