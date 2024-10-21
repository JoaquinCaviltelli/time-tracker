import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation(); // Obtiene la ruta actual

  const getActiveClass = (paths) => {
    return paths.some(path => 
      path instanceof RegExp 
        ? path.test(location.pathname) 
        : location.pathname === path
    )
      ? "bg-white text-one -translate-y-4 border-8 border-one"
      : "text-white";
  };

  return (
    <div className="bg-one bottom-0 w-full fixed shadow-up">
      <nav className="container px-12 max-w-md mx-auto w-full ">
        <ul className="flex w-full justify-center items-center ">
          <li>
            <Link to="/" className="flex items-center">
              <span
                className={`material-icons transition-transform rounded-full text-3xl h-16 w-16 flex justify-center items-center ${getActiveClass(["/"])} `}
              >
                home
              </span>
            </Link>
          </li>
          <li>
            <Link to="/historial" className="flex items-center">
              <span
                className={`material-icons transition-transform rounded-full text-3xl h-16 w-16 flex justify-center items-center ${getActiveClass(["/historial", "/YearlySummary"])} `}
              >
                calendar_today
              </span>
            </Link>
          </li>
          <li>
            <Link to="/agenda" className="flex items-center">
              <span
                className={`material-icons transition-transform rounded-full text-3xl h-16 w-16 flex justify-center items-center ${getActiveClass([/\/agenda$/, /\/visitas\/.*/])} `}
              >
                group
              </span>
            </Link>
          </li>
          <li>
            <Link to="/configuracion" className="flex items-center">
              <span
                className={`material-icons transition-transform rounded-full text-3xl h-16 w-16 flex justify-center items-center ${getActiveClass(["/configuracion"])} `}
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
