import { useState, useContext, useRef, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import moment from "moment";
import TimePicker from "./TimePicker";

const ModalAddHours = () => {
  const [modalState, setModalState] = useState({
    visible: false,
    animating: false,
  });
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const { addHours } = useContext(HoursContext);
  const modalRef = useRef(null);

  // Para capturar las horas y minutos seleccionados en el TimePicker
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [serviceType, setServiceType] = useState("campo");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir a enteros y añadir horas
    addHours(
      date,
      parseInt(selectedHour),
      parseInt(selectedMinute),
      serviceType
    );
    closeModal();
  };

  const openModal = () => {
    setSelectedHour(0);
    setSelectedMinute(0);
    setDate(moment().format("YYYY-MM-DD"));
    setModalState({ visible: true, animating: true });

    setTimeout(() => {
      setModalState((prev) => ({ ...prev, animating: false }));
    }, 10);
  };

  const closeModal = () => {
    setModalState({ visible: true, animating: true });
    setTimeout(() => {
      setModalState({ visible: false, animating: false });
    }, 300);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-acent text-white hover:bg-one transition rounded-full w-14 h-14 flex justify-center items-center absolute right-0 bottom-0"
      >
        <span className="material-icons font-semibold">add</span>
      </button>

      {modalState.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
          <div
            ref={modalRef}
            className={`bg-white p-6 pb-10 w-screen transform transition-transform duration-300 ease-in-out ${
              modalState.animating ? "translate-y-full" : "translate-y-0"
            }`}
          >
            {/* <button onClick={closeModal} className="mb-4 text-gray-500 text-md text-right w-full font-black">
              X
            </button> */}
            {/* <h2 className="text-4xl font-bold mb-2 text-center text-gray-600">
              {selectedHour}:{selectedMinute}
            </h2> */}
  {serviceType === "campo" ? (
                <button
                  type="button"
                  className="w-full text-one font-bold pt-4  flex justify-center items-center gap-2"
                  onClick={() => {
                    setServiceType("credito");
                  }}
                >
                  {"Servicio al campo"}
                  {/* <span className="material-icons font-semibold rotate-0 transition-all">
                    swap_horiz
                  </span> */}
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full text-one font-bold pt-4 capitalize flex justify-center items-center gap-2 "
                  onClick={() => {
                    setServiceType("campo");
                  }}
                >
                  {"Credito"}
                  {/* <span className="material-icons font-semibold rotate-180 transition-all">
                    swap_horiz
                  </span> */}
                </button>
              )}
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-4">
                {/* Aquí se inserta el TimePicker */}
                <TimePicker
                  selectedHour={selectedHour}
                  selectedMinute={selectedMinute}
                  setSelectedHour={setSelectedHour}
                  setSelectedMinute={setSelectedMinute}
                />
              </div>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border outline-none border-gray-300 p-4 mb-4 w-full rounded text-center bg-white flex justify-center appearance-none text-one font-bold pl-10"
                style={{
                  WebkitAppearance: "none",
                  background: "transparent",
                }}
              />
              

              <div className="mt-6 flex w-full justify-center">
                {/* <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-700 text-white px-4 py-2 rounded hover:bg-white transition"
                >
                  Cancelar
                </button> */}
                <button
                  type="submit"
                  className="bg-one text-white px-4 py-2 rounded hover:bg-white transition w-full"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalAddHours;
