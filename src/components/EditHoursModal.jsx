import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc, deleteDoc } from "firebase/firestore"; // Importar deleteDoc
import { db } from "../services/firebase";
import moment from "moment";
import { useSwipeable } from "react-swipeable";
moment.lang('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
}
);

const EditHoursModal = ({ closeModal, selectedEntry }) => {
  const [modalState, setModalState] = useState({
    visible: true,
    animating: true,
  });
  const [hours, setHours] = useState(selectedEntry.hoursWorked);
  const [minutes, setMinutes] = useState(selectedEntry.minutesWorked);
  const [date, setDate] = useState(moment(selectedEntry.date).format("YYYY-MM-DD"));
  const modalRef = useRef(null);

  // Para las animaciones de los selectores
  const [animateHours, setAnimateHours] = useState(false);
  const [animateMinutes, setAnimateMinutes] = useState(false);

  useEffect(() => {
    setHours(selectedEntry.hoursWorked);
    setMinutes(selectedEntry.minutesWorked);
    setDate(moment(selectedEntry.date).format("YYYY-MM-DD"));
  }, [selectedEntry]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalState((prev) => ({ ...prev, animating: false }));
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleEditHours = async (e) => {
    e.preventDefault();
    if (hours < 0 || minutes < 0 || minutes >= 60) {
      toast.error("Horas o minutos no válidos");
      return;
    }

    try {
      const entryRef = doc(db, "hours", selectedEntry.id);
      await updateDoc(entryRef, {
        hoursWorked: parseInt(hours),
        minutesWorked: parseInt(minutes),
        date: date,
      });
      toast.success("Registro actualizado correctamente");
      closeModal();
    } catch (error) {
      toast.error("Error al actualizar el registro");
    }
  };

  const handleDeleteHours = async () => {
    const entryRef = doc(db, "hours", selectedEntry.id);
    try {
      await deleteDoc(entryRef);
      toast.success("Registro eliminado correctamente");
      closeModal();
    } catch (error) {
      toast.error("Error al eliminar el registro");
    }
  };

  const incrementHours = () => {
    setAnimateHours(true);
    setHours((prev) => Math.min(prev + 1, 23));
    setTimeout(() => setAnimateHours(false), 300);
  };

  const decrementHours = () => {
    setAnimateHours(true);
    setHours((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setAnimateHours(false), 300);
  };

  const incrementMinutes = () => {
    setAnimateMinutes(true);
    setMinutes((prev) => (prev < 55 ? prev + 5 : 0));
    if (minutes >= 55) incrementHours();
    setTimeout(() => setAnimateMinutes(false), 300);
  };

  const decrementMinutes = () => {
    setAnimateMinutes(true);
    setMinutes((prev) => (prev >= 5 ? prev - 5 : hours > 0 ? 55 : 0));
    if (minutes === 0 && hours > 0) decrementHours();
    setTimeout(() => setAnimateMinutes(false), 300);
  };

  const hoursHandlers = useSwipeable({
    onSwipedUp: incrementHours,
    onSwipedDown: decrementHours,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const minutesHandlers = useSwipeable({
    onSwipedUp: incrementMinutes,
    onSwipedDown: decrementMinutes,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

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
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50`}>

      {modalState.visible && (
        <div
          ref={modalRef}
          className={`bg-white p-6 pb-10 w-screen transform transition-transform duration-300 ease-in-out ${
            modalState.animating ? "translate-y-full" : "translate-y-0"
          }`}
        >
          <button onClick={closeModalWithAnimation} className="mb-4 text-gray-500 text-md text-right w-full font-black">
            X
          </button>
          <h2 className="text-4xl font-bold mb-2 text-center text-gray-600">
            {hours}:{minutes < 10 ? "0" + minutes : minutes}
          </h2>
          <form className="max-w-md m-auto" onSubmit={handleEditHours}>
            <div className="flex justify-center mb-4 h-44 items-center">
              <div className="flex flex-col items-center mx-4">
                <div {...hoursHandlers} className="relative">
                  <div
                    className={`flex flex-col items-center h-28 justify-end transition-transform duration-300 ${
                      animateHours ? "transform translate-y-2" : ""
                    }`}
                  >
                    <span className="text-gray-400">{hours > 0 ? hours - 1 : ""}</span>
                    <input
                      type="number"
                      value={hours}
                      readOnly
                      className="border border-gray-300 p-4 w-32 text-center rounded my-2 shadow-md"
                    />
                    <span className="text-gray-400">{hours + 1}</span>
                  </div>
                </div>
                <span className="text-gray-500">Horas</span>
              </div>
              <div className="flex flex-col items-center mx-4">
                <div {...minutesHandlers} className="relative">
                  <div
                    className={`flex flex-col items-center h-28 justify-end transition-transform duration-300 ${
                      animateMinutes ? "transform translate-y-2" : ""
                    }`}
                  >
                    <span className="text-gray-400">{minutes > 0 ? minutes - 5 : ""}</span>
                    <input
                      type="number"
                      value={minutes}
                      readOnly
                      className="border border-gray-300 p-4 w-32 text-center rounded my-2 shadow-md"
                    />
                    <span className="text-gray-400">{minutes + 5}</span>
                  </div>
                </div>
                <span className="text-gray-500">Minutos</span>
              </div>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 p-2 mb-4 w-full rounded text-center"
            />
            <div className="flex w-full justify-between">

          <button onClick={handleDeleteHours} className="bg-red-700 text-white px-4 py-2 rounded hover:bg-white transition">
            Eliminar registro
          </button>
            <button type="submit" className="bg-acent text-white px-4 py-2 rounded hover:bg-white transition">
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
