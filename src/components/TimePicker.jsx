import React, { useEffect, useRef } from "react";

const TimePicker = ({ selectedHour, selectedMinute, setSelectedHour, setSelectedMinute }) => {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const scrollTimeout = useRef(null);

  const itemHeight = 40;
  const containerHeight = 40;

  const handleScroll = (e, type) => {
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
    }, 100);
  };

  const centerScroll = (ref, selectedIndex) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: selectedIndex * itemHeight - (containerHeight / 2 - itemHeight / 2),
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const initialHourIndex = hours.indexOf(selectedHour);
    const initialMinuteIndex = minutes.indexOf(selectedMinute);

    centerScroll(hourRef, initialHourIndex);
    centerScroll(minuteRef, initialMinuteIndex);
  }, [selectedHour, selectedMinute]);

  return (
    <div className="w-full py-4">
      {/* <h2 className="text-xl font-bold mb-4 text-gray-600">Select Time</h2> */}

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
                  selectedHour === hour ? "text-accent font-bold" : "opacity-30 text-xl"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  lineHeight: `${itemHeight}px`,
                }}
              >
                {hour}
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
                {minute}
              </div>
            ))}
            <div className="h-16"></div>
          </div>
        </div>
      </div>

      {/* <div className="mt-6 text-2xl font-semibold text-gray-600">
        {selectedHour}:{selectedMinute}
      </div> */}

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
