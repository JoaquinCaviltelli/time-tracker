import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../services/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify"; // Para notificaciones
import logo from "/src/assets/timetracker-logo.png"


const Login = () => {
  const { user } = useContext(HoursContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirigir al home si ya está logeado
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // Función para iniciar sesión como usuario demo
  const handleDemoLogin = async () => {
    try {
      const demoEmail = "demo@example.com"; // Correo del usuario demo
      const demoPassword = "password123"; // Contraseña del usuario demo
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      toast.success("Has iniciado sesión como usuario demo");
    } catch (error) {
      toast.error("Error al iniciar sesión como usuario demo");
      console.error("Error al iniciar sesión como demo:", error);
    }
  };

  return (
    <div className="flex justify-center px-6 full-height bg-one pt-28">
      <div className="">
      <img src={logo} alt="Logo" className="mb-28" />
        
        <button
          onClick={handleLogin}
          className="w-full bg-light text-one font-medium px-4 py-2 rounded-md  "
        >
          Iniciar con Google
        </button>
        <div className="flex items-center justify-between mt-3">
          <hr className="flex-grow border-light" />
          <span className="mx-2 text-light">o</span>
          <hr className="flex-grow border-light" />
        </div>
        <button
          onClick={handleDemoLogin}
          className="w-full text-light font-medium text-sm"
        >
          Entrar como usuario demo
        </button>
      </div>
    </div>
  );
};

export default Login;
