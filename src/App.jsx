import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { HoursProvider, HoursContext } from "./context/HoursContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Historial from "./pages/Historial";
import Configuracion from "./pages/Configuracion";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Footer from "/src/components/Footer.jsx";
import Loading from "./components/Loading";
import { useSwipeable } from "react-swipeable";
import { useNavigate, useLocation } from "react-router-dom";

const App = () => {
  return (
    <HoursProvider>
      <Router>
        <MainApp />
      </Router>
    </HoursProvider>
  );
};

const MainApp = () => {
  const { loading, user } = useContext(HoursContext);
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener la ruta actual

  // Funciones para manejar la navegación
  const handleSwipeLeft = () => {
    if (location.pathname === '/') {
      navigate('/historial');
    } else if (location.pathname === '/historial') {
      navigate('/configuracion');
    }
  };

  const handleSwipeRight = () => {
    if (location.pathname === '/historial') {
      navigate('/');
    } else if (location.pathname === '/configuracion') {
      navigate('/historial');
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    // <div {...swipeHandlers}>
    <div>
      <Loading loading={loading} />
      {user && <><Header/> </> }
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/historial" element={<PrivateRoute><Historial /></PrivateRoute>} />
        <Route path="/configuracion" element={<PrivateRoute><Configuracion /></PrivateRoute>} />
      </Routes>
      <ToastContainer />
      {user && <><Footer/> </> }
    </div>
  );
};

export default App;
