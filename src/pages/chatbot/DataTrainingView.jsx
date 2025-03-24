import React from 'react'
import Sidebar from './SideBar'

const DataTrainingView = () => {
   return (
      <div style={{ display: "flex" }}><Sidebar />
         <div style={{ width: "75%", background: "white", borderBottomRightRadius: "10px", borderTopRightRadius: "10px", paddingTop: "20px", height: "77vh", overflowY: "scroll" }}>
            <DataTrainingViewRight />
         </div>
      </div>
   )
}

export default DataTrainingView

import { useState } from 'react';
import { Table, Button, Form, Container, Row, Col, Pagination } from 'react-bootstrap';
import { FaEdit, FaSortAmountDownAlt, FaSortAmountUp, FaTrash } from 'react-icons/fa';


function DataTrainingViewRight() {
   const [importFaq, setImportFaq] = useState(false);
   const [createFaq, setCreateFaq] = useState(false);
   const [faqs, setFaqs] = useState([
      { id: 1, question: 'hello', answer: 'Xin chào', status: true },
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
      <Container className="mt-2">
         {/* Phần header giữ nguyên */}
         <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Dữ liệu huấn luyện</h4>
            <Row className="mb-3">
               <Col className="text-end">
                  <span style={{ paddingRight: "10px" }}>
                     Sắp xếp theo
                  </span>
                  <Button variant="outline-secondary" style={{ fontSize: "13px", padding: "5px 7px" }} className="me-2">
                     Mới nhất <FaSortAmountUp style={{ marginTop: "-3px", marginLeft: "3px" }} />
                  </Button>
                  <Button variant="outline-secondary" style={{ fontSize: "13px", padding: "5px 7px" }}>
                     Cũ nhất  <FaSortAmountDownAlt style={{ marginTop: "-3px", marginLeft: "3px" }} />
                  </Button>
               </Col>
            </Row>
         </div>

         {/* Phần FAQ header giữ nguyên */}
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
               <h6>FAQ ({faqs.length})</h6>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
               <div>
                  <h6 style={{ margin: 0 }}>Tôi phải thêm câu hỏi bằng cách nào?</h6>
               </div>
               <div>
                  <Button variant="primary" onClick={() => setImportFaq(true)} style={{ fontSize: "13px", padding: "5px 7px" }} className="me-2">
                     Import FAQs
                  </Button>
               </div>
               <div>
                  <Button variant="primary" onClick={() => setCreateFaq(true)} style={{ fontSize: "13px", padding: "5px 7px" }}>
                     ADD FAQs
                  </Button>
               </div>
               <div>
                  <Button variant="primary" style={{ fontSize: "13px", padding: "5px 7px" }}>
                     Huấn luyện
                  </Button>
               </div>
            </div>
         </div>

         {/* Bảng FAQ với dữ liệu đã phân trang */}
         <Table bordered hover style={{ borderRadius: "10px" }}>
            <thead>
               <tr>
                  <th><Form.Check type="checkbox" /></th>
                  <th>Câu hỏi</th>
                  <th>Trả lời</th>
                  <th>Trạng thái</th>
                  <th>Hoạt động</th>
               </tr>
            </thead>
            <tbody>
               {currentItems.map((faq) => (
                  <tr key={faq.id}>
                     <td><Form.Check type="checkbox" /></td>
                     <td>{faq.question}</td>
                     <td>{faq.answer}</td>
                     <td>
                        <span
                           className={`badge ${faq.status ? 'bg-success' : 'bg-danger'}`}
                           style={{ borderRadius: '50%', width: '20px', height: '20px' }}
                        >

                        </span>
                     </td>
                     <td>
                        <Button variant="link" onClick={() => handleEditFAQ(faq.id)} className="text-primary">
                           <FaEdit />
                        </Button>
                        <Button variant="link" onClick={() => handleDeleteFAQ(faq.id)} className="text-danger">
                           <FaTrash />
                        </Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </Table>

         {/* Phần phân trang */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <div>
               <Form.Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  style={{ width: 'auto', display: 'inline-block' }}
               >
                  <option value={5}>5 </option>
                  <option value={10}>10 </option>
                  <option value={20}>20 </option>
                  <option value={50}>50 </option>
               </Form.Select>
               {/* <span style={{ marginLeft: '10px' }}>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, faqs.length)} of {faqs.length} entries
               </span> */}
            </div>
            <Pagination>
               <Pagination.Prev
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
               />
               {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                     key={i + 1}
                     active={i + 1 === currentPage}
                     onClick={() => paginate(i + 1)}
                  >
                     {i + 1}
                  </Pagination.Item>
               ))}
               <Pagination.Next
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
               />
            </Pagination>
         </div>

         <ImportFAQModal show={importFaq} setShow={setImportFaq} />
         <CreateFAQOffcanvas show={createFaq} setShow={setCreateFaq} />
      </Container>
   );
}



import { Modal } from 'react-bootstrap';


const ImportFAQModal = ({ show, setShow }) => {

   const [selectedFile, setSelectedFile] = useState(null); // Trạng thái lưu file đã chọn

   // Hàm mở modal

   // Hàm đóng modal
   const handleClose = () => {
      setShow(false);
      setSelectedFile(null); // Reset file khi đóng modal
   };

   // Hàm xử lý khi người dùng chọn file
   const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
         // Kiểm tra định dạng file (chỉ cho phép .xls, .xlsx)
         const validFormats = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
         if (!validFormats.includes(file.type)) {
            alert('Vui lòng chọn file có định dạng .xls hoặc .xlsx');
            return;
         }

         // Kiểm tra kích thước file (giới hạn 100MB)
         const maxSize = 100 * 1024 * 1024; // 100MB in bytes
         if (file.size > maxSize) {
            alert('File không được vượt quá 100MB');
            return;
         }

         setSelectedFile(file);
      }
   };

   // Hàm xử lý khi nhấn nút "Nhập dữ liệu"
   const handleImport = () => {
      if (!selectedFile) {
         alert('Vui lòng chọn một file trước khi nhập dữ liệu');
         return;
      }

      // Logic xử lý file (ví dụ: gửi file lên server)
      console.log('File đã chọn:', selectedFile);
      // Ở đây bạn có thể thêm logic để gửi file lên server, ví dụ sử dụng FormData và fetch/axios
      /*
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      fetch('your-api-endpoint', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('Kết quả từ server:', data);
          handleClose(); // Đóng modal sau khi nhập dữ liệu thành công
        })
        .catch(error => {
          console.error('Lỗi khi nhập dữ liệu:', error);
        });
      */

      // Đóng modal sau khi xử lý (tạm thời)
      handleClose();
   };

   return (
      <>


         {/* Modal */}
         <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
               <Modal.Title>Import FAQs</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div className="text-center mb-3" style={{ border: "1px dashed #ddd", padding: "6px", borderRadius: "5px" }}>
                  <i className="bi bi-cloud-upload" style={{ fontSize: '2rem' }}></i>
                  <p>Tải tài liệu từ máy tính, chon, hoặc kéo thả</p>
                  <p>Cho phép các định dạng file: .xls, .xlsx</p>
                  <p>
                     Các định dạng tệp được chấp nhận bao gồm .xls, .xlsx. Tệp chứa tối đa 1000 dòng dữ liệu và không vượt quá 100MB
                  </p>
                  <Form.Group controlId="formFile" className="mb-3">
                     <Form.Control
                        type="file"
                        accept=".xls,.xlsx"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileInput"
                     />
                     <Button
                        variant="outline-primary"
                        onClick={() => document.getElementById('fileInput').click()}
                     >
                        Chọn tài liệu
                     </Button>
                  </Form.Group>


               </div>
               <p>
                  Vui lòng tải file mẫu: <a href="#">Tại đây</a>
               </p>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="outline-secondary" onClick={handleClose}>
                  Thoát
               </Button>
               <Button variant="primary" onClick={handleImport}>
                  Nhập dữ liệu
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};


import { Offcanvas } from 'react-bootstrap';

// Đảm bảo bạn đã cài đặt và import Bootstrap CSS

const CreateFAQOffcanvas = ({ show, setShow }) => {
   const [formData, setFormData] = useState({
      question: '',
      answer: '',
      status: 'Hoạt động', // Giá trị mặc định cho dropdown
   });
   // Hàm đóng Offcanvas
   const handleClose = () => {
      setShow(false);
      // Reset form khi đóng Offcanvas
      setFormData({
         question: '',
         answer: '',
         status: 'Hoạt động',
      });
   };

   // Hàm xử lý thay đổi giá trị trong form
   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });
   };

   // Hàm xử lý khi nhấn nút "Lưu câu hỏi"
   const handleSave = () => {
      if (!formData.question || !formData.answer) {
         alert('Vui lòng điền đầy đủ câu hỏi và câu trả lời');
         return;
      }

      // Logic lưu câu hỏi (ví dụ: gửi dữ liệu lên server)
      console.log('Dữ liệu FAQ:', formData);
      // Ở đây bạn có thể thêm logic để gửi dữ liệu lên server, ví dụ sử dụng fetch/axios
      /*
      fetch('your-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Kết quả từ server:', data);
          handleClose(); // Đóng Offcanvas sau khi lưu thành công
        })
        .catch(error => {
          console.error('Lỗi khi lưu câu hỏi:', error);
        });
      */

      // Đóng Offcanvas sau khi xử lý (tạm thời)
      handleClose();
   };

   return (
      <>
         <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
               <Offcanvas.Title>Tạo FAQs</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
               <Form>
                  {/* Trạng thái */}
                  <Form.Group controlId="formStatus" className="mb-3 d-flex align-items-center">
                     <Form.Label className="me-3">Trạng thái</Form.Label>
                     <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: 'auto' }}
                     >
                        <option value="Hoạt động">Hoạt động</option>
                        <option value="Thôi">Thôi</option>
                     </Form.Select>
                  </Form.Group>

                  {/* Dữ liệu huấn luyện */}
                  <Form.Group controlId="formQuestion" className="mb-3">
                     <Form.Label>Câu hỏi</Form.Label>
                     <div className="d-flex align-items-center">

                        <Form.Control
                           type="text"
                           name="question"
                           value={formData.question}
                           onChange={handleChange}
                           placeholder="Nhập câu hỏi"
                        />
                     </div>
                  </Form.Group>

                  {/* Câu trả lời */}
                  <Form.Group controlId="formAnswer" className="mb-3">
                     <Form.Label>Trả lời</Form.Label>
                     <Form.Control
                        as="textarea"
                        rows={3}
                        name="answer"
                        value={formData.answer}
                        onChange={handleChange}
                        placeholder="Nhập câu trả lời"
                     />
                  </Form.Group>
               </Form>

               {/* Nút điều khiển */}
               <div className="d-flex justify-content-end mt-4">
                  <Button variant="outline-secondary" onClick={handleClose} className="me-2">
                     Thoát
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                     Lưu câu hỏi
                  </Button>
               </div>
            </Offcanvas.Body>
         </Offcanvas>
      </>
   );
};

