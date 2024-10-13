import { createContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";

export const HoursContext = createContext("");

export const HoursProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hours, setHours] = useState([]);
  const [contacts, setContacts] = useState([]); // Estado para contactos
  const [goal, setGoal] = useState(30); // Meta mensual predeterminada
  const [loading, setLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Cargar las horas trabajadas
        const q = query(collection(db, "hours"), where("uid", "==", currentUser.uid));
        onSnapshot(q, (snapshot) => {
          const hoursData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setHours(hoursData);
        });

        // Cargar la meta de horas desde Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setGoal(userDocSnap.data().goal || 30); // Meta por defecto si no se encuentra
        } else {
          // Crear un documento para el usuario con la meta por defecto
          await setDoc(userDocRef, { goal: 30 });
        }

        // Cargar contactos
        const contactsRef = collection(db, "users", currentUser.uid, "contacts");
        onSnapshot(contactsRef, (snapshot) => {
          const contactsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setContacts(contactsData);
        });

        setLoading(false); // Dejamos de cargar cuando tenemos los datos
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateGoal = async (newGoal) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { goal: newGoal });
      setGoal(newGoal); // Actualizar el estado local
    }
  };

  // Función para actualizar el displayName del usuario en Firebase
  const updateDisplayName = async (newDisplayName) => {
    if (user) {
      try {
        await updateProfile(auth.currentUser, { displayName: newDisplayName });
        setUser({ ...user, displayName: newDisplayName }); // Actualizar el estado local del usuario
      } catch (error) {
        console.error("Error al actualizar el displayName:", error);
        throw new Error("No se pudo actualizar el nombre.");
      }
    }
  };

  const addHours = async (date, hours, minutes) => {
    try {
      if (user) {
        // Referencia a la subcolección 'hours' dentro del documento del usuario
        const userHoursRef = collection(db, "users", user.uid, "hours");

        // Consultar si ya existen horas para esa fecha
        const q = query(userHoursRef, where("date", "==", date));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Si existe un registro para esa fecha, actualizamos las horas
          const existingDoc = querySnapshot.docs[0]; // Obtenemos el primer documento encontrado
          await updateDoc(existingDoc.ref, {
            hoursWorked: existingDoc.data().hoursWorked + hours,
            minutesWorked: existingDoc.data().minutesWorked + minutes,
          });
        } else {
          // Si no existe, creamos un nuevo registro
          await addDoc(userHoursRef, {
            date: date,
            hoursWorked: hours,
            minutesWorked: minutes,
          });
        }
        toast.success("Horas añadidas correctamente");
      } else {
        throw new Error("Usuario no autenticado");
      }
    } catch (error) {
      console.error("Error al guardar las horas:", error);
      toast.error("Error al guardar las horas");
    }
  };


  const deleteHours = async (id) => {
    await deleteDoc(doc(db, "hours", id));
  };

  const editHours = async (id, newHours) => {
    await updateDoc(doc(db, "hours", id), { hoursWorked: newHours });
  };

  const addContact = async (name, phone, address, description) => {
    if (user) {
      const contactsRef = collection(db, "users", user.uid, "contacts");
      await addDoc(contactsRef, { name, phone, address, description });
      toast.success("Contacto añadido correctamente");
    }
  };

  const deleteContact = async (id) => {
    if (user) {
      const contactRef = doc(db, "users", user.uid, "contacts", id);
      await deleteDoc(contactRef);
      toast.success("Contacto eliminado");
    }
  };

  const editContact = async (id, updatedData) => {
    if (user) {
      const contactRef = doc(db, "users", user.uid, "contacts", id);
      await updateDoc(contactRef, updatedData);
      toast.success("Contacto actualizado");
    }
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <HoursContext.Provider
      value={{
        user,
        hours,
        contacts, // Incluyendo contactos en el contexto
        goal,
        setGoal,
        addHours,
        deleteHours,
        editHours,
        addContact,
        deleteContact,
        editContact,
        updateGoal,
        updateDisplayName,
        logout,
        loading,
      }}
    >
      {children}
    </HoursContext.Provider>
  );
};
