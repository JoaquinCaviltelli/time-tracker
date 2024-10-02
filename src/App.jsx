import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { HoursProvider, HoursContext } from "./context/HoursContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importamos el CSS de Toastify
import Home from "./pages/Home";
import Login from "./pages/Login";
import Historial from "./pages/Historial";
import Configuracion from "./pages/Configuracion";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header"; // Importamos el Header
import Loading from "./components/Loading";

const App = () => {
  return (
    <HoursProvider>
      <MainApp />
    </HoursProvider>
  );
};

const MainApp = () => {
  const { loading, user } = useContext(HoursContext);


  return (
    <>
    <Loading loading={loading} />
      <Router>
        {user && <Header />}{" "}
        {/* Mostrar Header solo si el usuario está autenticado */}
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <PrivateRoute>
                <Historial />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <PrivateRoute>
                <Configuracion />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer /> {/* Agregamos el contenedor de Toastify */}
    </>
  );
};

export default App;
