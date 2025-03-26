import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = ({ message = "Loading...", size = "md" }) => {
   const spinnerSize = size === "sm" ? "spinner-border-sm" : size === "lg" ? "spinner-border-lg" : "";

   return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh", position: "fixed", top: 0, left: 0, width: "100%", background: "rgba(255,255,255,0.6)", zIndex: 20 }}>
         <Spinner animation="border" role="status" className={spinnerSize} />
         <span className="mt-2">{message}</span>
      </div>
   );
};

export default Loading;
