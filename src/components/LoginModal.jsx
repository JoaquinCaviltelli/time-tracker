import { useState } from "react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose(); // Cierra el modal después de iniciar sesión
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("Usuario no encontrado.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Contraseña incorrecta.");
      } else {
        toast.error("Error al iniciar sesión.");
      }
      console.error("Error al iniciar sesión con correo:", error);
    }
  };

  if (!isOpen) return null; // Si el modal no está abierto, no se muestra

  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-white p-6 w-full h-full flex flex-col text-acent">
        <h2 className="text-base mt-6 mb-20 text-center text-one">Iniciar Sesión</h2>
        <div className="max-w-md m-auto w-full relative h-full flex flex-col pb-28 gap-10">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
  
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
  
          <div className="absolute bottom-10 w-full">
            <button
              onClick={handleLogin}
              className="font-semibold bg-one text-white rounded w-full p-3"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={onClose}
              className="mt-4 bg-transparent font-semibold rounded text-one border border-one w-full p-3"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default LoginModal;
