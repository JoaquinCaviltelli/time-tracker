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
      closeModal();
      if (contact) {
        const contactRef = doc(db, "users", user.uid, "contacts", contact.id);
        await updateDoc(contactRef, { name, phone, address, description });
      } else {
        const contactsRef = collection(db, "users", user.uid, "contacts");
        await addDoc(contactsRef, { name, phone, address, description });
      }
    } catch (error) {
      console.error("Error al guardar el contacto:", error);
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex justify-center items-center">
      <div className="bg-white p-6 w-full h-full flex flex-col text-acent">
        <h2 className="text-base mt-6 mb-20 text-center">
          {contact ? "Editar Contacto" : "Agregar Contacto"}
        </h2>
        <div className="max-w-md m-auto w-full relative h-full flex flex-col pb-28 gap-10">
          <input
            type="text"
            placeholder="nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
          <input
            type="number"
            placeholder="telefono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
          <input
            type="text"
            placeholder="direccion"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
          <input
            type="text"
            placeholder="descripcion"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-b text-acent bg-transparent outline-none w-full p-2 text-sm mb-1 font-medium placeholder:text-acent placeholder:opacity-50"
          />
  
          <div className="absolute bottom-10 w-full">
            <button
              onClick={handleSave}
              className=" font-semibold bg-one text-white rounded  w-full p-3"
            >
              Guardar
            </button>
            <button
              onClick={closeModal}
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

export default ContactModal;
