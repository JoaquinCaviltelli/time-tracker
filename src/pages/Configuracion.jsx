import { useContext, useState } from "react";
import { HoursContext } from "../context/HoursContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditGoalModal from "../components/EditGoalModal"; // Modal de meta
import EditDisplayNameModal from "../components/EditDisplayNameModal"; // Importar el nuevo modal

const Configuracion = () => {
  const { goal, updateGoal, user, updateDisplayName, logout } = useContext(HoursContext);
  const [newGoal, setNewGoal] = useState(goal);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = useState(false); // Estado para el nuevo modal
  const navigate = useNavigate();

  const handleSaveDisplayName = async (newDisplayName) => {
    await updateDisplayName(newDisplayName);
    setDisplayName(newDisplayName); // Actualiza el estado local con el nuevo nombre
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container mx-auto p-6 bg-white max-w-lg m-auto flex flex-col gap-2">
      <h1 className="text-3xl mt-16 font-extrabold text-acent mb-6">Configuración</h1>

      {/* Actualizar Meta */}
      <div className="">
        <button
          onClick={() => setIsGoalModalOpen(true)}
          className="bg-one text-white rounded hover:bg-white w-full p-6 pt-8"
        >
          <span className="text-3xl  font-bold">{goal}h</span><br />
          <span className="font-light text-sm">Editar meta</span>
        </button>
      </div>

      {/* Editar Nombre */}
      <div>
        <button
          onClick={() => setIsDisplayNameModalOpen(true)} // Abrir el nuevo modal
          className="bg-one text-white rounded w-full p-6 pt-8"
        >
          <span className="text-3xl font-bold">{displayName}</span><br />
          <span className="font-light text-sm">Editar nombre</span>
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="bg-acent  w-full text-white p-3 rounded hover:bg-white"
      >
        cerrar sesión
      </button>

      {/* Modal para editar la meta */}
      {isGoalModalOpen && <EditGoalModal onClose={() => setIsGoalModalOpen(false)} />}
      {/* Modal para editar el nombre */}
      {isDisplayNameModalOpen && (
        <EditDisplayNameModal
          onClose={() => setIsDisplayNameModalOpen(false)}
          initialDisplayName={displayName}
          onSave={handleSaveDisplayName}
        />
      )}
    </div>
  );
};

export default Configuracion;
