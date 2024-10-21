import React, { useEffect, useRef, useState } from "react";

const TimePicker = ({
  selectedHour,
  selectedMinute,
  setSelectedHour,
  setSelectedMinute,
  serviceType,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i); // Números de 0 a 23
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // Números de 0 a 55 (en pasos de 5)

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const scrollTimeout = useRef(null);

  const [scrollActive, setScrollActive] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Nuevo estado

  const itemHeight = 40;
  const containerHeight = 40;

  const handleScroll = (e, type) => {
    if (!scrollActive) return;

    const scrollTop = e.target.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);

    
    if (type === "hour") {
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
    }, 100); // Reducido el retraso para que sea más responsivo
  };

  const centerScroll = (ref, selectedIndex) => {
    if (ref.current) {
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

    centerScroll(hourRef, initialHourIndex);
    centerScroll(minuteRef, initialMinuteIndex);
  }, [selectedHour, selectedMinute]);

  useEffect(() => {
    setScrollActive(false);
    setTimeout(() => {
      setScrollActive(true);
    }, 800);
   }, [serviceType]);

  useEffect(() => {
    if (selectedHour === 0 && selectedMinute === 0) {
      setScrollActive(true);
      setIsInitialLoad(false);
    } else {
      setTimeout(() => {
        setScrollActive(true);
        setIsInitialLoad(false);
      }, 800);
    }
  }, [isInitialLoad]);
  


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
                className={` text-4xl time-item py-2 px-1  text-right  text-one ${
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
                <span className="text-xl font-semibold">h</span>
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
                className={`time-item text-4xl py-2 px-1 text-left text-one ${
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
                <span className="text-xl font-semibold">m</span>
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
