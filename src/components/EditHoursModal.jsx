import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import moment from "moment";

const EditHoursModal = ({ closeModal, selectedEntry }) => {
  const [hours, setHours] = useState(selectedEntry.hoursWorked);
  const [minutes, setMinutes] = useState(selectedEntry.minutesWorked);
  const [date, setDate] = useState(moment(selectedEntry.date).format("YYYY-MM-DD"));

  useEffect(() => {
    setHours(selectedEntry.hoursWorked);
    setMinutes(selectedEntry.minutesWorked);
    setDate(moment(selectedEntry.date).format("YYYY-MM-DD"));
  }, [selectedEntry]);

  const handleEditHours = async (e) => {
    e.preventDefault();
    if (hours < 0 || minutes < 0 || minutes >= 60) {
      toast.error("Horas o minutos no válidos");
      return;
    }

    try {
      const entryRef = doc(db, "hours", selectedEntry.id);
      await updateDoc(entryRef, {
        hoursWorked: parseInt(hours),
        minutesWorked: parseInt(minutes),
        date: date,
      });
      toast.success("Registro actualizado correctamente");
      closeModal(); // Cerrar el modal al guardar
    } catch (error) {
      toast.error("Error al actualizar el registro");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
        <div className="bg-white p-10 rounded w-full h-1/2">
          <h2 className="text-xl mb-4">Editar horas trabajadas</h2>
          <form onSubmit={handleEditHours}>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Horas trabajadas"
              className="border p-2 mb-4 w-full"
              min="0"
              required
            />
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Minutos trabajados"
              className="border p-2 mb-4 w-full"
              min="0"
              max="59"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Guardar cambios
            </button>
            <button type="button" onClick={closeModal} className="bg-red-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditHoursModal;
