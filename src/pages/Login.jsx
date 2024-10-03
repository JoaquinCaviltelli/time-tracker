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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Iniciar Sesión</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white font-medium px-4 py-2 rounded-md shadow hover:bg-blue-400 transition duration-200"
        >
          Iniciar con Google
        </button>
        <div className="my-4 flex items-center justify-between">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">o</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <button
          onClick={handleDemoLogin}
          className="w-full bg-gray-500 text-white font-medium px-4 py-2 rounded-md shadow hover:bg-gray-400 transition duration-200"
        >
          Entrar como Usuario Demo
        </button>
      </div>
    </div>
  );
};

export default Login;
