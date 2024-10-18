import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation(); // Obtiene la ruta actual

  const getActiveClass = (path) => {
    return location.pathname === path ? "text-acent text-5xl" : "text-gray-600";
  };

  return (
    <header className="bg-white p-4 bottom-0 w-full fixed border-t-2 shadow-up">
      <div className="container px-12 mx-auto flex justify-center items-center w-full h-12">
        <nav className="w-full">
          <ul className="flex w-full justify-between items-center">
            <li>
              <Link to="/" className="flex items-center">
                <span className={`material-icons text-3xl transition-all ${getActiveClass("/")}`}>
                  home
                </span>
              </Link>
            </li>
            <li>
              <Link to="/historial" className="flex items-center">
                <span className={`material-icons text-3xl transition-all ${getActiveClass("/historial")}`}>
                  calendar_today
                </span>
              </Link>
            </li>
            <li>
              <Link to="/agenda" className="flex items-center">
                <span className={`material-icons text-3xl transition-all ${getActiveClass("/agenda")}`}>
                  group
                </span>
              </Link>
            </li>
            <li>
              <Link to="/configuracion" className="flex items-center">
                <span className={`material-icons text-3xl transition-all ${getActiveClass("/configuracion")}`}>
                  settings
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Footer;
