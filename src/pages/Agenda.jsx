import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import ContactModal from "/src/components/ContacModal.jsx";
import { collection, onSnapshot } from "firebase/firestore"; 
import { db } from "../services/firebase";

const Agenda = () => {
  const { user } = useContext(HoursContext);
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null); // Estado para el contacto seleccionado

  useEffect(() => {
    if (user) {
      const fetchContacts = () => {
        const contactsRef = collection(db, "users", user.uid, "contacts");
        onSnapshot(contactsRef, (snapshot) => {
          const contactsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setContacts(contactsData);
        });
      };
      fetchContacts();
    }
  }, [user]);

  const handleAddContact = () => {
    setSelectedContact(null); // Limpia el contacto seleccionado
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact); // Establece el contacto seleccionado para editar
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Agenda</h1>
      
      <button 
        onClick={handleAddContact}
        className="bg-acent text-white px-6 py-2 rounded  mb-6"
      >
        Agregar Contacto
      </button>

      <div className="space-y-4">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div 
              key={contact.id} 
              className="border bg-one font-semibold text-white p-8 rounded shadow cursor-pointer"
              onClick={() => handleEditContact(contact)} // Abre el modal de edición al hacer clic
            >
              <p>{contact.name}</p>
              <p>{contact.phone}</p>
              <p>{contact.address}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay contactos en la agenda.</p>
        )}
      </div>

      {isModalOpen && (
        <ContactModal 
          closeModal={() => setIsModalOpen(false)} 
          contact={selectedContact} // Pasa el contacto seleccionado al modal
        />
      )}
    </div>
  );
};

export default Agenda;
