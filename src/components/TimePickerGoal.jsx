import React, { useEffect, useRef, useState } from "react";

const TimePickerGoal = ({ selectedValue, setSelectedValue }) => {
  const values = Array.from({ length: 24 }, (_, i) => (i + 1) * 5); // Números de 5 en 5 desde 5 hasta 120

  const valueRef = useRef(null);
  const scrollTimeout = useRef(null);
  const [scrollActive, setScrollActive] = useState(false);

  const itemHeight = 40;
  const containerHeight = 40;

  const handleScroll = (e) => {
    if (!scrollActive) return;

    const scrollTop = e.target.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);

    setSelectedValue(values[selectedIndex]);

    // Limpiar cualquier timeout previo
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Esperar hasta que se detenga el scroll para centrar el ítem
    scrollTimeout.current = setTimeout(() => {
      centerScroll(valueRef, selectedIndex);
    }, 100);
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
    const initialValueIndex = values.indexOf(selectedValue);
    centerScroll(valueRef, initialValueIndex);
  }, [selectedValue]);

   useEffect(() => {
     setScrollActive(false);
     setTimeout(() => {
       setScrollActive(true);
     }, 600);
   }, []);

  return (
    <div className="w-full py-4">
      <div className="flex w-full">
        <div className="picker flex flex-col w-full">
          <div
            className="scroll-container h-[140px] overflow-y-scroll relative scrollbar-hidden"
            ref={valueRef}
            onScroll={handleScroll}
          >
            <div className="h-10"></div>
            {values.map((value, index) => (
              <div
                key={index}
                className={`text-4xl time-item py-2 px-1 text-center text-white ${
                  selectedValue === value
                    ? "text-accent font-bold"
                    : "opacity-30 text-xl"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  lineHeight: `${itemHeight}px`,
                }}
              >
                {String(value)}h
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


export default TimePickerGoal;
