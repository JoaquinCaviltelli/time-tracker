import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <header className="bg-white p-4 text-gray-600 bottom-0 w-full fixed border-t-2 shadow-up">
      <div className="container mx-auto flex justify-center items-center w-full">
        <nav>
          <ul className="flex gap-16">
            <li>
              <Link to="/" className="flex items-center">
                <span className="material-icons text-3xl">home</span>
              </Link>
            </li>
            <li>
              <Link to="/historial" className="flex items-center">
                <span className="material-icons text-3xl">history</span>
              </Link>
            </li>
            <li>
              <Link to="/agenda" className="flex items-center">
                <span className="material-icons text-3xl">contacts</span>
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
