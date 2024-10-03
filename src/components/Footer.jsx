import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <header className="bg-white p-4 text-gray-600 bottom-0 w-full fixed border-t-2 shadow-up">
      <div className="container mx-auto flex justify-center items-center w-full">
        <nav>
          <ul className="flex gap-16">
            <li>
              <Link to="/" className="flex items-center hover:scale-125">
                <span className="material-icons mr-1">home</span>
                
              </Link>
            </li>
            <li>
              <Link to="/historial" className="flex items-center hover:scale-125">
                <span className="material-icons mr-1">history</span>
                
              </Link>
            </li>
            <li>
              <Link to="/configuracion" className="flex items-center hover:scale-125">
                <span className="material-icons mr-1">settings</span>
                
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Footer;
