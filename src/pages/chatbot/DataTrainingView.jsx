import React, { useEffect, useState } from 'react';
import Sidebar from './SideBar';
import {
   Table,
   Button,
   Form,
   Container,
   Row,
   Col,
   Pagination,
   Modal,
   Offcanvas,
   Spinner,
} from "react-bootstrap";
import {
   FaEdit,
   FaSortAmountDownAlt,
   FaSortAmountUp,
   FaTrash,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { createQuestion, deleteQuestion, updateQuestion, trainQuestion, getStatusQuestion } from '../../services/questions';

const DataTrainingView = ({ products, setProducts, setLoading, getProduct }) => {
   return (
      <div style={{ display: "flex" }}>
         <Sidebar />
         <div style={{ width: "75%", background: "white", borderBottomRightRadius: "10px", borderTopRightRadius: "10px", paddingTop: "20px", height: "77vh", overflowY: "scroll" }}>
            <DataTrainingViewRight
               products={products}
               getProduct={getProduct}
               setLoading={setLoading}
               setProducts={setProducts}
            />
         </div>
      </div>
   );
};

function DataTrainingViewRight({ products, setProducts, setLoading, getProduct }) {
   const [importFaq, setImportFaq] = useState(false);
   const [createFaq, setCreateFaq] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage, setItemsPerPage] = useState(5);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [productToDelete, setProductToDelete] = useState(null);
   const [productToUpdate, setProductToUpdate] = useState(null);
   const [isTraining, setIsTraining] = useState(false); // Trạng thái loading cho nút Huấn luyện
   const { id } = useParams();

   const handleConfirmDelete = (productId) => {
      setProductToDelete(productId);
      setShowDeleteModal(true);
   };

   const handleDelete = async () => {
      if (!productToDelete) return;

      try {
         setLoading(true);
         const response = await deleteQuestion(id, productToDelete);

         if (response && response.message) {
            toast.success(response.message);
         }
         await getProduct();
      } catch (err) {
         console.error(err);
         toast.error("Lỗi khi xóa sản phẩm");
      } finally {
         setLoading(false);
         setShowDeleteModal(false);
         setProductToDelete(null);
      }
   };

   const handleTrain = async () => {
      setIsTraining(true);
      try {
         const response = await trainQuestion(id);
         if (response && response.train_status) {
            toast.info("Đã bắt đầu huấn luyện");
            // Bắt đầu kiểm tra trạng thái huấn luyện
            const intervalId = setInterval(async () => {
               try {
                  const statusResponse = await getStatusQuestion(id);
                  if (statusResponse.train_status === "succeeded") {
                     clearInterval(intervalId);
                     setIsTraining(false);
                     toast.success("Huấn luyện hoàn tất!");
                  } else if (statusResponse.detail) {
                     clearInterval(intervalId);
                     setIsTraining(false);
                     toast.error(statusResponse.message || "Huấn luyện thất bại");
                  }
               } catch (err) {
                  clearInterval(intervalId);
                  setIsTraining(false);
                  console.error("Error checking train status:", err);
                  toast.error("Lỗi khi kiểm tra trạng thái huấn luyện");
               }
            }, 10000); // Kiểm tra mỗi 2 giây
         } else {
            toast.info(response.detail);
            throw new Error("Không thể bắt đầu huấn luyện");
         }
      } catch (err) {
         setIsTraining(false);
         console.error("Error starting training:", err);
         toast.error("Lỗi khi bắt đầu huấn luyện");
      }
   };

   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
   const totalPages = Math.ceil(products.length / itemsPerPage);

   const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const handleItemsPerPageChange = (e) => {
      setItemsPerPage(parseInt(e.target.value));
      setCurrentPage(1);
   };

   return (
      <Container className="mt-2">
         {/* Header */}
         <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Dữ liệu huấn luyện</h4>
            <Row className="mb-3">
               <Col className="text-end">
                  <span style={{ paddingRight: "10px" }}>Sắp xếp theo</span>
                  <Button
                     onClick={() =>
                        setProducts(
                           [...products].sort((a, b) => new Date(b.created) - new Date(a.created))
                        )
                     }
                     variant="outline-secondary"
                     style={{ fontSize: "13px", padding: "5px 7px" }}
                     className="me-2"
                  >
                     Mới nhất <FaSortAmountUp style={{ marginTop: "-3px", marginLeft: "3px" }} />
                  </Button>
                  <Button
                     onClick={() =>
                        setProducts(
                           [...products].sort((a, b) => new Date(a.created) - new Date(b.created))
                        )
                     }
                     variant="outline-secondary"
                     style={{ fontSize: "13px", padding: "5px 7px" }}
                  >
                     Cũ nhất <FaSortAmountDownAlt style={{ marginTop: "-3px", marginLeft: "3px" }} />
                  </Button>
               </Col>
            </Row>
         </div>

         {/* Thêm sản phẩm */}
         <div
            style={{
               display: "flex",
               justifyContent: "end",
               alignItems: "center",
               marginBottom: "20px",
            }}
         >
            <div>
               <h6 style={{ margin: 0, marginRight: "10px" }}>Tôi phải thêm câu hỏi bằng cách nào?</h6>
            </div>
            <div>
               <Button
                  variant="primary"
                  onClick={() => setCreateFaq(true)}
                  style={{ fontSize: "13px", padding: "5px 7px", marginRight: "10px" }}
               >
                  ADD FAQs
               </Button>
            </div>
            <div>
               <Button
                  variant="primary"
                  style={{ fontSize: "13px", padding: "5px 7px" }}
                  onClick={handleTrain}
                  disabled={isTraining}
               >
                  {isTraining ? (
                     <>
                        <Spinner
                           as="span"
                           animation="border"
                           size="sm"
                           role="status"
                           aria-hidden="true"
                           className="me-2"
                        />
                        Đang huấn luyện...
                     </>
                  ) : (
                     "Huấn luyện"
                  )}
               </Button>
            </div>
         </div>

         {/* Bảng sản phẩm */}
         <Table bordered hover style={{ fontSize: "13px" }}>
            <thead>
               <tr>
                  <th>Câu hỏi</th>
                  <th>Trả lời</th>
                  <th>Trạng thái</th>
                  <th>Hoạt động</th>
               </tr>
            </thead>
            <tbody>
               {currentItems.map((faq) => (
                  <tr key={faq.id}>
                     <td>{faq.question}</td>
                     <td>{faq.answer}</td>
                     <td>{faq.status ? "Hoạt động" : "Không hoạt động"}</td>
                     <td>
                        <Button
                           variant="link"
                           onClick={() => {
                              setCreateFaq(true);
                              setProductToUpdate(faq);
                           }}
                           className="text-primary"
                        >
                           <FaEdit />
                        </Button>
                        <Button
                           variant="link"
                           className="text-danger"
                           onClick={() => handleConfirmDelete(faq.id)}
                        >
                           <FaTrash />
                        </Button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </Table>

         {/* Phân trang */}
         <div
            style={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               marginTop: "20px",
            }}
         >
            <Form.Select
               value={itemsPerPage}
               onChange={handleItemsPerPageChange}
               style={{ width: "auto" }}
            >
               <option value={5}>5</option>
               <option value={10}>10</option>
               <option value={20} > 20</option>
               <option value={50}>50</option>
            </Form.Select>

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

         {/* Offcanvas thêm sản phẩm */}
         <CreateProductOffcanvas
            getProduct={getProduct}
            setLoading={setLoading}
            show={createFaq}
            setShow={setCreateFaq}
            productToUpdate={productToUpdate}
            setProductToUpdate={setProductToUpdate}
         />

         {/* Modal xác nhận xóa */}
         <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
            <Modal.Header closeButton>
               <Modal.Title>Xác nhận xóa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p>Bạn có chắc chắn muốn xóa không?</p>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Hủy
               </Button>
               <Button variant="danger" onClick={handleDelete}>
                  Xóa
               </Button>
            </Modal.Footer>
         </Modal>
      </Container>
   );
}

const CreateProductOffcanvas = ({ show, setShow, setLoading, getProduct, productToUpdate, setProductToUpdate }) => {
   const { id } = useParams();
   const [formData, setFormData] = useState({
      question: '',
      answer: '',
      status: '1',
   });

   useEffect(() => {
      if (productToUpdate) {
         setFormData({ ...productToUpdate, status: productToUpdate?.status ? '1' : '2' });
      }
   }, [productToUpdate]);

   const handleClose = () => {
      setProductToUpdate(null);
      setShow(false);
      setFormData({
         question: '',
         answer: '',
         status: '1',
      });
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
         ...formData,
         [name]: value,
      });
   };

   const handleSave = async () => {
      setLoading(true);
      if (!formData.question || !formData.answer) {
         toast.error("Vui lòng điền đầy đủ.");
         setLoading(false);
         return;
      }
      try {
         let result;
         if (productToUpdate) {
            result = await updateQuestion(id, formData.id, { ...formData, status: formData.status === '1' });
         } else {
            result = await createQuestion(id, { ...formData, status: formData.status === '1' });
         }

         if (result && result.message) {
            toast.success(result.message);
            setProductToUpdate(null);
            await getProduct();
         }
      } catch (error) {
         console.error(error);
         toast.error("Lỗi khi lưu câu hỏi");
      } finally {
         handleClose();
         setLoading(false);
      }
   };

   return (
      <Offcanvas show={show} onHide={handleClose} placement="end">
         <Offcanvas.Header closeButton>
            <Offcanvas.Title>Tạo FAQs</Offcanvas.Title>
         </Offcanvas.Header>
         <Offcanvas.Body>
            <Form>
               <Form.Group controlId="formStatus" className="mb-3 d-flex align-items-center">
                  <Form.Label className="me-3">Trạng thái</Form.Label>
                  <Form.Select
                     name="status"
                     value={formData.status}
                     onChange={handleChange}
                     style={{ width: 'auto' }}
                  >
                     <option value="1">Hoạt động</option>
                     <option value="2">Không hoạt động</option>
                  </Form.Select>
               </Form.Group>

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
   );
};

export default DataTrainingView;