import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signInAnonymously } from "firebase/auth";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify";
import LogoChart from "/src/components/LogoChart.jsx";
import RegisterModal from "/src/components/RegisterModal.jsx";
import LoginModal from "/src/components/LoginModal.jsx"; // Importa el nuevo modal

const Login = () => {
  const { user } = useContext(HoursContext);
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Estado para el modal de login con email

  useEffect(() => {
    document.body.style.backgroundColor = "#4a7766";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirigir al home si ya está logeado
    }
  }, [user, navigate]);

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      toast.success("Has ingresado de forma anónima.");
      navigate("/"); // Redirigir al home
    } catch (error) {
      toast.error("Error al iniciar sesión anónimamente");
      console.error("Error al iniciar sesión como anónimo:", error);
    }
  };

  return (
    <div className="flex justify-center px-6 pt-20 max-w-md m-auto">
      <div>
        <LogoChart />
      
        {/* Otras opciones del login */}
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="w-full bg-white text-one font-semibold px-4 py-2 rounded-md mt-20"
        >
          Ingresar
        </button>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="w-full text-white text-sm mt-5"
        >
          Registrarse
        </button>
      
      </div>

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <p className="fixed bottom-5 text-xs text-center text-white">
      <button
          onClick={handleAnonymousLogin}
          className="w-full mt-20 text-white font-medium text-sm "
        >
          Ingresar sin registrarse
        </button>
      </p>
    </div>
  );
};

export default Login;
