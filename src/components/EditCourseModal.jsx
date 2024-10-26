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
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-white p-6 w-full h-full flex flex-col text-acent">
        <h2 className="text-base mt-6 mb-20 text-center">
          {course ? "Editar Curso" : "Agregar Curso"}
        </h2>
        <div className="max-w-md m-auto w-full relative h-full flex flex-col pb-28 gap-10">
          <input
            type="date"
            value={moment(date).format("YYYY-MM-DD")}
            onChange={(e) => setDate(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
  
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
            placeholder="Lección estudiada"
          />
  
          <div className="absolute bottom-10 w-full">
            <button
              onClick={handleSave}
              className="font-semibold bg-one text-white rounded w-full p-3"
            >
              {course ? "Actualizar" : "Agregar"}
            </button>
            <button
              onClick={onClose}
              className="mt-4 bg-transparent font-semibold rounded text-one border border-one w-full p-3"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default EditCourseModal;
