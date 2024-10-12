import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <header className="bg-white p-4 text-gray-600 bottom-0 w-full fixed border-t-2 shadow-up">
      <div className="container px-12 mx-auto flex justify-center items-center w-full">
        <nav className="w-full">
          <ul className="flex w-full justify-between items-center">
            <li>
              <Link to="/" className="flex items-center">
                <span className="material-icons text-3xl">home</span>
              </Link>
            </li>
            <li>
              <Link to="/historial" className="flex items-center">
                <span className="material-icons text-3xl">calendar_today</span>
              </Link>
            </li>
            <li>
              <Link to="/agenda" className="flex items-center">
                <span className="material-icons text-3xl">group</span>
              </Link>
            </li>
            <li>
              <Link to="/configuracion" className="flex items-center">
                <span className="material-icons text-3xl">settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Footer;
