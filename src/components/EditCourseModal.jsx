import { useState } from "react";
import moment from "moment";

const EditCourseModal = ({ course, contactId, onClose, onSave }) => {
  const [date, setDate] = useState(
    course ? course.date : moment().format("YYYY-MM-DD")
  );
  const [description, setDescription] = useState(
    course ? course.description : ""
  );

  const handleSave = () => {
    const courseData = {
      contactId, // Contacto preseleccionado
      date,
      description,
    };

    if (course) {
      courseData.id = course.id; // Si estamos editando, mantenemos el ID del curso
    }

    onSave(courseData); // Llamamos a la función de guardado
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col  items-center z-50 text-acent mt-6">
      <h2 className="text-sm font-semibold mb-24">
        {course ? "Editar Curso" : "Agregar Curso"}
      </h2>
      <div className="p-6 w-full max-w-lg flex flex-col gap-10">
        <input
          type="date"
          value={moment(date).format("YYYY-MM-DD")}
          onChange={(e) => setDate(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
          placeholder="Lección estudiada"
        />

        <div className="flex flex-col justify-between gap-3 mt-10">
          <button
            onClick={handleSave}
            className="py-2 font-semibold bg-one text-white rounded"
          >
            {course ? "Actualizar" : "Agregar"}
          </button>
          <button
            onClick={onClose}
            className="py-2 bg-transparent font-semibold rounded text-one border border-one"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCourseModal;
