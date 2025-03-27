import { useLocation } from "react-router-dom";

import AppRoutes from "./router/AppRoutes";
import { Blank } from "./layouts/Blank";
// import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"

function App() {
  const location = useLocation();
  const isAuthPath = location.pathname.includes("auth") || location.pathname.includes("error") || location.pathname.includes("under-maintenance") | location.pathname.includes("blank");
 
  return (
    <>
      {isAuthPath ? (
        <AppRoutes>
          <Blank />
        </AppRoutes>
      ) : (
        <>
          <AppRoutes />
          <ToastContainer />
        </>

      )}
    </>
  );
}

export default App;
