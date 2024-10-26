import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { useNavigate } from "react-router-dom";
import EditHoursModal from "../components/EditHoursModal";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../services/firebase";
import moment from "moment";
import "moment/locale/es";
import { useSwipeable } from "react-swipeable"; // Importar la librería de deslizamiento

moment.locale("es");

const Historial = () => {
  const { user, goal, range } = useContext(HoursContext); // Incluye el objetivo de horas desde el contexto
  const [hours, setHours] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));
  const [selectedHour, setSelectedHour] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [courses, setCourses] = useState([]);

  const today = moment();
  const navigate = useNavigate();
  const buffer = 5; // Buffer de horas adicionales

  useEffect(() => {
    if (user) {
      const fetchHours = async () => {
        const hoursRef = collection(db, "users", user.uid, "hours");
        const q = query(hoursRef);
        onSnapshot(q, (snapshot) => {
          const hoursData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setHours(hoursData);
        });
      };
      fetchHours();
    }
  }, [user]);

  const daysWithHours = hours.filter((hour) =>
    moment(hour.date).isSame(currentMonth, "month")
  );

  // Lógica para sumar horas de campo y crédito siguiendo el buffer y la meta
  const totalFieldHours = daysWithHours.reduce(
    (acc, hour) =>
      hour.serviceType === "campo"
        ? acc + hour.hoursWorked + hour.minutesWorked / 60
        : acc,
    0
  );

  const totalCreditHours = daysWithHours.reduce(
    (acc, hour) =>
      hour.serviceType === "credito"
        ? acc + hour.hoursWorked + hour.minutesWorked / 60
        : acc,
    0
  );

  const totalWorkedThisMonth = totalFieldHours + totalCreditHours;

  // Aplicar lógica de meta + buffer
  const totalHoursToCount =
    totalWorkedThisMonth > goal + buffer
      ? totalFieldHours > goal + buffer
        ? totalFieldHours
        : goal + buffer
      : totalWorkedThisMonth;

  const hoursFromMinutes = Math.floor(totalHoursToCount);
  const minutesRest = Math.round((totalHoursToCount - hoursFromMinutes) * 60);

  useEffect(() => {
    if (user) {
      const coursesRef = collection(db, "users", user.uid, "courses");

      const unsubscribe = onSnapshot(coursesRef, (snapshot) => {
        const coursesData = snapshot.docs.map((doc) => doc.data());

        const coursesThisMonth = coursesData.filter((course) =>
          moment(course.date).isSame(currentMonth, "month")
        );

        const uniqueCoursesThisMonth = new Set(
          coursesThisMonth.map((course) => course.contactId)
        );
        setCourses([...uniqueCoursesThisMonth]);
      });

      return () => unsubscribe();
    }
  }, [user, currentMonth]);

  const handleShare = () => {
    const mes = currentMonth.format("MMMM YYYY");
    const mensaje = `Informe de ${mes}:\nHoras: ${hoursFromMinutes}:${
      minutesRest < 10 ? `0${minutesRest}` : minutesRest
    }h\nCursos: ${courses.length}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  const startDay = currentMonth.clone().startOf("month").startOf("isoWeek");
  const endDay = currentMonth.clone().endOf("month").endOf("week");
  const day = startDay.clone().subtract(1, "day");
  const calendar = [];

  while (day.isBefore(endDay, "day")) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => day.add(1, "day").clone())
    );
  }

  const handleDayClick = (day) => {
    const dayHours = daysWithHours.filter((hour) =>
      moment(hour.date).isSame(day, "day")
    );
    if (dayHours.length > 0) {
      setSelectedHour(dayHours);
      setShowEditModal(true);
    }
  };

  // Manejadores de deslizamiento
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentMonth((prev) => moment(prev).add(1, "month")),
    onSwipedRight: () =>
      setCurrentMonth((prev) => moment(prev).subtract(1, "month")),
    preventScrollOnSwipe: true,
    trackMouse: true, // Permite usar también el mouse
  });

  return (
    <div className="container mx-auto p-4 max-w-lg" {...handlers}>
      <div className="flex w-full gap-2 justify-between  mb-6 mt-4">
       
          <div
            className="bg-one rounded-lg shadow-lg flex gap-6 items-center justify-between p-4 cursor-pointer w-full "
            onClick={() => navigate("/YearlySummary")}
          >
            <p className="text-sm  text-white">Resumen anual</p>
            <span className="material-icons text-white">equalizer</span>
          </div>
        

        <div
          className="bg-one rounded-lg shadow-lg flex gap-6 items-center justify-between p-4 cursor-pointer w-full"
          onClick={handleShare}
        >
          <p className="text-sm  text-white">
            Total: {hoursFromMinutes}:
            {minutesRest < 10 ? `0${minutesRest}` : minutesRest}h <br />
            Cursos: {courses.length}
          </p>
          <span className="material-icons text-white">share</span>
        </div>
        
      </div>

      <div className="flex justify-between items-center mb-4 text-xs">
        <button
          onClick={() =>
            setCurrentMonth((prev) => moment(prev).subtract(1, "month"))
          }
        >
          <span className="material-icons font-extrabold text-xl text-acent">
            keyboard_double_arrow_left
          </span>
        </button>
        <h2 className="text-xl font-bold text-acent py-3">
          {currentMonth.format("MMMM")}
        </h2>
        <button
          onClick={() =>
            setCurrentMonth((prev) => moment(prev).add(1, "month"))
          }
        >
          <span className="material-icons font-extrabold text-xl text-acent">
            keyboard_double_arrow_right
          </span>
        </button>
      </div>

      {/* El resto del calendario y la lógica del componente */}
      {/* El resto del código de tu componente queda igual */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-acent">
            {day}
          </div>
        ))}
      </div>
      {calendar.map((week, i) => (
        <div key={i} className="grid grid-cols-7 gap-1 mb-1 text-xs">
          {week.map((day, index) => {
            const dayHours = daysWithHours.filter((hour) =>
              moment(hour.date).isSame(day, "day")
            );
            const totalHoursForDay = dayHours.reduce(
              (acc, hour) => acc + hour.hoursWorked + hour.minutesWorked / 60,
              0
            );
            const hoursForDay = Math.floor(totalHoursForDay);
            const minutesForDay = Math.round(
              (totalHoursForDay - hoursForDay) * 60
            );

            // Clase para marcar el día de hoy
            const isToday = day.isSame(today, "day");

            return (
              <div
                key={index}
                className={` pt-2 border rounded ${
                  day.isSame(currentMonth, "month") ? "" : "text-gray-300"
                }
                ${dayHours.length && !isToday > 0 ? "bg-one text-white" : ""} 
                ${isToday ? "bg-gray-500 text-white" : ""} 
                 h-16 cursor-pointer`} // Aplicar color de fondo y texto si es hoy
                onClick={() => handleDayClick(day)}
              >
                {dayHours.length > 0 ? (
                  <>
                    <span className="block text-center font-semibold">
                      {day.format("D")}
                    </span>
                    <span className="text-center block pt-2 font-semibold">
                      {hoursForDay}:
                      {minutesForDay < 10 ? `0${minutesForDay}` : minutesForDay}
                    </span>
                  </>
                ) : (
                  <span className="block text-center">{day.format("D")}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
      {daysWithHours.length === 0 && (
        <p className="text-gray-500 mt-4">
          No hay horas registradas para este mes.
        </p>
      )}
      {showEditModal && selectedHour && (
        <EditHoursModal
          closeModal={() => setShowEditModal(false)}
          selectedEntry={selectedHour}
          userId={user.uid}
        />
      )}
    </div>
  );
};

export default Historial;
