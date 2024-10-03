import { useContext } from "react";
import { HoursContext } from "../context/HoursContext";
import ModalAddHours from "../components/ModalAddHours";
import Clock from "../components/Clock";
import moment from "moment"; // Para manejar fechas
import "moment/locale/es";

moment.locale("es");

const Home = () => {
  const { hours, goal, user } = useContext(HoursContext);

  const today = moment();
  const endOfMonth = moment().endOf("month");
  const daysRemaining = endOfMonth.diff(today, "days");

  console.log(user.displayName);

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
  const totalMinutesWorked = filteredHours.reduce(
    (acc, curr) => acc + curr.minutesWorked,
    0
  );
  const totalHoursWorked = filteredHours.reduce(
    (acc, curr) => acc + curr.hoursWorked,
    0
  );

  // Convierte minutos trabajados en horas y minutos
  const totalMinutes = totalMinutesWorked / 60;
  const hoursFromMinutes = Math.floor(totalMinutes);
  const minutesRest = Math.round((totalMinutes - hoursFromMinutes) * 60);

  // Total de horas trabajadas
  const totalHours = totalHoursWorked + hoursFromMinutes;

  // Calcula el tiempo restante para alcanzar la meta
  const totalMinutesGoal = goal * 60 - (totalHours * 60 + minutesRest);
  const minutesTotalGoal = totalMinutesGoal / 60;
  const hoursGoal = Math.floor(minutesTotalGoal);
  const minutesGoal = Math.round((minutesTotalGoal - hoursGoal) * 60);

  console.log(user)

  return (
    <div className="flex flex-col justify-between items-center py-20">
      <h1 className="text-2xl font-bold mb-1">Hola {user.displayName}!!!</h1>
      <div className="relative w-11/12 flex justify-center mt-10">

      <Clock
        className=""
        totalHours={totalHours}
        goal={goal}
        minutesRest={minutesRest}
        />
      <ModalAddHours />
        </div>
      
      <div className="grid gap-2 grid-cols-6 w-11/12 mx-auto text-center mt-10">
  <div className="bg-red-500 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 col-span-6">
    <p className="text-sm font-light text-white">Tu meta es de:</p>
    <p className="text-3xl font-bold text-white">{goal} hs</p>
    <p className="text-sm font-light text-white">este mes</p>
  </div>
  
  <div className="bg-red-400 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 col-span-4">
    <p className="text-sm font-light text-white">Te faltan</p>
    <p className="text-3xl font-bold text-white">
      {hoursGoal}:{minutesGoal < 10 ? `0${minutesGoal}` : minutesGoal} hs
    </p>
  </div>

  <div className="bg-red-400 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 col-span-2">
    <p className="text-sm font-light text-white">Cursos</p>
    <p className="text-3xl font-bold text-white">1</p>
  </div>
</div>

      
    </div>
  );
};

export default Home;
