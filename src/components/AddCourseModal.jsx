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
        await addDoc(courseRef, {
          contactId: selectedContact,
          date: date,
          description: description,
        });
        onClose();
      } catch (error) {
        console.error("Error al agregar curso:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-one flex flex-col justify-between pb-32 items-center z-50 text-white">
      <h2 className="text-sm my-6">Agregar Curso</h2>
      <div className="p-6 w-full max-w-lg flex flex-col gap-10">
        <select
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
          className="bg-transparent outline-none w-full p-4 text-center"
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
          className="bg-transparent outline-none w-full p-4 text-center"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
          className="bg-transparent rounded outline-none w-full p-4 border text-center placeholder:text-white placeholder:text-sm placeholder:opacity-50"
          placeholder="Leccion estudiada"
        ></textarea>

        <div className="flex flex-col justify-between gap-3 mt-10">
          <button
            onClick={handleAddCourse}
            className="py-2 font-semibold bg-white text-one rounded"
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="py-2 bg-transparent rounded text-white border"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
