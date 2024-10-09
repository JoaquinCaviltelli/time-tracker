import { useState } from "react";
import { toast } from "react-toastify"; // Importamos toast

const EditDisplayNameModal = ({ onClose, initialDisplayName, onSave }) => {
  const [newDisplayName, setNewDisplayName] = useState(initialDisplayName);

  const handleSaveDisplayName = async () => {
    try {
      await onSave(newDisplayName); // Llamar a la función para guardar el nuevo nombre
      toast.success("¡Nombre actualizado correctamente!"); // Mostrar notificación de éxito
      onClose(); // Cerrar el modal después de guardar
    } catch (error) {
      toast.error("Error al actualizar el nombre. Inténtalo de nuevo."); // Mostrar notificación de error
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-one p-6 rounded-lg w-full h-full text-white flex flex-col">
          <h2 className="text-base mt-6 text-center mb-16">Editar nombre</h2>
        <div className="max-w-lg m-auto flex flex-col">

          <input
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            className="font-bold text-3xl bg-transparent text-center p-3  outline-none w-full"
            placeholder="Ingresa tu nuevo nombre"
          />
          <hr className="mb-8 mx-16 border" />

          <button
            onClick={handleSaveDisplayName}
            className="bg-white text-one text-sm font-semibold rounded-lg shadow hover:bg-one w-full p-3"
          >
            Guardar nombre
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

export default EditDisplayNameModal;
