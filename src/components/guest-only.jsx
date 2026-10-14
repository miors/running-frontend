import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const GuestOnly = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? <Navigate to="/feed" replace /> : children;
};

export default GuestOnly;
