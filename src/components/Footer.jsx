import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <header className="bg-red-500 p-4 text-white bottom-0 w-full fixed">
      <div className="container mx-auto flex justify-center items-center w-full">
        <nav>
          <ul className="flex gap-10">
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
