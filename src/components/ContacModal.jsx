import { useState, useEffect, useContext } from "react";
import { db } from "../services/firebase";
import { HoursContext } from "../context/HoursContext";
import { doc, updateDoc, addDoc, collection, deleteDoc } from "firebase/firestore";

const ContactModal = ({ closeModal, contact }) => {
  const { user } = useContext(HoursContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setAddress(contact.address);
      setDescription(contact.description);
    } else {
      // Limpia los campos si no hay contacto seleccionado
      setName("");
      setPhone("");
      setAddress("");
      setDescription("");
    }
  }, [contact]);

  const handleSave = async () => {
    try {
      if (contact) {
        const contactRef = doc(db, "users", user.uid, "contacts", contact.id);
        await updateDoc(contactRef, { name, phone, address, description });
      } else {
        const contactsRef = collection(db, "users", user.uid, "contacts");
        await addDoc(contactsRef, { name, phone, address, description });
      }
      closeModal();
    } catch (error) {
      console.error("Error al guardar el contacto:", error);
    }
  };

  const handleDelete = async () => {
    if (contact && window.confirm("¿Estás seguro de que quieres eliminar este contacto?")) {
      try {
        const contactRef = doc(db, "users", user.uid, "contacts", contact.id);
        await deleteDoc(contactRef);
        closeModal();
      } catch (error) {
        console.error("Error al eliminar el contacto:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="bg-white p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">{contact ? "Editar Contacto" : "Agregar Contacto"}</h2>
        
        <label className="block mb-2">
          Nombre:
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="border w-full p-2 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Teléfono:
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="border w-full p-2 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Dirección:
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            className="border w-full p-2 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Descripción:
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="border w-full p-2 rounded mt-1"
          />
        </label>
        

        <div className="flex justify-between space-x-2">
          <button onClick={closeModal} className="px-4 py-2 bg-acent rounded text-white">
            Cancelar
          </button>
          {contact && (
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
              Eliminar
            </button>
          )}
          <button onClick={handleSave} className="px-4 py-2 bg-one text-white rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
