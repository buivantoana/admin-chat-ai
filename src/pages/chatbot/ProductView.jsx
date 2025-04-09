import React, { useEffect } from "react";
import Sidebar from "./SideBar";

const ProductView = ({ products, setProducts,setLoading,getProduct }) => {
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
        <DataTrainingViewRight products={products} getProduct={getProduct} setLoading={setLoading} setProducts={setProducts} />
      </div>
    </div>
  );
};

export default ProductView;

import { useState } from "react";
import {
  Table,
  Button,
  Form,
  Container,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import {
  FaEdit,
  FaSortAmountDownAlt,
  FaSortAmountUp,
  FaTrash,
} from "react-icons/fa";

function DataTrainingViewRight({ products, setProducts, setLoading, getProduct }) {
  const [importFaq, setImportFaq] = useState(false);
  const [createFaq, setCreateFaq] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToUpdate, setProductToUpdate] = useState(null);

  const handleConfirmDelete = (productId) => {
    setProductToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    console.log(productToDelete)
    try {
      setLoading(true);
      const response = await deleteProduct(id,productToDelete)

     if(response && response.message){
      toast.success(response.message)
     }
      await getProduct();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa sản phẩm");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const handleEditFAQ = (id) => {
    alert(`Chỉnh sửa FAQ với ID: ${id}`);
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
        <h4>Danh sách sản phẩm</h4>
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
        <Button
          variant="primary"
          onClick={() => setCreateFaq(true)}
          style={{ fontSize: "13px", padding: "5px 7px" }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      {/* Bảng sản phẩm */}
      <Table bordered hover style={{ fontSize: "13px" }}>
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Tên</th>
            <th>Danh mục</th>
            <th>Giới tính</th>
            <th>Giá</th>
            <th>Hoạt động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((faq) => (
            <tr key={faq.uid}>
              <td>{faq.name}</td>
              <td>{faq.category}</td>
              <td>{faq.gender}</td>
              <td>{faq.price.toLocaleString("vi-VN")} VND</td>
              <td>
                <Button
                  variant="link"
                  onClick={() => {
                    setCreateFaq(true)
                    setProductToUpdate(faq)
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
          <option value={5}>5 </option>
          <option value={10}>10 </option>
          <option value={20}>20 </option>
          <option value={50}>50 </option>
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
      />

      {/* Modal xác nhận xóa */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
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

import { Modal } from "react-bootstrap";



import { Offcanvas } from "react-bootstrap";
import { createProduct, deleteProduct, updateProduct } from "../../services/product";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Đảm bảo bạn đã cài đặt và import Bootstrap CSS

const CreateProductOffcanvas = ({ show, setShow,setLoading,getProduct,productToUpdate }) => {
   const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    gender: "male",
    price: 0,
    category: "",
    link: "",
    features: "",
    description: "",
    bot: ""
  });
  useEffect(()=>{
    if(productToUpdate){
      setFormData(productToUpdate)
    }
  },[productToUpdate])
  const handleClose = () => {
    setShow(false);
    setFormData({
      name: "",
      gender: "male",
      price: 0,
      category: "",
      link: "",
      features: "",
      description: "",
      bot: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu là input number (price), ép kiểu số
    setFormData({
      ...formData,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  const handleSave = async() => {
    setLoading(true)
    if (!formData.name ) {
      alert("Vui lòng điền đầy đủ tên sản phẩm và bot.");
      return;
    }
    try {
      let result
      if(updateProduct){
        result = await updateProduct(id,formData.id,formData)
      }else{
        result = await createProduct(id,formData)
      }
      
      if(result && result.message){
        toast.success(result.message)
        getProduct()
      }
    } catch (error) {
      console.log(error)
    }
    handleClose();
    setLoading(false)
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Tạo sản phẩm</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên sản phẩm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="">Không xác định</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Nhập giá"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Nhập danh mục"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Đặc điểm</Form.Label>
              <Form.Control
                as="textarea"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="Mô tả đặc điểm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả chi tiết</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Chi tiết sản phẩm..."
              />
            </Form.Group>

          </Form>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="outline-secondary" onClick={handleClose} className="me-2">
              Thoát
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Lưu sản phẩm
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

