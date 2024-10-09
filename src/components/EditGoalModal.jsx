import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify"; // Importamos toast

const EditGoalModal = ({ onClose }) => {
  const { goal, updateGoal } = useContext(HoursContext);
  const [newGoal, setNewGoal] = useState(goal);

  useEffect(() => {
    document.body.style.backgroundColor = "#4a7766"; // Cambia este color al que quieras

    return () => {
      document.body.style.backgroundColor = ""; // Restaura el color por defecto
    };
  }, []);

  const handleSaveGoal = async () => {
    try {
      await updateGoal(newGoal); // Guardar la nueva meta en Firestore
      toast.success("¡Meta de horas actualizada correctamente!"); // Mostrar notificación de éxito
      onClose(); // Cerrar el modal después de guardar
    } catch (error) {
      toast.error("Error al actualizar la meta. Inténtalo de nuevo."); // Mostrar notificación de error
    }
  };

  const increaseGoal = () => {
    setNewGoal(prevGoal => prevGoal + 1);
  };

  const decreaseGoal = () => {
    setNewGoal(prevGoal => (prevGoal > 0 ? prevGoal - 1 : 0));
  };

  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-one p-6 rounded-lg w-full h-full text-white flex">
        <div className="max-w-lg m-auto">
          <h2 className="text-2xl font-bold text-center mb-16">Meta de horas</h2>

          <div className="flex justify-center items-center mb-4">
            <button
              onClick={decreaseGoal}
              className=" text-one bg-white p-2 flex  rounded-md"
            >
              <span className="material-icons font-extrabold text-3xl">remove</span>
            </button>
            <input
              type="number"
              value={newGoal}
              onChange={(e) => setNewGoal(parseInt(e.target.value, 10))}
              className="bg-transparent text-center text-5xl font-bold rounded-lg p-5 w-32  outline-none"
              placeholder="Ingresa tu meta"
            />
            <button
              onClick={increaseGoal}
              className="text-one bg-white p-2 flex  rounded-md"
            >
              <span className="material-icons font-extrabold text-3xl">add</span>
            </button>
          </div>

          <button
            onClick={handleSaveGoal}
            className="bg-white text-one text-sm font-semibold rounded-lg shadow hover:bg-one w-full p-3"
          >
            Guardar meta
          </button>
          <button
            onClick={onClose}
            className="mt-24 bg-one border border-white text-white text-sm font-semibold rounded-lg shadow hover:bg-one w-full p-3"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGoalModal;
