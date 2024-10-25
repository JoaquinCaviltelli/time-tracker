import React, { useState, useContext, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { toast } from "react-toastify";
import RankPicker from "./RankPicker";

const EditRankModal = ({ onClose }) => {
  const { updateRange, updateGoal, range, user } = useContext(HoursContext); // Añadir updateGoal
  const [selectedRank, setSelectedRank] = useState("publicador");

  // Mapeo de rangos a metas
  const rankToGoal = {
    publicador: 15,
    auxiliar: 30,
    regular: 50,
    especial: 70,
  };

  // Cuando se monte el componente, establecer el rango actual
  useEffect(() => {
    if (range) {
      setSelectedRank(range); // Establecer el rango actual como valor inicial
    }
  }, [range]);

  const handleSaveRank = async () => {
    try {
      onClose();
      await updateRange(selectedRank); // Guardar el rango seleccionado
      await updateGoal(rankToGoal[selectedRank]); // Actualizar la meta según el rango
      
    } catch (error) {
      toast.error("Error al actualizar el rango o la meta. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="fixed z-50 inset-0">
      <div className="bg-one p-6 w-full h-full text-white flex flex-col">
        <h2 className="text-base mt-6 text-center">{user.displayName}</h2>
        <div className="max-w-md m-auto w-full relative h-full flex justify-center flex-col pb-28">
          <RankPicker selectedRank={selectedRank} setSelectedRank={setSelectedRank} />
         <div className="absolute bottom-10 w-full">
         <button
            onClick={handleSaveRank}
            className="bg-white text-one text-xs font-semibold rounded-lg shadow hover:bg-one w-full p-3"
          >
            Guardar Rango
          </button>
          <button
            onClick={onClose}
            className="mt-4 bg-one border border-white text-white text-xs font-semibold rounded-lg shadow hover:bg-one w-full p-3"
          >
            Cancelar
          </button>
         </div>
        </div>
      </div>
    </div>
  );
};

export default EditRankModal;
