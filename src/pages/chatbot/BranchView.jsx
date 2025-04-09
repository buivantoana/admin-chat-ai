import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import {
  FaEdit,
  FaSortAmountDownAlt,
  FaSortAmountUp,
  FaTrash,
} from "react-icons/fa";
import Sidebar from "./SideBar";

const BranchView = ({ products, getAddress, setLoading }) => {
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Mặc định 10 item mỗi trang
  const [show, setShow] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addressToUpdate, setAddressToUpdate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Hàm xóa FAQ
  const { id } = useParams();
  // Hàm chỉnh sửa FAQ
  const handleConfirmDelete = (productId) => {
    setAddressToDelete(productId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!addressToDelete) return;

    console.log(addressToDelete)
    try {
      setLoading(true);
      const response = await deleteAddress(id, addressToDelete)

      if (response && response.message) {
        toast.success(response.message)
      }
      await getAddress();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa sản phẩm");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setAddressToDelete(null);
    }
  };

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Hàm thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm thay đổi số lượng item mỗi trang
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset về trang 1 khi thay đổi số lượng item
  };

  return (
    <div style={{ display: "flex" }}>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
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
        <Container className="mt-2">
          {/* Phần header giữ nguyên */}

          {/* Phần FAQ header giữ nguyên */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h4>Chi nhánh/cửa hàng</h4>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <div>
                <Button
                  onClick={() => setShow(true)}
                  variant="primary"
                  style={{ fontSize: "13px", padding: "5px 7px" }}
                >
                  Thêm chi nhánh/cửa hàng
                </Button>
              </div>
            </div>
          </div>

          {/* Bảng FAQ với dữ liệu đã phân trang */}
          <Table bordered hover style={{ fontSize: "13px" }}>
            <thead>
              <tr>
                <th style={{ fontSize: "13px", textTransform: "capitalize" }}>Tên</th>
                <th style={{ fontSize: "13px", textTransform: "capitalize" }}>SĐT</th>
                <th style={{ fontSize: "13px", textTransform: "capitalize", width: "30%" }}>Mô tả</th>
                <th style={{ fontSize: "13px", textTransform: "capitalize", width: "30%" }}>Địa chỉ</th>
                <th style={{ fontSize: "13px", textTransform: "capitalize" }}>Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((faq) => (
                <tr>
                  <td>{faq.name}</td>
                  <td>{faq.phone}</td>
                  <td>{faq.info}</td>
                  <td>{faq.address}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => {
                        setShow(true)
                        setAddressToUpdate(faq)
                      }}
                      className="text-primary"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {
                        handleConfirmDelete(faq.id)
                      }}
                      className="text-danger"
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Phần phân trang */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div>
              <Form.Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                style={{ width: "auto", display: "inline-block" }}
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
        <CreateAddressOffcanvas setLoading={setLoading} getAddress={getAddress} setAddressToUpdate={setAddressToUpdate} addressToUpdate={addressToUpdate} setShow={setShow} show={show} />
      </div>
    </div>
  );
};

export default BranchView;


import { useEffect } from "react"; // Added useState
import { Offcanvas } from "react-bootstrap"; // Added Form and Button
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from 'react-leaflet';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { createAddress, deleteAddress, updateAddress } from "../../services/address";

// Fix icon leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
});

const LocationPicker = ({ onLocationChange }) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng);
    }
  });
  return null;
};

const CreateAddressOffcanvas = ({ show, setShow, setLoading, getAddress, addressToUpdate, setAddressToUpdate }) => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    info: "",
    phone: "",
    address: "",
    lat: 21.0285,
    lon: 105.8542,
    created: new Date().toISOString()
  });

  useEffect(() => {
    if (addressToUpdate) {
      setFormData(addressToUpdate);
    }
  }, [addressToUpdate]);

  const handleClose = () => {
    setShow(false);
    setFormData({
      name: "",
      info: "",
      phone: "",
      address: "",
      lat: 21.0285,
      lon: 105.8542,
      created: new Date().toISOString()
    });
    setAddressToUpdate(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationChange = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      lat: latlng.lat,
      lon: latlng.lng,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    if (!formData.name || !formData.address) {
      toast.error("Vui lòng điền tên và địa chỉ."); // Changed to toast.error for better UX
      setLoading(false);
      return;
    }

    try {
      let result;
      if (addressToUpdate) {
        result = await updateAddress(id, formData.id, formData);
      } else {
        result = await createAddress(id, formData);
      }

      if (result && result.message) {
        toast.success(result.message);
        await getAddress();
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi lưu địa chỉ");
    } finally {
      handleClose();
      setLoading(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{addressToUpdate ? "Sửa địa chỉ" : "Tạo địa chỉ"}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên địa điểm</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên địa điểm"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Thông tin mô tả</Form.Label>
            <Form.Control
              as="textarea"
              name="info"
              value={formData.info}
              onChange={handleChange}
              placeholder="Thông tin chi tiết"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chọn vị trí trên bản đồ</Form.Label>
            <MapContainer
              center={[formData.lat, formData.lon]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onLocationChange={handleLocationChange} />
              <Marker position={[formData.lat, formData.lon]} />
            </MapContainer>
          </Form.Group>
        </Form>

        <div className="d-flex justify-content-end mt-4">
          <Button variant="outline-secondary" onClick={handleClose} className="me-2">
            Thoát
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu địa chỉ
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

