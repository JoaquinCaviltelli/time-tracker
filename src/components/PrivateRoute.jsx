import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { HoursContext } from "../context/HoursContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(HoursContext);

  // Si no hay usuario, redirige a la página de login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
