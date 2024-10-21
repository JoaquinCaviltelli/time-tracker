import { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth} from "../services/firebase";
const RegisterModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      toast.success("Registro exitoso");
      onClose(); // Cierra el modal después del registro
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error("El correo electrónico ya está en uso.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("El correo electrónico no es válido.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("La contraseña es muy débil.");
      } else {
        toast.error("Error al registrarse.");
      }
      console.error("Error al registrarse:", error);
    }
  };

  const handleSubmit = () => {
    if (!name || !email || !password) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }
    handleRegister(name, email, password);
  };

  if (!isOpen) return null; // Si el modal no está abierto, no se muestra

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center z-50 text-acent">
      <h2 className="text-sm font-semibold mb-24 text-one  mt-6">Registrarse</h2>
      <div className="p-6 w-full max-w-lg flex flex-col gap-10">
        <input
          type="text"
          placeholder="nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <input
          type="email"
          placeholder="correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <input
          type="password"
          placeholder="contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <div className="flex flex-col justify-between gap-3 mt-10">
          <button
            onClick={handleSubmit}
            className="py-2 font-semibold bg-one text-white rounded"
          >
            Registrarse
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

export default RegisterModal;
