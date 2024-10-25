import { useContext, useState } from "react";
import { HoursContext } from "../context/HoursContext";
import EditGoalModal from "../components/EditGoalModal";
import EditDisplayNameModal from "../components/EditDisplayNameModal";
import EditRangeModal from "../components/EditRangeModal"; // Importar el modal de rango

const Configuracion = () => {
  const {
    goal,
    user,
    updateDisplayName,
    logout,
    range,
    isRangeModalOpen,
    setIsRangeModalOpen,
  } = useContext(HoursContext);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isDisplayNameModalOpen, setIsDisplayNameModalOpen] = useState(false);

  const handleSaveDisplayName = async (newDisplayName) => {
    await updateDisplayName(newDisplayName);
    setDisplayName(newDisplayName); // Actualiza el estado local con el nuevo nombre
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container mx-auto p-6 max-w-lg pb-28">
      <div className="flex justify-between mt-16 mb-6 items-center">
        <h1 className="text-3xl font-extrabold text-acent">Configuración</h1>
      </div>

      <div className="flex flex-col gap-3">
        {/* Editar Rango */}
        <div>
          <button
            onClick={() => setIsRangeModalOpen(true)} // Abrir el modal de rango
            className="bg-one text-white rounded w-full p-4 pt-6"
          >
            <span className="text-xl font-bold capitalize">{range}</span>
            <br />
            <span className="font-light text-xs opacity-50">Editar rango</span>
          </button>
        </div>
        {/* Actualizar Meta */}
        <div className="">
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="bg-one text-white rounded w-full p-4 pt-6"
          >
            <span className="text-xl font-bold">{goal}h</span>
            <br />
            <span className="font-light text-xs opacity-50">Editar meta</span>
          </button>
        </div>

        {/* Editar Nombre */}
        <div>
          <button
            onClick={() => setIsDisplayNameModalOpen(true)}
            className="bg-one text-white rounded w-full p-4 pt-6"
          >
            <span className="text-xl font-bold">{displayName}</span>
            <br />
            <span className="font-light text-xs opacity-50">Editar nombre</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="bg-acent  w-full text-white p-3 rounded hover:bg-white"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Modal para editar la meta */}
      {isGoalModalOpen && (
        <EditGoalModal onClose={() => setIsGoalModalOpen(false)} />
      )}

      {/* Modal para editar el nombre */}
      {isDisplayNameModalOpen && (
        <EditDisplayNameModal
          onClose={() => setIsDisplayNameModalOpen(false)}
          initialDisplayName={displayName}
          onSave={handleSaveDisplayName}
        />
      )}

      {/* Modal para editar el rango */}
      {isRangeModalOpen && (
        <EditRangeModal onClose={() => setIsRangeModalOpen(false)} />
      )}
    </div>
  );
};

export default Configuracion;
