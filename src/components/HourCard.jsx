import { useContext, useState } from "react"; // Asegúrate de importar useState
import { HoursContext } from "../context/HoursContext";
import EditHoursModal from "./EditHoursModal"; // Importa el modal de edición
import moment from "moment"; // Asegúrate de importar moment para el formato de fecha

const HourCard = ({ hour }) => {
  const { deleteHours } = useContext(HoursContext);
  const [showEditModal, setShowEditModal] = useState(false); // Estado para mostrar el modal

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      deleteHours(hour.id);
    }
  };

  return (
    <div className="border p-4 mb-4 rounded shadow">
      <p>Fecha: {moment(hour.date).format("DD/MM/YYYY")}</p>
      <p>Horas: {hour.hoursWorked}</p>
      <p>Minutos: {hour.minutesWorked}</p>
      
      <button
        onClick={() => setShowEditModal(true)}
        className="bg-yellow-500 text-white px-4 py-2 mr-2 rounded"
      >
        Editar
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Eliminar
      </button>

      {showEditModal && (
        <EditHoursModal 
          closeModal={() => setShowEditModal(false)} 
          selectedEntry={hour} 
        />
      )}
    </div>
  );
};

export default HourCard;
