import { useContext, useState } from "react";
import { HoursContext } from "../context/HoursContext";
import HourCard from "../components/HourCard";
import moment from "moment";
moment.lang('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
  weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
}
);

const Historial = () => {
  const { hours } = useContext(HoursContext);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));

  // Agrupar horas por mes y año, y calcular sumas
  const groupedHours = hours.reduce((acc, hour) => {
    const monthYear = moment(hour.date).format("YYYY-MM");
    if (!acc[monthYear]) {
      acc[monthYear] = { hours: 0, minutes: 0, entries: [] };
    }
    acc[monthYear].hours += hour.hoursWorked;
    acc[monthYear].minutes += hour.minutesWorked;
    acc[monthYear].entries.push(hour);
    return acc;
  }, {});

  // Ordenar las claves del objeto
  const sortedMonths = Object.keys(groupedHours).sort((a, b) => new Date(b) - new Date(a));

  // Filtrar horas del mes actual
  const filteredMonths = sortedMonths.filter(month => moment(month).isSame(currentMonth, 'month'));

  const handleNextMonth = () => {
    setCurrentMonth(prev => moment(prev).add(1, 'month'));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => moment(prev).subtract(1, 'month'));
  };

  // Calcular el total de horas y minutos
  const totalHours = filteredMonths.reduce((total, month) => {
    const monthData = groupedHours[month];
    total.hours += monthData.hours;
    total.minutes += monthData.minutes;
    return total;
  }, { hours: 0, minutes: 0 });

  // Convertir minutos a horas si es necesario
  const additionalHours = Math.floor(totalHours.minutes / 60);
  const finalHours = totalHours.hours + additionalHours;
  const finalMinutes = totalHours.minutes % 60;

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Historial de Horas</h1>
      <div className="flex justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-200"
        >
          Mes Anterior
        </button>
        <h2 className="text-xl font-semibold text-gray-700">{currentMonth.format("MMMM YYYY")}</h2>
        <button
          onClick={handleNextMonth}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-200"
        >
          Mes Siguiente
        </button>
      </div>
      {filteredMonths.length === 0 ? (
        <p className="text-gray-500">No hay horas registradas para este mes.</p>
      ) : (
        filteredMonths.map((month) => (
          <div key={month} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">{moment(month).format("MMMM YYYY")}</h3>
            {groupedHours[month].entries.map((hour) => (
              <HourCard key={hour.id} hour={hour} />
            ))}
            <p className="font-bold text-gray-800 mt-2">
              Total: {finalHours} horas y {finalMinutes} minutos
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Historial;
