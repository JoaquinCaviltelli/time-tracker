// AddCourseModal.jsx
import { useState, useContext, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { db } from "../services/firebase";
import { collection, addDoc, query, where, onSnapshot, doc, getDocs } from "firebase/firestore";
import moment from "moment";

const AddCourseModal = ({ onClose }) => {
  const { user } = useContext(HoursContext);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState("");

  useEffect(() => {
    if (user) {
      const contactsRef = collection(db, "users", user.uid, "contacts");
      const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
        setContacts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddCourse = async () => {
    if (selectedContact) {
      const courseRef = collection(db, "users", user.uid, "courses");
      const currentDate = moment().format("YYYY-MM-DD");

      try {
        await addDoc(courseRef, {
          contactId: selectedContact,
          date: currentDate,
        });
        onClose();
      } catch (error) {
        console.error("Error al agregar curso:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Selecciona un Contacto</h2>
        <select
          value={selectedContact}
          onChange={(e) => setSelectedContact(e.target.value)}
          className="border w-full p-2 rounded mt-1 mb-4"
        >
          <option value="">Seleccione un contacto</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
          <button onClick={handleAddCourse} className="px-4 py-2 bg-blue-600 text-white rounded">Agregar Curso</button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
