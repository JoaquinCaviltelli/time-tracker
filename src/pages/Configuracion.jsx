import { useContext, useState } from "react";
import { HoursContext } from "../context/HoursContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";  // Importamos toast

const Configuracion = () => {
  const { goal, updateGoal, user, updateDisplayName, logout } = useContext(HoursContext);
  const [newGoal, setNewGoal] = useState(goal);
  const [displayName, setDisplayName] = useState(user?.displayName || ""); // 

  const navigate = useNavigate();

 


  const handleSaveDisplayName = async () => {

    try {
      await updateGoal(newGoal); // Guardar la nueva meta en Firestore
      toast.success("¡Meta de horas actualizada correctamente!");  // Mostrar notificación de éxito
    } catch (error) {
      toast.error("Error al actualizar la meta. Inténtalo de nuevo.");  // Mostrar notificación de error en caso de fallo
    }

    try {
      await updateDisplayName(displayName); // Actualizar el nombre en Firebase
      toast.success("¡Nombre de usuario actualizado correctamente!");
    } catch (error) {
      toast.error("Error al actualizar el nombre. Inténtalo de nuevo.");
    }

    navigate("/login")
  };


  const handleLogout = async () => {
    await logout(); // Redirigimos al login después de cerrar sesión
  };

 

  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-3xl mt-16 font-semibold text-gray-800 mb-6">Configuración</h1>

      {/* Actualizar Meta */}
      <div className="">
        <label className="block text-gray-700 mb-2">Meta de horas mensuales</label>
        <input
          type="number"
          value={newGoal}
          onChange={(e) => setNewGoal(parseInt(e.target.value, 10))}
          className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none"
          placeholder="Ingresa tu meta"
        />
        
      </div>

      {/* Actualizar Nombre */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Nombre de usuario</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none "
          placeholder="Ingresa tu nombre"
        />
        <button
          onClick={handleSaveDisplayName}
          className="bg-green-600 text-white rounded-lg shadow hover:bg-green-700 w-full p-3"
        >
          Guardar Cambios
        </button>
      </div>
      <button
            onClick={handleLogout}
            className="bg-red-500 mt-10 w-full text-white p-3 rounded hover:bg-red-600"
          >
            cerrar sesion
          </button>
    </div>
  );
};

export default Configuracion;
