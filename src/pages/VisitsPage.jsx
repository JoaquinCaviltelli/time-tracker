import { useState, useContext, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { db } from "../services/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import moment from "moment";

const VisitsPage = () => {
  const { user } = useContext(HoursContext);
  const [contacts, setContacts] = useState({});
  const [entries, setEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [editData, setEditData] = useState({ date: "", description: "", id: "" });
  const [expandedContact, setExpandedContact] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchContacts = () => {
        const contactsRef = collection(db, "users", user.uid, "contacts");
        onSnapshot(contactsRef, (snapshot) => {
          const contactsMap = {};
          snapshot.forEach((doc) => {
            contactsMap[doc.id] = doc.data().name;
          });
          setContacts(contactsMap);
        });
      };

      const fetchEntries = () => {
        const visitsRef = collection(db, "users", user.uid, "visits");
        const coursesRef = collection(db, "users", user.uid, "courses");

        onSnapshot(visitsRef, (snapshot) => {
          const visitsData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: `visit-${doc.id}`,
            type: "visit",
          }));

          setEntries((prevEntries) => [
            ...prevEntries.filter((entry) => entry.type !== "visit"),
            ...visitsData,
          ]);
        });

        onSnapshot(coursesRef, (snapshot) => {
          const coursesData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: `course-${doc.id}`,
            type: "course",
          }));

          setEntries((prevEntries) => [
            ...prevEntries.filter((entry) => entry.type !== "course"),
            ...coursesData,
          ]);
        });
      };

      fetchContacts();
      fetchEntries();
    }
  }, [user]);

  const groupedEntries = entries.reduce((acc, entry) => {
    const contactId = entry.contactId || "Desconocido";
    if (!acc[contactId]) {
      acc[contactId] = [];
    }
    acc[contactId].push(entry);
    return acc;
  }, {});

  const handleEdit = (entry) => {
    setIsEditing(entry.id);
    setEditData({ date: entry.date, description: entry.description, id: entry.id });
  };

  const handleSave = async () => {
    if (!editData.id) return;

    const docRef = doc(db, "users", user.uid, editData.type === "visit" ? "visits" : "courses", editData.id.replace(/^(visit-|course-)/, ""));
    
    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error("No existe el documento:", docRef.path);
        return;
      }

      await updateDoc(docRef, {
        date: editData.date,
        description: editData.description,
      });
      setIsEditing(null);
      setEditData({ date: "", description: "", id: "" });
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleDelete = async (entry) => {
    const docRef = doc(db, "users", user.uid, entry.type === "visit" ? "visits" : "courses", entry.id.replace(/^(visit-|course-)/, ""));
  
    try {
      await deleteDoc(docRef);
      // Si se elimina un contacto, se mantiene como "Desconocido"
      if (entry.contactId) {
        setContacts((prevContacts) => ({ ...prevContacts, [entry.contactId]: "Desconocido" }));
      }
      setEntries((prevEntries) => prevEntries.filter((item) => item.id !== entry.id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const toggleContact = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-acent mb-6">Cursos</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(groupedEntries).map(([contactId, contactEntries]) => (
          <div key={contactId} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold cursor-pointer" onClick={() => toggleContact(contactId)}>
              {contacts[contactId] || "Desconocido"}
            </h3>
            {expandedContact === contactId && (
              <ul className="space-y-2">
                {contactEntries
                  .sort((a, b) => moment(b.date).diff(moment(a.date)))
                  .map((entry) => (
                    <li key={entry.id} className="border-b py-2 flex justify-between items-center">
                      {isEditing === entry.id ? (
                        <div className="w-full">
                          <input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            className="border p-2 rounded mb-2 w-full"
                          />
                          <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                            className="border p-2 rounded mb-2 w-full"
                            placeholder="Descripción"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="w-full">
                            <p className="text-lg">{moment(entry.date).format("YYYY-MM-DD")}</p>
                            <p>{entry.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit(entry)} className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
                            <button onClick={() => handleDelete(entry)} className="bg-red-500 text-white px-2 py-1 rounded">
                              <span className="material-icons">delete</span>
                            </button>
                          </div>
                        </>
                      )}
                      {isEditing === entry.id && (
                        <div className="flex space-x-2">
                          <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">Guardar</button>
                          <button onClick={() => setIsEditing(null)} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button>
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitsPage;
