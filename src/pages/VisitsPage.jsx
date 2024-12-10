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
import EditCourseModal from "/src/components/EditCourseModal.jsx";
import EditRevisitModal from "/src/components/EditRevisitModal.jsx"; // Importamos el modal para revisitas
import { useNavigate } from "react-router-dom";

const VisitsPage = () => {
  const { contactId } = useParams();
  const { user } = useContext(HoursContext);
  const [courses, setCourses] = useState([]);
  const [revisits, setRevisits] = useState([]);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditRevisitModalOpen, setIsEditRevisitModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedRevisit, setSelectedRevisit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const coursesRef = collection(db, "users", user.uid, "courses");
      const revisitsRef = collection(db, "users", user.uid, "revisits");

      const unsubscribeCourses = onSnapshot(coursesRef, (snapshot) => {
        const coursesData = snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((course) => course.contactId === contactId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setCourses(coursesData);
      });

      const unsubscribeRevisits = onSnapshot(revisitsRef, (snapshot) => {
        const revisitsData = snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .filter((revisit) => revisit.contactId === contactId)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setRevisits(revisitsData);
      });

      return () => {
        unsubscribeCourses();
        unsubscribeRevisits();
      };
    }
  }, [user, contactId]);

  const handleDelete = async (type, id) => {
    const refPath = type === "course" ? "courses" : "revisits";
    if (window.confirm(`¿Estás seguro de que deseas eliminar este ${type}?`)) {
      try {
        const ref = doc(db, "users", user.uid, refPath, id);
        await deleteDoc(ref);
      } catch (error) {
        console.error(`Error al eliminar el ${type}:`, error);
      }
    }
  };

  const handleAdd = (type) => {
    if (type === "course") {
      setSelectedCourse(null);
      setIsAdding(true);
      setIsEditCourseModalOpen(true);
    } else {
      setSelectedRevisit(null);
      setIsAdding(true);
      setIsEditRevisitModalOpen(true);
    }
  };

  const handleEdit = (type, item) => {
    if (type === "course") {
      setSelectedCourse(item);
      setIsAdding(false);
      setIsEditCourseModalOpen(true);
    } else {
      setSelectedRevisit(item);
      setIsAdding(false);
      setIsEditRevisitModalOpen(true);
    }
  };

  const handleAddNew = async (type, newItem) => {
    const refPath = type === "course" ? "courses" : "revisits";
    try {
      const ref = collection(db, "users", user.uid, refPath);
      await addDoc(ref, {
        ...newItem,
        contactId,
      });
      if (type === "course") {
        setIsEditCourseModalOpen(false);
      } else {
        setIsEditRevisitModalOpen(false);
      }
    } catch (error) {
      console.error(`Error al agregar el ${type}:`, error);
    }
  };

  const handleUpdate = async (type, updatedItem) => {
    const refPath = type === "course" ? "courses" : "revisits";
    try {
      const ref = doc(db, "users", user.uid, refPath, updatedItem.id);
      await updateDoc(ref, updatedItem);
      if (type === "course") {
        setIsEditCourseModalOpen(false);
        setSelectedCourse(null);
      } else {
        setIsEditRevisitModalOpen(false);
        setSelectedRevisit(null);
      }
    } catch (error) {
      console.error(`Error al actualizar el ${type}:`, error);
    }
  };

  const back = () => {
    navigate("/agenda");
  };

  return (
    <div className="container mx-auto p-6 pb-28 max-w-lg">
      <div className="flex justify-between mt-16 mb-6 items-center">
        <h1 className="text-3xl font-extrabold text-acent">Visitas</h1>
        <div className="flex">

        <button
          onClick={() => handleAdd("course")}
          className="text-white bg-acent border rounded p-2 flex items-center"
          >
          <span className="material-icons">add</span> Curso
        </button>
        <button
          onClick={() => handleAdd("revisit")}
          className="text-white bg-acent border rounded p-2 flex items-center"
          >
          <span className="material-icons">add</span> Revisita
        </button>
        </div>
        <button
          onClick={back}
          className="text-white bg-one border rounded p-2 flex items-center absolute right-6 top-6"
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
                  onClick={() => handleEdit("course", course)}
                  className="text-white border p-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete("course", course.id)}
                  className="text-white border p-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay cursos registrados.</p>
        )}

        
        {revisits.length > 0 ? (
          revisits.map((revisit) => (
            <div
              key={revisit.id}
              className="border bg-acent p-4 rounded text-white flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{revisit.notes}</p>
                <p className="text-sm text-gray-300">
                  {moment(revisit.date).format("LL")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit("revisit", revisit)}
                  className="text-white border p-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete("revisit", revisit.id)}
                  className="text-white border p-2 rounded"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay revisitas registradas.</p>
        )}
      </div>

      {isEditCourseModalOpen && (
        <EditCourseModal
          course={isAdding ? null : selectedCourse}
          contactId={contactId}
          onClose={() => setIsEditCourseModalOpen(false)}
          onSave={(data) => handleUpdate("course", data)}
        />
      )}

      {isEditRevisitModalOpen && (
        <EditRevisitModal
          revisit={isAdding ? null : selectedRevisit}
          contactId={contactId}
          onClose={() => setIsEditRevisitModalOpen(false)}
          onSave={(data) => handleUpdate("revisit", data)}
        />
      )}
    </div>
  );
};

export default VisitsPage;
