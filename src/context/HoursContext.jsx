import { createContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth"; // Importamos updateProfile para modificar el displayName
import { toast } from "react-toastify";

export const HoursContext = createContext("");

export const HoursProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hours, setHours] = useState([]);
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
      await addDoc(collection(db, "hours"), {
        uid: user.uid,
        hoursWorked: hours,
        minutesWorked: minutes,
        date: date,
      });
      toast.success("Horas añadidas correctamente");
    } catch (error) {
      toast.error("Error al guardar las horas");
    }
  };

  const deleteHours = async (id) => {
    await deleteDoc(doc(db, "hours", id));
  };

  const editHours = async (id, newHours) => {
    await updateDoc(doc(db, "hours", id), { hoursWorked: newHours });
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <HoursContext.Provider value={{ user, hours, goal, setGoal, addHours, deleteHours, editHours, updateGoal, updateDisplayName, logout, loading }}>
      {children}
    </HoursContext.Provider>
  );
};
