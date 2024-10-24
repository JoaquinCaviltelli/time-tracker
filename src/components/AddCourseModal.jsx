import { useState, useContext, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { db } from "../services/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import moment from "moment";

const AddCourseModal = ({ onClose }) => {
  const { user } = useContext(HoursContext);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD")); // Fecha por defecto al día de hoy
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user) {
      const contactsRef = collection(db, "users", user.uid, "contacts");
      const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
        setContacts(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddCourse = async () => {
    if (selectedContact) {
      const courseRef = collection(db, "users", user.uid, "courses");
      try {
        onClose();
        await addDoc(courseRef, {
          contactId: selectedContact,
          date: date,
          description: description,
        });
      } catch (error) {
        console.error("Error al agregar curso:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col  items-center z-50 text-acent mt-6">
      <h2 className="text-sm font-semibold mb-24">Agregar Curso</h2>
      <div className="p-6 w-full max-w-lg flex flex-col gap-10">
        <select
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2  text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        >
          <option value="">Seleccione un contacto</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2  text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2  text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
          placeholder="Lección estudiada"
        />

        <div className="flex flex-col justify-between gap-3 mt-10">
          <button
            onClick={handleAddCourse}
            className="py-2 font-semibold bg-one text-white rounded"
          >
            Agregar
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

export default AddCourseModal;
