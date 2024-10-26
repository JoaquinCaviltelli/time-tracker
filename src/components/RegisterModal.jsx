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

  const { user, setIsRangeModalOpen, range } = useContext(HoursContext);

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
      if(!range){
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
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-white p-6 w-full h-full flex flex-col text-acent">
        <h2 className="text-base mt-6 mb-20 text-center text-one">Registrarse</h2>
        <div className="max-w-md m-auto w-full relative h-full flex flex-col pb-28 gap-10">
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
  
          <div className="absolute bottom-10 w-full">
            <button
              onClick={handleSubmit}
              className="font-semibold bg-one text-white rounded w-full p-3"
            >
              Registrarse
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

export default RegisterModal;
