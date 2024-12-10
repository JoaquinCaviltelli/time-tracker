import { useState } from "react";
import moment from "moment";

const EditRevisitModal = ({ revisit, contactId, onClose, onSave }) => {
  const [date, setDate] = useState(
    revisit ? revisit.date : moment().format("YYYY-MM-DD")
  );
  const [notes, setNotes] = useState(
    revisit ? revisit.notes : ""
  );

  const handleSave = () => {
    const revisitData = {
      contactId, // Asociamos la revisita al contacto seleccionado
      date,
      notes, // Cambiamos "description" por "notes"
    };

    if (revisit && revisit.id) {
      revisitData.id = revisit.id; // Incluimos el ID de la revisita si estamos editando
    }

    onSave(revisitData); // Llamamos a la función para guardar los datos
  };

  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-white p-6 w-full h-full flex flex-col text-one">
        <h2 className="text-base mt-6 mb-20 text-center">
          {revisit ? "Editar Revisita" : "Agregar Revisita"}
        </h2>
        <div className="max-w-md m-auto w-full relative h-full flex flex-col pb-28 gap-10">
          <input
            type="date"
            value={moment(date).format("YYYY-MM-DD")}
            onChange={(e) => setDate(e.target.value)}
            className="border-b text-one bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-one placeholder:opacity-50"
          />

          <textarea
            value={notes} // Cambiamos "description" por "notes"
            onChange={(e) => setNotes(e.target.value)} // Actualizamos "notes"
            className="border-b text-one bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-one placeholder:opacity-50"
            placeholder="Notas sobre la revisita" // Actualizamos el placeholder
            rows={4} // Aumentamos el tamaño del campo para las notas
          />

          <div className="absolute bottom-10 w-full">
            <button
              onClick={handleSave}
              className="font-semibold bg-acent text-white rounded w-full p-3"
            >
              {revisit ? "Actualizar" : "Agregar"}
            </button>
            <button
              onClick={onClose}
              className="mt-4 bg-transparent font-semibold rounded text-acent border border-acent w-full p-3"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRevisitModal;
