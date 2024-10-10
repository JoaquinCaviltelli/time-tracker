import { useState, useContext, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { db } from "../services/firebase";
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import moment from "moment";

const VisitsModal = ({ onClose }) => {
  const { user } = useContext(HoursContext);
  const [entries, setEntries] = useState([]);
  const [contacts, setContacts] = useState({});
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({ date: "", description: "" });

  useEffect(() => {
    if (user) {
      const visitsRef = collection(db, "users", user.uid, "visits");
      const coursesRef = collection(db, "users", user.uid, "courses");

      const unsubscribeVisits = onSnapshot(visitsRef, (snapshot) => {
        const visitsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: `visit-${doc.id}`, type: "visit" }));
        
        // Primero limpiamos entries, luego actualizamos
        setEntries((prevEntries) => [
          ...prevEntries.filter((entry) => entry.type !== "visit"),
          ...visitsData
        ]);
      });

      const unsubscribeCourses = onSnapshot(coursesRef, (snapshot) => {
        const coursesData = snapshot.docs.map((doc) => ({ ...doc.data(), id: `course-${doc.id}`, type: "course" }));
        
        // Limpiamos entries de cursos y actualizamos
        setEntries((prevEntries) => [
          ...prevEntries.filter((entry) => entry.type !== "course"),
          ...coursesData
        ]);
      });

      return () => {
        unsubscribeVisits();
        unsubscribeCourses();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const contactsRef = collection(db, "users", user.uid, "contacts");
      onSnapshot(contactsRef, (snapshot) => {
        const contactsMap = {};
        snapshot.forEach((doc) => {
          contactsMap[doc.id] = doc.data().name;
        });
        setContacts(contactsMap);
      });
    }
  }, [user]);

  const handleEdit = (entry) => {
    setIsEditing(entry.id);
    setEditData({ date: entry.date, description: entry.description });
  };

  const handleSave = async (entry) => {
    const docRef = doc(db, "users", user.uid, entry.type === "visit" ? "visits" : "courses", entry.id.replace(/^(visit-|course-)/, ""));

    try {
      await updateDoc(docRef, {
        date: editData.date,
        description: editData.description,
      });
      setIsEditing(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleDelete = async (entry) => {
    const docRef = doc(db, "users", user.uid, entry.type === "visit" ? "visits" : "courses", entry.id.replace(/^(visit-|course-)/, ""));

    try {
      await deleteDoc(docRef);
      setEntries((prevEntries) => prevEntries.filter((item) => item.id !== entry.id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="bg-white p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Visitas y Cursos</h2>
        
            
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cerrar</button>
        </div>
       
        <ul className="space-y-4">
          {entries
            .sort((a, b) => moment(a.date).diff(moment(b.date)))
            .map((entry) => (
              <li key={entry.id} className="border p-4 rounded shadow">
                {isEditing === entry.id ? (
                  <div>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                      className="border p-2 rounded w-full mb-2"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="border p-2 rounded w-full mb-2"
                      placeholder="Descripción"
                    />
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleSave(entry)} className="bg-blue-500 text-white px-4 py-2 rounded">Guardar</button>
                      <button onClick={() => setIsEditing(null)} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => handleEdit(entry)} className="flex justify-between items-center">
                    <div>

                    <p className="text-lg font-bold">{contacts[entry.contactId] || "Desconocido"}</p>
                    <p>{moment(entry.date).format("YYYY-MM-DD")}</p>
                    <p>{entry.description}</p>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-2">
                      
                      <button onClick={() => handleDelete(entry)} className="bg-red-500 text-white p-2 rounded">
                      <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
        </ul>
        
      </div>
    </div>
  );
};

export default VisitsModal;
