import { useContext } from "react";
import { HoursContext } from "../context/HoursContext";
import ModalAddHours from "../components/ModalAddHours";
import Clock from "../components/Clock";
import moment from "moment"; // Para manejar fechas
import 'moment/locale/es';

moment.locale('es');

const Home = () => {
  const { hours, goal } = useContext(HoursContext);

  const today = moment();
  const endOfMonth = moment().endOf('month');
  const daysRemaining = endOfMonth.diff(today, 'days');

  console.log(today)

  // Obtén la fecha actual
  const currentMonth = moment().month();
  const currentYear = moment().year();

  // Filtra las horas del mes actual
  const filteredHours = hours.filter((entry) => {
    const entryDate = moment(entry.date);
    return (
      entryDate.month() === currentMonth && entryDate.year() === currentYear
    );
  });

  // Calcula los minutos y horas trabajadas del mes actual
  const totalMinutesWorked = filteredHours.reduce((acc, curr) => acc + curr.minutesWorked, 0);
  const totalHoursWorked = filteredHours.reduce((acc, curr) => acc + curr.hoursWorked, 0);

  // Convierte minutos trabajados en horas y minutos
  const totalMinutes = totalMinutesWorked / 60;
  const hoursFromMinutes = Math.floor(totalMinutes);
  const minutesRest = Math.round((totalMinutes - hoursFromMinutes) * 60);
  
  // Total de horas trabajadas
  const totalHours = totalHoursWorked + hoursFromMinutes;

  // Calcula el tiempo restante para alcanzar la meta
  const totalMinutesGoal = (goal * 60) - (totalHours * 60 + minutesRest);
  const minutesTotalGoal = totalMinutesGoal / 60;
  const hoursGoal = Math.floor(minutesTotalGoal);
  const minutesGoal = Math.round((minutesTotalGoal - hoursGoal) * 60);

  return (
    <div className="container m-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Horas Trabajadas</h1>
      <p>Total horas: {totalHours}:{minutesRest < 10 ? `0${minutesRest}` : minutesRest}</p>
      <p>Horas restantes para la meta: {hoursGoal}:{minutesGoal < 10 ? `0${minutesGoal}` : minutesGoal}</p>
      <p className="text-lg">
        Quedan {daysRemaining} {daysRemaining === 1 ? "día" : "días"} para terminar el mes.
      </p>
      <Clock totalHours={totalHours} goal={goal} minutesRest={minutesRest} />
      <ModalAddHours/>
    </div>
  );
};

export default Home;
