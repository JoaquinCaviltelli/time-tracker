import { useState, useEffect, useContext } from "react";
import { db } from "../services/firebase";
import { HoursContext } from "../context/HoursContext";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";

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

  return (
    <div className="fixed inset-0 bg-white flex flex-col justify-between pb-32 items-center z-50">
      <h2 className="text-sm font-semibold my-6 text-acent">
        {contact ? "Editar Contacto" : "Agregar Contacto"}
      </h2>
      <div className="p-6 w-full max-w-lg flex flex-col gap-10">
        <input
          type="text"
          placeholder="nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2  text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <input
          type="number"
          placeholder="telefono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2  text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <input
          type="text"
          placeholder="direccion"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2  text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <input
          type="text"
          placeholder="descripcion"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-b text-acent bg-transparent outline-none w-full p-2  text-sm mb-1 font-medium placeholder:text-acent placeholder:text-sm placeholder:opacity-50"
        />

        <div className="flex flex-col justify-between gap-3 mt-10">
          <button
            onClick={handleSave}
            className="py-2 font-semibold bg-one text-white rounded"
          >
            Guardar
          </button>
          <button
            onClick={closeModal}
            className="py-2 bg-transparent font-semibold rounded text-one border border-one"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
