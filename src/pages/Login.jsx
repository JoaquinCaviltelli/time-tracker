import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../services/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify"; // Para notificaciones

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
    <div className="flex items-center justify-center px-6 min-h-screen bg-one">
      <div className="">
        <h1 className="text-3xl px-3 font-semibold text-center text-light mb-6">Time Tracker</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-details text-white font-medium px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200"
        >
          Iniciar con Google
        </button>
        <div className="flex items-center justify-between mt-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-300">o</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <button
          onClick={handleDemoLogin}
          className="w-full text-white font-medium text-sm"
        >
          Entrar como Usuario Demo
        </button>
      </div>
    </div>
  );
};

export default Login;
