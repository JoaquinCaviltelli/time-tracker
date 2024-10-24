import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { HoursProvider, HoursContext } from "./context/HoursContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Historial from "./pages/Historial";
import Configuracion from "./pages/Configuracion";
import Agenda from "./pages/Agenda";
import VisitsPage from "./pages/VisitsPage";
import YearlySummary from "./pages/YearlySummary";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "/src/components/Footer.jsx";
import Loading from "./components/Loading";
import NotFound from "./pages/NotFound";
import EditRankModal from "/src/components/EditRangeModal.jsx"; // Importa el modal de rango

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
  const { loading, user, range } = useContext(HoursContext); // Obtén el rango del usuario
  const [showModal, setShowModal] = useState(false);

  // Verificar si se debe mostrar el modal de edición de rango (solo si el rango es null)
  useEffect(() => {
    if (!loading && range === null) {
      setShowModal(true); // Muestra el modal si el rango es null (primera vez que el usuario ingresa)
    }
  }, [range, loading]);

  return (
    <div>
      <Loading loading={loading} />
      <Routes>
        <Route path="/login" element={<Login />} />
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
        <Route
          path="/agenda"
          element={
            <PrivateRoute>
              <Agenda />
            </PrivateRoute>
          }
        />
        <Route
          path="/visitas/:contactId"
          element={
            <PrivateRoute>
              <VisitsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/YearlySummary"
          element={
            <PrivateRoute>
              <YearlySummary />
            </PrivateRoute>
          }
        />
        {/* Ruta para página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
      {user && <Footer />}
      
      {/* Modal de edición de rango */}
      {showModal && <EditRankModal onClose={() => setShowModal(false)} />} {/* Cierra el modal al guardar el rango */}
    </div>
  );
};

export default App;
