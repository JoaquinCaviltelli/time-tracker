import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation(); // Obtiene la ruta actual

  const getActiveClass = (path) => {
    return location.pathname === path
      ? "bg-one font-bold  text-white"
      : "text-one";
  };

  return (
    <div className="bg-white  bottom-0 w-full fixed shadow-up">
      <nav className="container px-12 max-w-md mx-auto w-full ">
        <ul className="flex w-full justify-center items-center ">
          <li>
            <Link to="/" className="flex items-center w-full">
              <span
                className={`material-icons transition-all rounded-b-3xl  py-4 px-6 text-3xl  ${getActiveClass(
                  "/"
                )}`}
              >
                home
              </span>
            </Link>
          </li>
          <li>
            <Link to="/historial" className="flex items-center">
              <span
                className={`material-icons transition-all rounded-b-3xl py-4 px-6 text-3xl  ${getActiveClass(
                  "/historial"
                )} ${getActiveClass("/YearlySummary")}`}
              >
                calendar_today
              </span>
            </Link>
          </li>
          <li>
            <Link to="/agenda" className="flex items-center">
              <span
                className={`material-icons transition-all rounded-b-3xl py-4 px-6 text-3xl  ${getActiveClass(
                  "/agenda"
                )}`}
              >
                group
              </span>
            </Link>
          </li>
          <li>
            <Link to="/configuracion" className="flex items-center">
              <span
                className={`material-icons transition-all rounded-b-3xl py-4 px-6 text-3xl  ${getActiveClass(
                  "/configuracion"
                )}`}
              >
                settings
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Footer;
