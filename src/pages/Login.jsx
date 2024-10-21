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

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Inicio de sesión exitoso");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setUnregisteredEmail(email); // Guardar el correo no registrado
        setIsRegisterModalOpen(true); // Mostrar el modal de registro
      } else {
        toast.error("Error al iniciar sesión");
        console.error("Error al iniciar sesión con correo:", error);
      }
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      toast.success("Registro exitoso");
      setIsRegisterModalOpen(false); // Cerrar el modal después del registro
    } catch (error) {
      toast.error("Error al registrarse");
      console.error("Error al registrarse:", error);
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
    <div className="flex justify-center px-6 pt-20">
      <div className="">
        <LogoChart />
        <button
          onClick={handleLogin}
          className="w-full bg-white text-one font-medium px-4 py-2 rounded-md mt-20 "
        >
          Iniciar con Google
        </button>

        <div className="flex items-center justify-between mt-3">
          <hr className="flex-grow border-light" />
          <span className="mx-2 text-white">o</span>
          <hr className="flex-grow border-light" />
        </div>

        {/* Login con correo y contraseña */}
        <div className="mt-3 ">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-md text-center"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-2 border rounded-md text-center"
          />
          <button
            onClick={handleEmailLogin}
            className="w-full bg-white text-one font-medium px-4 py-2 rounded-md"
          >
            Iniciar sesión con correo
          </button>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full text-white font-medium text-sm hover:text-one mt-3"
        >
          Entrar como usuario demo
        </button>

        {/* Botón para abrir el modal de registro manualmente */}
        <button
          onClick={() => setIsRegisterModalOpen(true)} // Al hacer clic, abre el modal
          className="w-full text-white font-medium text-sm hover:text-one mt-3"
        >
          Registrarse
        </button>
      </div>

      {/* Modal de registro */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={handleRegister}
      />

      <p className="fixed bottom-5 text-xs text-center text-white opacity-40">
        Diseñado por Joaquin Cavitelli
      </p>
    </div>
  );
};

export default Login;
