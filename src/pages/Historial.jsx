import { useContext, useState } from "react";
import { HoursContext } from "../context/HoursContext";
import EditHoursModal from "../components/EditHoursModal";
import moment from "moment";
import 'moment/locale/es';
moment.locale('es');

const Historial = () => {
  const { hours } = useContext(HoursContext);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
  const [selectedHour, setSelectedHour] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const daysWithHours = hours.filter(hour => moment(hour.date).isSame(currentMonth, 'month'));

  const totalMinutesWorked = daysWithHours.reduce((acc, hour) => acc + hour.minutesWorked, 0);
  const totalHoursWorked = daysWithHours.reduce((acc, hour) => acc + hour.hoursWorked, 0);

  const totalMinutes = totalMinutesWorked / 60;
  const hoursFromMinutes = Math.floor(totalMinutes);
  const minutesRest = Math.round((totalMinutes - hoursFromMinutes) * 60);
  const totalHours = totalHoursWorked + hoursFromMinutes;

  const handleShare = () => {
    const mes = currentMonth.format("MMMM YYYY");
    const mensaje = `Informe del mes: ${mes}\nHoras: ${totalHours}:${minutesRest < 10 ? `0${minutesRest}` : minutesRest} hs\nCursos: 0`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const startDay = currentMonth.clone().startOf('month').startOf('isoWeek');
  const endDay = currentMonth.clone().endOf('month').endOf('week');
  const day = startDay.clone().subtract(1, 'day');
  const calendar = [];

  while (day.isBefore(endDay, 'day')) {
    calendar.push(Array(7).fill(0).map(() => day.add(1, 'day').clone()));
  }

  const handleDayClick = (day) => {
    const dayHours = daysWithHours.filter(hour => moment(hour.date).isSame(day, 'day'));
    if (dayHours.length > 0) {
      setSelectedHour(dayHours[0]);
      setShowEditModal(true);
    } else {
      alert("No hay horas registradas para este día.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      {/* <h1 className="text-3xl font-semibold text-acent mb-6">Historial de Horas</h1> */}

      

      

      <div className="flex justify-between items-center mb-4 text-xs">
        <button
          onClick={() => setCurrentMonth(prev => moment(prev).subtract(1, 'month'))}
        >
          <span className="material-icons font-extrabold text-3xl text-acent">keyboard_double_arrow_left</span>
        </button>
        <h2 className="text-lg font-bold text-acent">{currentMonth.format("MMMM YYYY")}</h2>
        <button
          onClick={() => setCurrentMonth(prev => moment(prev).add(1, 'month'))}
        >
          <span className="material-icons font-extrabold text-3xl text-acent">keyboard_double_arrow_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => (
          <div key={day} className="text-center font-semibold text-acent">{day}</div>
        ))}
      </div>

      {calendar.map((week, i) => (
        <div key={i} className="grid grid-cols-7 gap-1 mb-1 text-xs">
          {week.map((day, index) => {
            const dayHours = daysWithHours.filter(hour => moment(hour.date).isSame(day, 'day'));
            const totalHoursForDay = dayHours.reduce((acc, hour) => acc + hour.hoursWorked + hour.minutesWorked / 60, 0);
            const hoursForDay = Math.floor(totalHoursForDay);
            const minutesForDay = Math.round((totalHoursForDay - hoursForDay) * 60);

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-start pt-3 border rounded ${day.isSame(currentMonth, 'month') ? '' : 'text-gray-400'} ${dayHours.length > 0 ? 'bg-one' : ''} h-20 cursor-pointer`}
                onClick={() => handleDayClick(day)}
              >
                {dayHours.length > 0 ? (
                  <>
                    <span className="block text-center text-white font-semibold">{day.format('D')}</span>
                    <span className="text-sm text-center block mt-2 text-white font-semibold">
                      {hoursForDay}:{minutesForDay < 10 ? `0${minutesForDay}` : minutesForDay}
                    </span>
                  </>
                ) : (
                  <span className="block text-center">{day.format('D')}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {daysWithHours.length === 0 && (
        <p className="text-gray-500 mt-4">No hay horas registradas para este mes.</p>
      )}

      {showEditModal && selectedHour && (
        <EditHoursModal 
          closeModal={() => setShowEditModal(false)} 
          selectedEntry={selectedHour} 
        />
      )}
      <div className="w-full flex justify-between items-center mt-4">

      <p className="text-sm font-medium text-acent">
        Total de horas: {totalHours}:{minutesRest < 10 ? `0${minutesRest}` : minutesRest}h <br />
        Cursos: 1
      </p>
<button 
        onClick={handleShare} 
        className="px-4 py-2 bg-one text-white rounded"
        >
        Entregar informe
      </button>
        </div>
    </div>
  );
};

export default Historial;
