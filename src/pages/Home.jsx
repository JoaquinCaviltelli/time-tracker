import { useContext, useState, useEffect } from "react";
import { HoursContext } from "../context/HoursContext";
import EditGoalModal from "../components/EditGoalModal";
import ModalAddHours from "../components/ModalAddHours";
import AddCourseModal from "../components/AddCourseModal";
import Clock from "../components/Clock";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import moment from "moment";

const Home = () => {
  const { user, goal } = useContext(HoursContext); // Aquí removemos `hours` porque ahora se obtiene directamente
  const [hours, setHours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [goalReached, setGoalReached] = useState(false); // Estado para la meta alcanzada

  const currentMonth = moment().month();
  const currentYear = moment().year();

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

  const filteredHours = hours.filter((entry) => {
    const entryDate = moment(entry.date);
    return (
      entryDate.month() === currentMonth && entryDate.year() === currentYear
    );
  });

  useEffect(() => {
    const fetchContacts = async () => {
      const q = query(collection(db, "users", user.uid, "contacts"));
      onSnapshot(q, (snapshot) => {
        const contactsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setContacts(contactsData);
      });
    };

    if (user) {
      fetchContacts();
    }
  }, [user]);

  const totalMinutesWorked = filteredHours.reduce(
    (acc, curr) => acc + curr.minutesWorked,
    0
  );
  const totalHoursWorked = filteredHours.reduce(
    (acc, curr) => acc + curr.hoursWorked,
    0
  );
  const totalMinutes = totalMinutesWorked / 60;
  const hoursFromMinutes = Math.floor(totalMinutes);
  const minutesRest = Math.round((totalMinutes - hoursFromMinutes) * 60);
  const totalHours = totalHoursWorked + hoursFromMinutes;

  const totalMinutesGoal = goal * 60 - (totalHours * 60 + minutesRest);
  const minutesTotalGoal = totalMinutesGoal / 60;
  const hoursGoal = Math.floor(minutesTotalGoal);
  const minutesGoal = Math.round((minutesTotalGoal - hoursGoal) * 60);

  // Verificar si se alcanzó la meta
  useEffect(() => {
    if (totalHours * 60 + minutesRest >= goal * 60) {
      setGoalReached(true);
    } else {
      setGoalReached(false);
    }
  }, [totalHours, minutesRest, goal]);

  useEffect(() => {
    if (user) {
      const courseRef = collection(db, "users", user.uid, "courses");
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");

      const q = query(
        courseRef,
        where("date", ">=", startOfMonth),
        where("date", "<=", endOfMonth)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const uniqueCourses = new Set();
        const coursesData = snapshot.docs.map((doc) => doc.data());

        coursesData.forEach((course) => uniqueCourses.add(course.contactId));
        setCourses([...uniqueCourses]);
      });

      return () => unsubscribe();
    }
  }, [user, currentMonth, currentYear]);

  return (
    <div className="flex flex-col items-center pt-10 max-w-lg m-auto">
      <div className="relative w-11/12 flex justify-center mt-10">
        <Clock totalHours={totalHours} goal={goal} minutesRest={minutesRest} />
        <ModalAddHours />
      </div>

      <div className="grid gap-2 grid-cols-6 w-11/12 mx-auto text-center mt-10">
        <div
          className="bg-one rounded-lg shadow-lg flex flex-col items-center justify-center p-4 col-span-6 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <p className="text-sm font-light text-light">Tu meta es de:</p>
          <p className="text-3xl font-bold text-light">{goal}h</p>
          <p className="text-sm font-light text-light">este mes</p>
        </div>

        {goalReached ? (
          <div className="bg-acent rounded-lg shadow-lg flex flex-col items-center justify-center p-4 col-span-4">
            <p className="text-sm font-light text-light">Has alcanzado la</p>
            <p className="text-lg font-bold text-light">meta!</p>
            <p className="text-sm font-light text-light">
              adicional: {totalHours - goal}h {minutesRest}m
            </p>
          </div>
        ) : (
          <div className="bg-acent rounded-lg shadow-lg flex flex-col items-center justify-center p-4 col-span-4">
            <p className="text-sm font-light text-light">Te faltan</p>
            <p className="text-3xl font-bold text-light">
              {hoursGoal}:{minutesGoal < 10 ? `0${minutesGoal}` : minutesGoal}h
            </p>
          </div>
        )}

        <div
          className="bg-acent rounded-lg shadow-lg flex flex-col items-center justify-center p-4 col-span-2 cursor-pointer"
          onClick={() => setIsCourseModalOpen(true)}
        >
          <p className="text-sm font-light text-light">Cursos</p>
          <p className="text-3xl font-bold text-light">{courses.length}</p>
        </div>
      </div>

      {isModalOpen && <EditGoalModal onClose={() => setIsModalOpen(false)} />}
      {isCourseModalOpen && (
        <AddCourseModal
          onClose={() => setIsCourseModalOpen(false)}
          contacts={contacts}
        />
      )}
    </div>
  );
};

export default Home;
