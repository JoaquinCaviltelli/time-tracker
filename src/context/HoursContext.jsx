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
  const [contacts, setContacts] = useState([]);
  const [goal, setGoal] = useState(15);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("publicador"); // Estado de rango
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false); // Estado para el modal de rango


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(collection(db, "hours"), where("uid", "==", currentUser.uid));
        onSnapshot(q, (snapshot) => {
          const hoursData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setHours(hoursData);
        });

        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setGoal(userData.goal || 15);
          setRange(userData.rango || "publicador");
        } else {
          await setDoc(userDocRef, { goal: 15, rango: "publicador" });
        }

        const contactsRef = collection(db, "users", currentUser.uid, "contacts");
        onSnapshot(contactsRef, (snapshot) => {
          const contactsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setContacts(contactsData);
        });

        setLoading(false);
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
      setGoal(newGoal);
    }
  };

  const updateDisplayName = async (newDisplayName) => {
    if (user) {
      try {
        await updateProfile(auth.currentUser, { displayName: newDisplayName });
        setUser({ ...user, displayName: newDisplayName });
      } catch (error) {
        console.error("Error al actualizar el displayName:", error);
        throw new Error("No se pudo actualizar el nombre.");
      }
    }
  };

  const updateRange = async (newRange) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { rango: newRange });
        setRange(newRange);
      } catch (error) {
        console.error("Error al actualizar el rango:", error);
        throw new Error("No se pudo actualizar el rango.");
      }
    }
  };

  const addHours = async (date, hours, minutes, serviceType) => {
    try {
      if (user) {
        const userHoursRef = collection(db, "users", user.uid, "hours");
        const q = query(userHoursRef, where("date", "==", date), where("serviceType", "==", serviceType));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const existingDoc = querySnapshot.docs[0];
          await updateDoc(existingDoc.ref, {
            hoursWorked: existingDoc.data().hoursWorked + hours,
            minutesWorked: existingDoc.data().minutesWorked + minutes,
          });
        } else {
          await addDoc(userHoursRef, {
            date,
            hoursWorked: hours,
            minutesWorked: minutes,
            serviceType,
          });
        }
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
      
    }
  };

  const deleteContact = async (id) => {
    if (user) {
      const contactRef = doc(db, "users", user.uid, "contacts", id);
      await deleteDoc(contactRef);
      
    }
  };

  const editContact = async (id, updatedData) => {
    if (user) {
      const contactRef = doc(db, "users", user.uid, "contacts", id);
      await updateDoc(contactRef, updatedData);
      
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
        contacts,
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
        updateRange, // Actualización de rango
        range, // Estado de rango
        logout,
        loading,
        isRangeModalOpen,
        setIsRangeModalOpen
      }}
    >
      {children}
    </HoursContext.Provider>
  );
};
