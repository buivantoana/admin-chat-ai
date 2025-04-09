import { useLocation } from "react-router-dom";

import AppRoutes from "./router/AppRoutes";
import { Blank } from "./layouts/Blank";
// import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import 'leaflet/dist/leaflet.css';
import { createContext, useContext, useEffect, useReducer } from "react";
export const chatContext = createContext({});

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_BOT":
      return {
        ...state,
        bots: action.payload.bots,
      };
    case "DELETE_BOT":
      return {
        ...state,
        bots: action.payload.bots,
      };
    case "LIST_BOT":
      return {
        ...state,
        bots: action.payload.bots,
      };
    case "LIST_USER":
      return {
        ...state,
        users: action.payload.users,
      };
    case "UPDATE_BOT":
      return {
        ...state,
        bots: action.payload.bots,
      };
    case "REGISTER":
      return {
        ...state,
        users: action.payload.users,
      };
    default:
      return state;
  }
};
function App() {
  const location = useLocation();
  const isAuthPath =
    location.pathname.includes("auth") ||
    location.pathname.includes("error") ||
    location.pathname.includes("under-maintenance") |
    location.pathname.includes("blank");

  const [state, dispatch] = useReducer(reducer, {
    bots: [],
    users: [],
  });
  let bots = localStorage.getItem("bots");
  let users = localStorage.getItem("managed_users");
  useEffect(() => {
    if (bots && bots.length > 0) {
      dispatch({
        type: "LIST_BOT",
        payload: {
          ...state,
          bots: [...JSON.parse(bots)],
        },
      });
    }
    if (users && users.length > 0) {
      dispatch({
        type: "LIST_USER",
        payload: {
          ...state,
          users: [...JSON.parse(users)],
        },
      });
    }
  }, [users, bots]);
  return (
    <>
      <chatContext.Provider value={{ dispatch, state }}>
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
      </chatContext.Provider>
    </>
  );
}
export const useChatContext = () => useContext(chatContext);
export default App;
