import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { HoursContext } from "../context/HoursContext";
import moment from "moment";
import EditCourseModal from "/src/components/EditCourseModal.jsx"; // Importamos el modal para agregar/editar curso
import { useNavigate } from "react-router-dom";


const VisitsPage = () => {
  const { contactId } = useParams(); // Obtenemos el contacto de la URL o props
  const { user } = useContext(HoursContext);
  const [courses, setCourses] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // Curso seleccionado para editar
  const [isAdding, setIsAdding] = useState(false); // Flag para distinguir entre agregar/editar
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      const coursesRef = collection(db, "users", user.uid, "courses");
      const unsubscribe = onSnapshot(coursesRef, (snapshot) => {
        const coursesData = snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((course) => course.contactId === contactId) // Solo mostramos los cursos del contacto actual
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenamos por fecha más reciente
        setCourses(coursesData);
      });
      return () => unsubscribe();
    }
  }, [user, contactId]);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      try {
        const courseRef = doc(db, "users", user.uid, "courses", courseId);
        await deleteDoc(courseRef);
      } catch (error) {
        console.error("Error al eliminar el curso:", error);
      }
    }
  };

  const handleAddCourse = () => {
    setSelectedCourse(null); // No hay curso seleccionado, ya que es un nuevo curso
    setIsAdding(true); // Indicamos que estamos agregando un curso
    setIsEditModalOpen(true); // Abrimos el modal para agregar curso
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course); // Establecemos el curso que queremos editar
    setIsAdding(false); // No estamos agregando, estamos editando
    setIsEditModalOpen(true); // Abrimos el modal de edición
  };

  const handleAddNewCourse = async (newCourse) => {
    try {
      const courseRef = collection(db, "users", user.uid, "courses");
      await addDoc(courseRef, {
        ...newCourse,
        contactId, // Asociamos el curso con el contacto seleccionado
      });
      setIsEditModalOpen(false); // Cerramos el modal
    } catch (error) {
      console.error("Error al agregar el curso:", error);
    }
  };

  const handleUpdateCourse = async (updatedCourse) => {
    try {
      const courseRef = doc(db, "users", user.uid, "courses", updatedCourse.id);
      await updateDoc(courseRef, {
        date: updatedCourse.date,
        description: updatedCourse.description,
      });
      setIsEditModalOpen(false); // Cerramos el modal
      setSelectedCourse(null); // Limpiamos el curso seleccionado
    } catch (error) {
      console.error("Error al actualizar el curso:", error);
    }
  };

  const back = ()=> {
  navigate("/agenda")
  }

  return (
    <div className="container mx-auto p-6 pb-28">
      <div className="flex justify-between mt-16 mb-6 items-center">
        <h1 className="text-3xl font-extrabold text-acent ">Curso</h1>

        <button
          onClick={handleAddCourse}
          className="text-white bg-acent border rounded p-2 flex items-center"
        >
          <span className="material-icons">add</span>
        </button>
        <button
          onClick={back}
          className="text-white bg-one border rounded p-2 flex items-cente absolute right-6 top-6"
        >
          <span className="material-icons">arrow_left</span>
        </button>
      </div>
      <div className="space-y-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className="border bg-acent p-4 rounded text-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{course.description}</p>
                <p className="text-sm text-gray-300">
                  {moment(course.date).format("LL")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCourse(course)}
                  className="text-white border p-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-white border p-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No hay cursos registrados para este contacto.
          </p>
        )}
      </div>

      {isEditModalOpen && (
        <EditCourseModal
          course={isAdding ? null : selectedCourse} // Si estamos agregando, pasamos null
          contactId={contactId} // Pasamos el ID del contacto seleccionado
          onClose={() => setIsEditModalOpen(false)}
          onSave={isAdding ? handleAddNewCourse : handleUpdateCourse} // Guardamos dependiendo de si estamos agregando o editando
        />
      )}
    </div>
  );
};

export default VisitsPage;
