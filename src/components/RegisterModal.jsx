import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { auth } from "../services/firebase";
import { HoursContext } from "/src/context/HoursContext.jsx";

const RegisterModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { user, setIsRangeModalOpen, isRangeModalOpen } = useContext(HoursContext);

  const handleRegister = async (name, email, password) => {
    try {
      if (user?.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        const usercred = await linkWithCredential(auth.currentUser, credential);
        await updateProfile(usercred.user, { displayName: name });
        console.log("Cuenta anónima mejorada exitosamente", usercred.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      navigate("/");
      if(!isRangeModalOpen){
        setIsRangeModalOpen(true);

      }
      onClose();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("El usuario ya está en uso.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("El usuario no es válido.");
      } else if (error.code === "auth/weak-password") {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center z-50 text-acent">
      <h2 className="text-sm font-semibold mb-24 text-one mt-6">Registrarse</h2>
      <div className="w-full max-w-lg flex flex-col justify-between h-full">
        <div className="p-6 w-full flex flex-col gap-10">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
          />
        </div>

        <div className="flex flex-col justify-between gap-3 mt-10 p-6">
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
