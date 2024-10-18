import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import moment from "moment";
import { useSwipeable } from "react-swipeable";
import TimePicker from "./TimePicker"; // Importar el TimePicker

moment.lang("es", {
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_"
    ),
});

const EditHoursModal = ({ closeModal, selectedEntry, userId }) => {


  const [modalState, setModalState] = useState({
    visible: true,
    animating: true,
  });
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [date, setDate] = useState(
    selectedEntry?.date ? moment(selectedEntry.date).format("YYYY-MM-DD") : ""
  );
  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedEntry) {
      setHours(selectedEntry.hoursWorked);
      setMinutes(selectedEntry.minutesWorked);
      setDate(
        selectedEntry.date
          ? moment(selectedEntry.date).format("YYYY-MM-DD")
          : ""
      );
    } else {
      console.error("selectedEntry es undefined");
    }
  }, [selectedEntry]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalState((prev) => ({ ...prev, animating: false }));
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleEditHours = async (e) => {
    e.preventDefault();
    if (!userId || !selectedEntry?.id) {
      toast.error("Usuario o entrada no válidos");
      return;
    }

    if (hours < 0 || minutes < 0 || minutes >= 60) {
      toast.error("Horas o minutos no válidos");
      return;
    }

    try {
      const entryRef = doc(db, "users", userId, "hours", selectedEntry.id);

      // Verifica si el documento existe antes de actualizar
      const docSnapshot = await getDoc(entryRef);
      if (!docSnapshot.exists()) {
        toast.error("El registro no existe");
        return;
      }

      await updateDoc(entryRef, {
        hoursWorked: parseInt(hours),
        minutesWorked: parseInt(minutes),
        date: date,
      });
      toast.success("Registro actualizado correctamente");
      closeModal();
    } catch (error) {
      toast.error("Error al actualizar el registro");
      console.error(error);
    }
  };

  const handleDeleteHours = async () => {
    if (!userId || !selectedEntry?.id) {
      toast.error("Usuario o entrada no válidos");
      return;
    }

    try {
      const entryRef = doc(db, "users", userId, "hours", selectedEntry.id);
      await deleteDoc(entryRef);
      toast.success("Registro eliminado correctamente");
      closeModal();
    } catch (error) {
      toast.error("Error al eliminar el registro");
      console.error(error);
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModalWithAnimation();
    }
  };

  const closeModalWithAnimation = () => {
    setModalState({ visible: true, animating: true });
    setTimeout(() => {
      closeModal();
    }, 300);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50`}
    >
      {modalState.visible && (
        <div
          ref={modalRef}
          className={`bg-white p-6 pb-10 w-screen transform transition-transform duration-300 ease-in-out ${
            modalState.animating ? "translate-y-full" : "translate-y-0"
          }`}
        >
          {/* <button
            onClick={closeModalWithAnimation}
            className="mb-4 text-gray-500 text-md text-right w-full font-black"
          >
            X
          </button>
          <h2 className="text-4xl font-bold mb-2 text-center text-gray-600">
            {hours}:{minutes}
          </h2> */}

          <form className="max-w-md m-auto" onSubmit={handleEditHours}>
            {/* Reemplazar los selectores de horas y minutos con el TimePicker */}
            <TimePicker
              selectedHour={hours}
              selectedMinute={minutes}
              setSelectedHour={setHours}
              setSelectedMinute={setMinutes}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 p-2 mb-4 w-full rounded text-center"
            />
            <div className="flex w-full justify-between">
              <button
                onClick={handleDeleteHours}
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-white transition"
              >
                Eliminar registro
              </button>
              <button
                type="submit"
                className="bg-one text-white px-4 py-2 rounded hover:bg-white transition"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditHoursModal;
