import React, { useState } from 'react';
import { Button, Container, Form, Pagination, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

const StaffView = ({ staff, setShowModal }) => {


   // State cho phân trang
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(5); // Mặc định 10 item mỗi trang

   // Hàm xóa FAQ


   // Hàm chỉnh sửa FAQ
   const handleEditFAQ = (id) => {
      alert(`Chỉnh sửa FAQ với ID: ${id}`);
   };

   // Tính toán phân trang
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = staff.slice(indexOfFirstItem, indexOfLastItem);
   const totalPages = Math.ceil(staff.length / itemsPerPage);

   // Hàm thay đổi trang
   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   // Hàm thay đổi số lượng item mỗi trang
   const handleItemsPerPageChange = (e) => {
      setItemsPerPage(parseInt(e.target.value));
      setCurrentPage(1); // Reset về trang 1 khi thay đổi số lượng item
   };

   return (
      <Container className="mt-2" style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
         {/* Phần header giữ nguyên */}

         {/* Phần FAQ header giữ nguyên */}
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
               <h4>Danh sách nhân viên</h4>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
               <div>
                  <Button onClick={() => setShowModal(true)} variant="primary" style={{ fontSize: "13px", padding: "5px 7px" }}>
                     Thêm nhân viên
                  </Button>
               </div>
            </div>
         </div>

         {/* Bảng FAQ với dữ liệu đã phân trang */}
         <Table bordered hover>
            <thead>
               <tr>

                  <th>Email</th>
                  <th>Vai trò</th>

                  <th>Hoạt động</th>
               </tr>
            </thead>
            <tbody>
               {currentItems.map((faq) => (
                  <tr key={faq.uid}>
                     <td>{faq.email}</td>
                     <td>{faq.role}</td>
                     <td>
                        <Button variant="link" onClick={() => handleEditFAQ(faq.id)} className="text-primary">
                           <FaEdit />
                        </Button>
                        <Button variant="link" className="text-danger">
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

      </Container>
   );
}

export default StaffView


