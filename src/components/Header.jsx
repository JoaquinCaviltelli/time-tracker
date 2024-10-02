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
    <header className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Registro de Horas</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Home</Link>
            </li>
            <li>
              <Link to="/historial" className="hover:text-gray-300">Historial</Link>
            </li>
            <li>
              <Link to="/configuracion" className="hover:text-gray-300">Configuración</Link>
            </li>
            {user && (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
