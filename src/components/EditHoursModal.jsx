import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import moment from "moment";
import { useSwipeable } from "react-swipeable";
import "/src/styles/tailwind.css";
import TimePicker from "./TimePicker"; // Importar el TimePicker

moment.lang("es", {
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_"
    ),
});

const EditHoursModal = ({ closeModal, selectedEntry, userId }) => {
  const [serviceType, setServiceType] = useState(0);
  const [service, setService] = useState(selectedEntry[0].serviceType);

  const [modalState, setModalState] = useState({
    visible: true,
    animating: true,
  });
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();
  const [date, setDate] = useState(
    selectedEntry?.date
      ? moment(selectedEntry[serviceType].date).format("YYYY-MM-DD")
      : ""
  );
  const modalRef = useRef(null);

  useEffect(() => {
    if (selectedEntry.length > 1) {
      if (selectedEntry[0].serviceType === "campo") {
        if (service === "campo") {
          setServiceType(0);
        } else {
          setServiceType(1);
        }
      }
      if (selectedEntry[0].serviceType === "credito") {
        if (service === "credito") {
          setServiceType(0);
        } else {
          setServiceType(1);
        }
      }
    }
  }, [service]);

  useEffect(() => {
    if (selectedEntry) {
      setHours(selectedEntry[serviceType].hoursWorked);
      setMinutes(selectedEntry[serviceType].minutesWorked);
      setDate(
        selectedEntry[serviceType].date
          ? moment(selectedEntry[serviceType].date).format("YYYY-MM-DD")
          : ""
      );
    } else {
      console.error("selectedEntry es undefined");
    }
  }, [selectedEntry, serviceType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalState((prev) => ({ ...prev, animating: false }));
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleEditHours = async (e) => {
    e.preventDefault();
    if (!userId || !selectedEntry[serviceType]?.id) {
      toast.error("Usuario o entrada no válidos");
      return;
    }

    if (hours < 0 || minutes < 0 || minutes >= 60) {
      toast.error("Horas o minutos no válidos");
      return;
    }
    
    try {
      closeModal();
      const entryRef = doc(
        db,
        "users",
        userId,
        "hours",
        selectedEntry[serviceType].id
      );

      // Verifica si el documento existe antes de actualizar
      // const docSnapshot = await getDoc(entryRef);
      // if (!docSnapshot.exists()) {
      //   toast.error("El registro no existe");
      //   return;
      // }

      await updateDoc(entryRef, {
        hoursWorked: parseInt(hours),
        minutesWorked: parseInt(minutes),
        date: date,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteHours = async () => {
    if (!userId || !selectedEntry[serviceType]?.id) {
      toast.error("Usuario o entrada no válidos");
      return;
    }

    try {
      const entryRef = doc(
        db,
        "users",
        userId,
        "hours",
        selectedEntry[serviceType].id
      );
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

          {selectedEntry.length > 1 ? (
            <button
              type="button"
              className="w-full text-one font-bold flex justify-center items-center flex-col"
              onClick={() => {
                if (service === "campo") {
                  setService("credito");
                } else {
                  setService("campo");
                }
              }}
            >
              <>
                {service === "campo" ? (
                  <>
                    <span className="material-icons font-semibold rotate-0 transition-all ">
                      swap_horiz
                    </span>
                    <p>Servicio del campo</p>
                  </>
                ) : (
                  <>
                    <span className="material-icons font-semibold rotate-180 transition-all">
                      swap_horiz
                    </span>
                    <p>Credito</p>
                  </>
                )}
              </>
            </button>
          ) : (
            <button
              type="button"
              className="w-full text-one font-bold pt-4 "
            >
              {service === "campo" ? "Servicio del campo" : "Credito"}
            </button>
          )}
          <form className="max-w-md m-auto mb-4" onSubmit={handleEditHours}>
            {/* Reemplazar los selectores de horas y minutos con el TimePicker */}
            <TimePicker
              selectedHour={hours}
              selectedMinute={minutes}
              setSelectedHour={setHours}
              setSelectedMinute={setMinutes}
              serviceType={serviceType}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border outline-none border-gray-300 p-4 mb-4 w-full rounded text-center bg-white flex justify-center appearance-none text-one font-bold pl-8"
              style={{
                WebkitAppearance: "none",
                background: "transparent",
              }}
            />
            {/* Input tipo radio para seleccionar el tipo de servicio */}

            <div className="mt-6 flex w-full justify-between">
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
