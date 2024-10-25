import { useContext, useState } from "react";
import { HoursContext } from "../context/HoursContext";
import EditGoalModal from "../components/EditGoalModal";
import EditDisplayNameModal from "../components/EditDisplayNameModal";
import EditRangeModal from "../components/EditRangeModal";
import RegisterModal from "../components/RegisterModal"; // Importamos el modal de registro

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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Estado para el modal de registro

  const handleSaveDisplayName = async (newDisplayName) => {
    await updateDisplayName(newDisplayName);
    setDisplayName(newDisplayName);
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
            onClick={() => setIsRangeModalOpen(true)}
            className="bg-one text-white rounded w-full p-4 pt-6"
          >
            <span className="text-xl font-bold capitalize">{range}</span>
            <br />
            <span className="font-light text-xs opacity-50">
              Desbloquea nuevas herramientas
            </span>
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
        {user?.email && (
          <div>
            <button
              onClick={() => setIsDisplayNameModalOpen(true)}
              className="bg-one text-white rounded w-full p-4 pt-6"
            >
              <span className="text-xl font-bold">{displayName}</span>
              <br />
              <span className="font-light text-xs opacity-50">
                Editar nombre
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-acent w-full text-white p-3 rounded hover:bg-white mt-3"
            >
              Cerrar sesión
            </button>
          </div>
        )}
        {/* Registro de Cuenta */}
        {!user?.email && (
          <div>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-one text-white rounded w-full p-4 pt-6"
            >
              <div className="flex justify-center items-center gap-5">
                <span className="text-xl font-bold ">Copia de seguridad</span>
                <span className="material-icons">cloud_upload</span>
              </div>
              <span className="font-light text-xs opacity-50">Registrate</span>
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      {isGoalModalOpen && (
        <EditGoalModal onClose={() => setIsGoalModalOpen(false)} />
      )}

      {isDisplayNameModalOpen && (
        <EditDisplayNameModal
          onClose={() => setIsDisplayNameModalOpen(false)}
          initialDisplayName={displayName}
          onSave={handleSaveDisplayName}
        />
      )}

      {isRangeModalOpen && (
        <EditRangeModal onClose={() => setIsRangeModalOpen(false)} />
      )}

      {/* Modal de Registro */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};

export default Configuracion;
