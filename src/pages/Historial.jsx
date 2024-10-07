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

  // Cambiar para que la semana comience el lunes
  const startDay = currentMonth.clone().startOf('month').startOf('isoWeek'); // isoWeek para comenzar el lunes
  const endDay = currentMonth.clone().endOf('month').endOf('week');
  const day = startDay.clone().subtract(1, 'day');
  const calendar = [];

  while (day.isBefore(endDay, 'day')) {
    calendar.push(
      Array(7).fill(0).map(() => day.add(1, 'day').clone())
    );
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
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Historial de Horas</h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(prev => moment(prev).subtract(1, 'month'))}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-200"
        >
          Mes Anterior
        </button>
        <h2 className="text-xl font-semibold text-gray-700">{currentMonth.format("MMMM YYYY")}</h2>
        <button
          onClick={() => setCurrentMonth(prev => moment(prev).add(1, 'month'))}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-200"
        >
          Mes Siguiente
        </button>
      </div>

      {/* Encabezados de días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => (
          <div key={day} className="text-center font-semibold text-gray-700">{day}</div>
        ))}
      </div>

      {/* Renderizando el calendario */}
      {calendar.map((week, i) => (
        <div key={i} className="grid grid-cols-7 gap-1 mb-4 text-xs">
          {week.map((day, index) => {
            const dayHours = daysWithHours.filter(hour => moment(hour.date).isSame(day, 'day'));
            const totalHours = dayHours.reduce((acc, hour) => acc + hour.hoursWorked + hour.minutesWorked / 60, 0);

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center border rounded-lg p-4 ${day.isSame(currentMonth, 'month') ? '' : 'text-gray-400'} ${dayHours.length > 0 ? 'bg-blue-200' : ''} h-10 cursor-pointer`}
                onClick={() => handleDayClick(day)}
              >
                <span className="block text-center">{day.format('D')}</span>
                {dayHours.length > 0 && (
                  <span className="text-sm text-center block mt-1 text-blue-900 font-semibold">
                    {totalHours.toFixed(1)} hrs
                  </span>
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
    </div>
  );
};

export default Historial;
