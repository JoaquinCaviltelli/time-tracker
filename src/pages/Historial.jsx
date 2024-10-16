import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import { useNavigate } from "react-router-dom";
import EditHoursModal from "../components/EditHoursModal";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../services/firebase";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

const Historial = () => {
  const { user } = useContext(HoursContext);
  const [hours, setHours] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));
  const [selectedHour, setSelectedHour] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [courses, setCourses] = useState([]);
  
  const today = moment(); // Definir el día de hoy
  const navigate = useNavigate();
  
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

  const totalMinutesWorked = daysWithHours.reduce(
    (acc, hour) => acc + hour.minutesWorked,
    0
  );
  const totalHoursWorked = daysWithHours.reduce(
    (acc, hour) => acc + hour.hoursWorked,
    0
  );

  const totalMinutes = totalMinutesWorked / 60;
  const hoursFromMinutes = Math.floor(totalMinutes);
  const minutesRest = Math.round((totalMinutes - hoursFromMinutes) * 60);
  const totalHours = totalHoursWorked + hoursFromMinutes;

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
    const mensaje = `Informe de ${mes}:\nHoras: ${totalHours}:${
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
      console.log("Selected hour entry:", dayHours[0]);
      setSelectedHour(dayHours[0]);
      setShowEditModal(true);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
       <button
        onClick={() => navigate("/YearlySummary")}
        className="text-white bg-one border rounded p-2 mt-4 w-full"
      >
        Ver Resumen Anual
      </button>
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
          userId={user.uid} // Pasa el userId a EditHoursModal
        />
      )}
      <div className="w-full flex justify-between mt-4">
        <p className="text-sm font-medium text-acent">
          Total de horas: {totalHours}:
          {minutesRest < 10 ? `0${minutesRest}` : minutesRest}h <br />
          Cursos: {courses.length}
        </p>
        <button
          onClick={handleShare}
          className="text-white border rounded p-2 flex items-center bg-one"
        >
          <span className="material-icons">share</span>
        </button>
      </div>
     
    </div>
  );
};

export default Historial;
