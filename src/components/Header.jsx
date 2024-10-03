import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HoursContext } from "../context/HoursContext";

const Header = () => {
  const { user, logout } = useContext(HoursContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login"); // Redirigimos al login después de cerrar sesión
  };

  return (
    <header className="p-4 absolute w-screen">
      <div className="container mx-auto flex justify-end items-center text-white">
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            <span className="material-icons ">logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
