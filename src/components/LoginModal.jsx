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
    <div className="fixed inset-0 bg-white flex flex-col items-center z-50 text-acent">
      <h2 className="text-sm font-semibold mb-24 text-one mt-6">Iniciar Sesión</h2>
      <div className="w-full max-w-lg flex flex-col justify-between h-full">
        <div className="p-6 w-full max-w-lg flex flex-col gap-10">
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
        </div>

        <div className="flex flex-col justify-between gap-3 mt-10 p-6">
          <button
            onClick={handleLogin}
            className="py-2 font-semibold bg-one text-white rounded"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={onClose}
            className="py-2 bg-transparent font-semibold rounded text-one border border-one"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
