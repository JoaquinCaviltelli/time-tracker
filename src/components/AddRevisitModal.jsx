import { useState, useContext, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { db } from "../services/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import moment from "moment";

const AddRevisitModal = ({ onClose }) => {
  const { user } = useContext(HoursContext);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState("");
  const [date, setDate] = useState(moment().format("YYYY-MM-DD")); // Fecha actual
  const [notes, setNotes] = useState("");

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

  const handleAddRevisit = async () => {
    if (selectedContact) {
      const revisitRef = collection(db, "users", user.uid, "revisits");
      try {
        onClose();
        await addDoc(revisitRef, {
          contactId: selectedContact,
          date: date,
          notes: notes,
        });
      } catch (error) {
        console.error("Error al agregar revisita:", error);
      }
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-white p-6 w-full h-full flex flex-col text-acent">
        <h2 className="text-base mt-6 mb-20 text-center">Agregar Revisita</h2>
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
            placeholder="Notas sobre la revisita"
          ></textarea>

          <div className="absolute bottom-10 w-full">
            <button
              onClick={handleAddRevisit}
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

export default AddRevisitModal;
