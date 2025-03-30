import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import menuData from "../data/menuData.json";
import { useChatContext } from "../App";

const Sidebar = () => {
  const context = useChatContext();
  const [bots, setBots] = useState([]);

  // Cập nhật bots khi context thay đổi
  useEffect(() => {
    if (context && context.state && context.state.bots) {
      setBots(context.state.bots);
    }
  }, [context.state.bots]);

  // Cập nhật submenu của các mục menu
  const updatedMenuData = menuData.map((section) => {
    const updatedItems = section.items.map((item) => {
      // Cập nhật submenu nếu item là "Quản lý tin nhắn"
      if (item.text === "Quản lý tin nhắn" && bots && bots.length > 0) {
        item.submenu = bots.map((bot) => ({
          text: bot.name,
          available: true,
          link: `/message-management/bot/${bot.bid}`,
        }));
      }
      return item;
    });
    return { ...section, items: updatedItems };
  });

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
    >
      <div className="app-brand demo">
        <Link
          aria-label="Navigate to sneat homepage"
          to="/"
          className="app-brand-link"
        >
          <span className="app-brand-logo demo">
            <img
              src="/assets/img/sneat.svg"
              alt="sneat-logo"
              aria-label="Sneat logo image"
            />
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-2">
            Chat Bot AI
          </span>
        </Link>

        <a
          href="#"
          className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
        >
          <i className="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {updatedMenuData.map((section) => (
          <React.Fragment key={section.header}>
            {section.header && (
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">{section.header}</span>
              </li>
            )}
            {section.items.map((item) => (
              <MenuItem key={item.text} item={item} bots={bots} />
            ))}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  );
};

const MenuItem = ({ item, bots }) => {
  const location = useLocation();
  const isActive = location.pathname === item.link;
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isSubmenuActive =
    hasSubmenu &&
    item.submenu.some((subitem) => location.pathname === subitem.link);

  return (
    <li
      className={`menu-item ${isActive || isSubmenuActive ? "active" : ""} ${hasSubmenu && isSubmenuActive ? "open" : ""
        }`}
    >
      <NavLink
        aria-label={`Navigate to ${item.text} ${!item.available ? "Pro" : ""}`}
        to={item.link}
        className={`menu-link ${item.submenu ? "menu-toggle" : ""}`}
        target={item.link.includes("http") ? "_blank" : undefined}
      >
        <i className={`menu-icon tf-icons ${item.icon}`}></i>
        <div>{item.text}</div>{" "}
        {item.available === false && (
          <div className="badge bg-label-primary fs-tiny rounded-pill ms-auto">
            Pro
          </div>
        )}
      </NavLink>
      {item.submenu && (
        <ul className="menu-sub">
          {item.submenu.map((subItem) => (
            <MenuItem key={subItem.text} item={subItem} bots={bots} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;
