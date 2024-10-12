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

  // Función para eliminar el contacto y las visitas/cursos asociados
  const handleDeleteContact = async (contactId) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este contacto y toda la información relacionada?"
      )
    ) {
      try {
        // 1. Eliminar el contacto
        const contactRef = doc(db, "users", user.uid, "contacts", contactId);
        await deleteDoc(contactRef);

        // 2. Eliminar las visitas asociadas
        const visitsRef = collection(db, "users", user.uid, "visits");
        const visitsQuery = query(
          visitsRef,
          where("contactId", "==", contactId)
        );
        const visitsSnapshot = await getDocs(visitsQuery);
        visitsSnapshot.forEach(async (visitDoc) => {
          await deleteDoc(visitDoc.ref); // Eliminar cada visita
        });

        // 3. Eliminar los cursos asociados
        const coursesRef = collection(db, "users", user.uid, "courses");
        const coursesQuery = query(
          coursesRef,
          where("contactId", "==", contactId)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        coursesSnapshot.forEach(async (courseDoc) => {
          await deleteDoc(courseDoc.ref); // Eliminar cada curso
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
