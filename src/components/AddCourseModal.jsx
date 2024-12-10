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
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-white p-6 w-full h-full flex flex-col text-acent">
        <h2 className="text-base mt-6 mb-20 text-center">Agregar Curso</h2>
        <div className="max-w-md m-auto w-full relative h-full flex flex-col pb-28 gap-10">
          <select
            value={selectedContact}
            onChange={(e) => setSelectedContact(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
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
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
  
  <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
            placeholder="Lección estudiada"
          ></textarea>
  
          <div className="absolute bottom-10 w-full">
            <button
              onClick={handleAddCourse}
              className="font-semibold bg-one text-white rounded w-full p-3"
            >
              Agregar
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

export default AddCourseModal;
