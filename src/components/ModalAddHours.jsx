import { useState, useContext, useRef, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import moment from "moment";
import { useSwipeable } from "react-swipeable";

const ModalAddHours = () => {
  const [modalState, setModalState] = useState({
    visible: false,
    animating: false,
  });
  const [hoursWorked, setHoursWorked] = useState(0);
  const [minutesWorked, setMinutesWorked] = useState(0);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const { addHours } = useContext(HoursContext);
  const modalRef = useRef(null);

  const [animateHours, setAnimateHours] = useState(false);
  const [animateMinutes, setAnimateMinutes] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addHours(date, parseInt(hoursWorked), parseInt(minutesWorked));
    closeModal();
  };

  const openModal = () => {
    setHoursWorked(0);
    setMinutesWorked(0);
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

  const incrementHours = () => {
    setAnimateHours(true);
    setHoursWorked((prev) => Math.min(prev + 1, 23));
    setTimeout(() => setAnimateHours(false), 300);
  };

  const decrementHours = () => {
    setAnimateHours(true);
    setHoursWorked((prev) => Math.max(prev - 1, 0));
    setTimeout(() => setAnimateHours(false), 300);
  };

  const incrementMinutes = () => {
    setAnimateMinutes(true);
    setMinutesWorked((prev) => (prev < 55 ? prev + 5 : 0));
    if (minutesWorked >= 55) incrementHours();
    setTimeout(() => setAnimateMinutes(false), 300);
  };

  const decrementMinutes = () => {
    setAnimateMinutes(true);
    setMinutesWorked((prev) => (prev >= 5 ? prev - 5 : hoursWorked > 0 ? 55 : 0));
    if (minutesWorked === 0 && hoursWorked > 0) decrementHours();
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
            <button onClick={closeModal} className="mb-4 text-gray-500 text-md text-right w-full font-black">
              X
            </button>
            <h2 className="text-4xl font-bold mb-2 text-center text-gray-600">
              {hoursWorked}:{minutesWorked < 10 ? "0" + minutesWorked : minutesWorked}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center mb-4 h-44 items-center">
                <div className="flex flex-col items-center mx-4">
                  <div {...hoursHandlers} className="relative">
                    <div
                      className={`flex flex-col items-center h-28 justify-end transition-transform duration-300 ${
                        animateHours ? "transform translate-y-2" : ""
                      }`}
                    >
                      <span className="text-gray-400">{hoursWorked > 0 ? hoursWorked - 1 : ""}</span>
                      <input
                        type="number"
                        value={hoursWorked}
                        readOnly
                        className="border border-gray-300 p-4 w-32 text-center rounded my-2 shadow-md"
                      />
                      <span className="text-gray-400">{hoursWorked + 1}</span>
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
                      <span className="text-gray-400">{minutesWorked > 0 ? minutesWorked - 5 : ""}</span>
                      <input
                        type="number"
                        value={minutesWorked}
                        readOnly
                        className="border border-gray-300 p-4 w-32 text-center rounded my-2 shadow-md"
                      />
                      <span className="text-gray-400">{minutesWorked + 5}</span>
                    </div>
                  </div>
                  <span className="text-gray-500">Minutos</span>
                </div>
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border outline-none border-gray-300 p-4 mb-4 w-full rounded text-center bg-white placeholder:text-center"
              />
              <div className="flex w-full justify-between">
                <button type="button" onClick={closeModal} className="bg-red-700 text-white px-4 py-2 rounded hover:bg-white transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-acent text-white px-4 py-2 rounded hover:bg-white transition">
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
