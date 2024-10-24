import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify"; // Importamos toast
import TimePickerGoal from "/src/components/TimePickerGoal.jsx";

const EditGoalModal = ({ onClose }) => {
  const { goal, updateGoal } = useContext(HoursContext);
  const [newGoal, setNewGoal] = useState(goal);

  useEffect(() => {
    document.body.style.backgroundColor = "#4a7766";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleSaveGoal = async () => {
    try {
      onClose();
      await updateGoal(newGoal);
    } catch (error) {
      toast.error("Error al actualizar la meta. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="fixed z-50 inset-0">
      <div className="bg-one p-6 w-full h-full text-white flex flex-col">
        <h2 className="text-base mt-6 text-center">Editar meta</h2>
        <div className="max-w-md m-auto w-full">
          {/* Integración del TimePicker */}
          <TimePickerGoal selectedValue={newGoal} setSelectedValue={setNewGoal} />
          <button
            onClick={handleSaveGoal}
            className="bg-white text-one text-sm font-semibold rounded-lg shadow hover:bg-one w-full p-3"
          >
            Guardar meta
          </button>
          <button
            onClick={onClose}
            className="mt-4 bg-one border border-white text-white text-sm font-semibold rounded-lg shadow hover:bg-one w-full p-3"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};


export default EditGoalModal;
