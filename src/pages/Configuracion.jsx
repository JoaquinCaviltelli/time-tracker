import { useContext, useState } from "react";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify";  // Importamos toast

const Configuracion = () => {
  const { goal, updateGoal } = useContext(HoursContext);
  const [newGoal, setNewGoal] = useState(goal);

  const handleSaveGoal = async () => {
    try {
      await updateGoal(newGoal); // Guardar la nueva meta en Firestore
      toast.success("¡Meta de horas actualizada correctamente!");  // Mostrar notificación de éxito
    } catch (error) {
      toast.error("Error al actualizar la meta. Inténtalo de nuevo.");  // Mostrar notificación de error en caso de fallo
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>
      <div>
        <label className="block mb-2">Meta de horas mensuales</label>
        <input
          type="number"
          value={newGoal}
          onChange={(e) => setNewGoal(parseInt(e.target.value, 10))}
          className="border px-2 py-1 mb-4"
        />
        <button
          onClick={handleSaveGoal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default Configuracion;
