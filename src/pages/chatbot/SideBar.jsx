import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ListGroup, Button } from "react-bootstrap";
import {
  House,
  Image,
  Database,
  Code,
  Globe,
  Layers,
  Box,
} from "react-bootstrap-icons";

const Sidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div
      className="d-flex flex-column  p-3 bg-white border-end"
      style={{
        width: "25%",
        height: "77vh",
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px",
      }}
    >
      {/* Avatar + Tên bot */}
      <div className="d-flex align-items-center mb-3">
        <img
          src="https://ss-images.saostar.vn/wp700/pc/1613810558698/Facebook-Avatar_3.png"
          alt="Avatar"
          className="rounded-circle me-2"
          width={40}
        />
        <strong>bot-demo</strong>
      </div>

      {/* Nút Chat */}
      <Button
        variant="primary"
        onClick={() => navigate("/chat")}
        className="w-100 mb-3"
      >
        Chat với <Box className="ms-2" />
      </Button>

      {/* Danh sách menu */}
      <ListGroup variant="flush">
        <NavLink
          to={`/overview/${id}`}
          className="list-group-item list-group-item-action"
        >
          <House className="me-2" /> Tổng quan
        </NavLink>
        <NavLink
          to={`/training-data/${id}`}
          className="list-group-item list-group-item-action"
        >
          <Database className="me-2" /> Dữ liệu huấn luyện
        </NavLink>
        <NavLink
          to={`/product/${id}`}
          className="list-group-item list-group-item-action"
        >
          <Layers className="me-2" /> Sản phẩm
        </NavLink>

        <NavLink
          to={`/branch/${id}`}
          className="list-group-item list-group-item-action"
        >
          <Code className="me-2" /> Chi nhánh/cửa hàng
        </NavLink>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
