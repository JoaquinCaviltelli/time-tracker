import React, { useEffect, useRef, useState } from "react";

const TimePicker = ({
  selectedHour,
  selectedMinute,
  setSelectedHour,
  setSelectedMinute,
}) => {
  // Almacenar los valores como números
  const hours = Array.from({ length: 24 }, (_, i) => i); // Números de 0 a 23
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // Números de 0 a 55 (en pasos de 5)

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const scrollTimeout = useRef(null);

  const [scrollActive, setScrollActive] = useState(false);

  const itemHeight = 40;
  const containerHeight = 40;

  const handleScroll = (e, type) => {
    if (!scrollActive) return;

    const scrollTop = e.target.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);

    if (type === "hour") {
      console.log(scrollTop);
      setSelectedHour(hours[selectedIndex]);
    } else {
      setSelectedMinute(minutes[selectedIndex]);
    }

    // Limpiar cualquier timeout previo
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Esperar hasta que se detenga el scroll para centrar el ítem
    scrollTimeout.current = setTimeout(() => {
      if (type === "hour") {
        centerScroll(hourRef, selectedIndex);
      } else {
        centerScroll(minuteRef, selectedIndex);
      }
    }, 100);
  };

  const centerScroll = (ref, selectedIndex) => {
    if (ref.current) {
      console.log(selectedIndex);
      ref.current.scrollTo({
        top:
          selectedIndex * itemHeight - (containerHeight / 2 - itemHeight / 2),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const initialHourIndex = hours.indexOf(selectedHour);
    const initialMinuteIndex = minutes.indexOf(selectedMinute);

    setScrollActive(false);
    centerScroll(hourRef, initialHourIndex);
    centerScroll(minuteRef, initialMinuteIndex);
    setTimeout(() => {
      setScrollActive(true); // Activar scroll después de centrar
    }, 500);
  }, [selectedHour, selectedMinute]);

  return (
    <div className="w-full py-4">
      <div className="flex w-full">
        <div className="picker flex flex-col  w-full">
          <div
            className="scroll-container h-[140px] overflow-y-scroll relative scrollbar-hidden"
            ref={hourRef}
            onScroll={(e) => handleScroll(e, "hour")}
          >
            <div className="h-10 "></div>
            {hours.map((hour, index) => (
              <div
                key={index}
                className={` text-4xl time-item p-2 text-right  text-one ${
                  selectedHour === hour
                    ? "text-accent font-bold"
                    : "opacity-30 text-xl"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  lineHeight: `${itemHeight}px`,
                }}
              >
                {String(hour).padStart(2, "0")}
              </div>
            ))}
            <div className="h-16"></div>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div
            className="scroll-container h-[140px] overflow-y-scroll relative scrollbar-hidden"
            ref={minuteRef}
            onScroll={(e) => handleScroll(e, "minute")}
          >
            <div className="h-10"></div>
            {minutes.map((minute, index) => (
              <div
                key={index}
                className={`time-item text-4xl p-2 text-left text-one ${
                  selectedMinute === minute
                    ? "text-accent font-bold"
                    : "opacity-30 text-xl"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  lineHeight: `${itemHeight}px`,
                }}
              >
                {String(minute).padStart(2, "0")}
              </div>
            ))}
            <div className="h-16"></div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TimePicker;
