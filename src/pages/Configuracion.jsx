import { useContext, useState } from "react";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify";  // Importamos toast

const Configuracion = () => {
  const { goal, updateGoal, user, updateDisplayName } = useContext(HoursContext);
  const [newGoal, setNewGoal] = useState(goal);
  const [displayName, setDisplayName] = useState(user?.displayName || ""); // Iniciar con el nombre actual del usuario

  const handleSaveGoal = async () => {
    try {
      await updateGoal(newGoal); // Guardar la nueva meta en Firestore
      toast.success("¡Meta de horas actualizada correctamente!");  // Mostrar notificación de éxito
    } catch (error) {
      toast.error("Error al actualizar la meta. Inténtalo de nuevo.");  // Mostrar notificación de error en caso de fallo
    }
  };

  const handleSaveDisplayName = async () => {
    try {
      await updateDisplayName(displayName); // Actualizar el nombre en Firebase
      toast.success("¡Nombre de usuario actualizado correctamente!");
    } catch (error) {
      toast.error("Error al actualizar el nombre. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl mt-16 font-semibold text-gray-800 mb-6">Configuración</h1>

      {/* Actualizar Meta */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Meta de horas mensuales</label>
        <input
          type="number"
          value={newGoal}
          onChange={(e) => setNewGoal(parseInt(e.target.value, 10))}
          className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          placeholder="Ingresa tu meta"
        />
        <button
          onClick={handleSaveGoal}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
        >
          Guardar Meta
        </button>
      </div>

      {/* Actualizar Nombre */}
      <div>
        <label className="block text-gray-700 mb-2">Nombre de usuario</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          placeholder="Ingresa tu nombre"
        />
        <button
          onClick={handleSaveDisplayName}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition duration-200"
        >
          Guardar Nombre
        </button>
      </div>
    </div>
  );
};

export default Configuracion;
