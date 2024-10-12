import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import ContactModal from "/src/components/ContacModal.jsx";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const Agenda = () => {
  const { user } = useContext(HoursContext);
  const [contacts, setContacts] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchContacts = () => {
        const contactsRef = collection(db, "users", user.uid, "contacts");
        onSnapshot(contactsRef, (snapshot) => {
          const contactsData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setContacts(contactsData);
        });
      };
      fetchContacts();
    }
  }, [user]);

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este contacto?")
    ) {
      try {
        const contactRef = doc(db, "users", user.uid, "contacts", contactId);
        await deleteDoc(contactRef);
      } catch (error) {
        console.error("Error al eliminar el contacto:", error);
      }
    }
  };

  const handleOpenVisitsPage = (contactId) => {
    navigate(`/visitas/${contactId}`); // Navega a la página de visitas con el ID del contacto
  };

  return (
    <div className="container mx-auto p-6 pb-28">
      <div className="flex justify-between mt-16 mb-6 items-center">
      <h1 className="text-3xl font-extrabold text-acent ">Agenda</h1>

        <button
          onClick={handleAddContact}
          className="text-white bg-one border rounded p-2 flex items-center"
        >
          <span className="material-icons">add</span>
        </button>
      </div>

      <div className="space-y-4">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="border bg-one text-white p-5 rounded cursor-pointer flex justify-between gap-4 items-center"
            >
              <div className="w-full">
                <p className="font-semibold text-lg mb-1">{contact.name}</p>
                <p className="text-xs font-light">{contact.phone}</p>
                <p className="text-xs font-light">{contact.address}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenVisitsPage(contact.id)} // Navegar a la página de visitas del contacto
                  className="text-white border rounded p-2 flex items-center"
                >
                  <span className="material-icons">visibility</span>
                </button>
                <button
                  onClick={() => handleEditContact(contact)}
                  className="text-white border rounded p-2 flex items-center"
                >
                  <span className="material-icons">edit</span>
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-white border rounded p-2 flex items-center"
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay contactos en la agenda.</p>
        )}
      </div>

      {isContactModalOpen && (
        <ContactModal
          closeModal={() => setIsContactModalOpen(false)}
          contact={selectedContact}
        />
      )}
    </div>
  );
};

export default Agenda;
