import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../services/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify"; // Para notificaciones
import logo from "/src/assets/timetracker-logo.png";
import LogoChart from "/src/components/LogoChart.jsx";
import RegisterModal from "/src/components/RegisterModal.jsx"; // Importamos el modal

const Login = () => {
  const { user } = useContext(HoursContext);
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Estado para controlar el modal
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unregisteredEmail, setUnregisteredEmail] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");

 

  useEffect(() => {
    document.body.style.backgroundColor = "#4a7766";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    if (user) {
      setCurrentUserName(user.displayName)
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

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      toast.success(`Bienvenido ${currentUserName}`);
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setUnregisteredEmail(email); // Guardar el correo no registrado
          setIsRegisterModalOpen(true); // Mostrar el modal de registro
          toast.error("Usuario no encontrado. ¿Quieres registrarte?");
          break;
        case "auth/wrong-password":
          toast.error("Contraseña incorrecta. Intenta de nuevo.");
          break;
        case "auth/invalid-email":
          toast.error("El usuario no es válido.");
          break;
        case "auth/user-disabled":
          toast.error("El usuario está deshabilitado. Contacta al soporte.");
          break;
        case "auth/network-request-failed":
          toast.error("Error de red. Verifica tu conexión a Internet.");
          break;
        default:
          toast.error("Error al iniciar sesión. Intenta de nuevo.");
          console.error("Error al iniciar sesión con correo:", error);
      }
    }
  };
  

  

  const handleDemoLogin = async () => {
    try {
      const demoEmail = "demo@example.com";
      const demoPassword = "password123";
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
    } catch (error) {
      toast.error("Error al iniciar sesión como usuario demo");
      console.error("Error al iniciar sesión como demo:", error);
    }
  };

  return (
    <div className="flex justify-center px-6 pt-20 max-w-md m-auto">
      <div className="">
        <LogoChart  />
        {/* <button
          onClick={handleLogin}
          className="w-full bg-white text-one font-medium px-4 py-2 rounded-md"
        >
          Iniciar con Google
        </button> */}

        {/* <div className="flex items-center justify-between mt-3">
          <hr className="flex-grow border-light" />
          <span className="mx-2 text-white">o</span>
          <hr className="flex-grow border-light" />
        </div> */}

        {/* Login con correo y contraseña */}
        <div className="mt-20 ">
          <input
            type="email"
            placeholder="Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 mb-2 border border-white rounded-md text-center outline-none bg-one text-white placeholder:text-white placeholder:opacity-50"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-2 border border-white rounded-md text-center outline-none bg-one text-white placeholder:text-white placeholder:opacity-50"
          />
          <button
            onClick={handleEmailLogin}
            className="w-full bg-white text-one  px-4 py-3 rounded-md outline-none font-semibold"
          >
            Ingresar
          </button>
        </div>

        {/* <button
          onClick={handleDemoLogin}
          className="w-full text-white font-medium text-sm hover:text-one mt-3 outline-none"
        >
          Entrar como usuario demo
        </button> */}

        {/* Botón para abrir el modal de registro manualmente */}
        <button
          onClick={() => setIsRegisterModalOpen(true)} // Al hacer clic, abre el modal
          className="w-full text-white font-medium text-sm  mt-6"
        >
          Registrarse
        </button>
      </div>

      {/* Modal de registro */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <p className="fixed bottom-5 text-xs text-center text-white opacity-40">
        Diseñado por Joaquin Cavitelli
      </p>
    </div>
  );
};

export default Login;
