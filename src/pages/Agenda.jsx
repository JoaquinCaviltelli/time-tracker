import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import ContactModal from "/src/components/ContacModal.jsx";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const Agenda = () => {
  const { user } = useContext(HoursContext);
  const [contacts, setContacts] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredContacts, setFilteredContacts] = useState([]); // Estado para contactos filtrados
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

  // Filtrar contactos según el término de búsqueda
  useEffect(() => {
    setFilteredContacts(
      contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [contacts, searchTerm]);

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
      window.confirm(
        "¿Estás seguro de que quieres eliminar este contacto y toda la información relacionada?"
      )
    ) {
      try {
        const contactRef = doc(db, "users", user.uid, "contacts", contactId);
        await deleteDoc(contactRef);

        const visitsRef = collection(db, "users", user.uid, "visits");
        const visitsQuery = query(
          visitsRef,
          where("contactId", "==", contactId)
        );
        const visitsSnapshot = await getDocs(visitsQuery);
        visitsSnapshot.forEach(async (visitDoc) => {
          await deleteDoc(visitDoc.ref);
        });

        const coursesRef = collection(db, "users", user.uid, "courses");
        const coursesQuery = query(
          coursesRef,
          where("contactId", "==", contactId)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        coursesSnapshot.forEach(async (courseDoc) => {
          await deleteDoc(courseDoc.ref);
        });

        console.log("Contacto, visitas y cursos eliminados con éxito.");
      } catch (error) {
        console.error(
          "Error al eliminar el contacto o sus datos relacionados:",
          error
        );
      }
    }
  };

  const handleOpenVisitsPage = (contactId) => {
    navigate(`/visitas/${contactId}`);
  };

  return (
    <div className="container mx-auto p-6 pb-28 max-w-lg">
      <div className="flex justify-between mt-16 mb-6 items-center">
        <h1 className="text-3xl font-extrabold text-acent">Agenda</h1>

        <button
          onClick={handleAddContact}
          className="text-white bg-acent rounded p-2 flex items-center"
        >
          <span className="material-icons">add</span>
        </button>
      </div>
      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border text-acent p-2 mb-4 rounded w-full outline-none"
      />

      <div className="space-y-2">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="border bg-acent text-white p-5 rounded cursor-pointer flex justify-between gap-4 items-center"
            >
              <div className="w-full">
                <p className="font-semibold text-lg mb-1">{contact.name}</p>
                <p className="text-xs font-light">{contact.phone}</p>
                <p className="text-xs font-light">{contact.address}</p>
                <p className="text-xs font-light">{contact.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenVisitsPage(contact.id)}
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
          <>
            <p className="text-gray-500 mb-6">No hay contactos en la agenda.</p>
            <button
              onClick={handleAddContact}
              className=" text-white w-full bg-acent rounded p-3"
            >
              <span>Agregar</span>
            </button>
          </>
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
