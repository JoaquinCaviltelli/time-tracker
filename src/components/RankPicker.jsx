import React, { useEffect, useRef, useState } from "react";

const RankPicker = ({ selectedRank, setSelectedRank }) => {
  const ranks = ["publicador", "auxiliar", "regular", "especial"]; // Opciones de rango
  const rankRef = useRef(null);
  const scrollTimeout = useRef(null);
  const [scrollActive, setScrollActive] = useState(false);

  const itemHeight = 40;
  const containerHeight = 40;

  const handleScroll = (e) => {
    if (!scrollActive) return;

    const scrollTop = e.target.scrollTop;
    const selectedIndex = Math.round(scrollTop / itemHeight);

    setSelectedRank(ranks[selectedIndex]);

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      centerScroll(rankRef, selectedIndex);
    }, 100);
  };

  const centerScroll = (ref, selectedIndex) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: selectedIndex * itemHeight - (containerHeight / 2 - itemHeight / 2),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const initialValueIndex = ranks.indexOf(selectedRank);
    centerScroll(rankRef, initialValueIndex);
  }, [selectedRank]);

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
            ref={rankRef}
            onScroll={handleScroll}
          >
            <div className="h-10"></div>
            {ranks.map((rank, index) => (
              <div
                key={index}
                className={`text-4xl rank-item py-2 px-1 text-center text-white ${
                  selectedRank === rank ? "text-accent font-bold" : "opacity-30 text-xl"
                }`}
                style={{
                  height: `${itemHeight}px`,
                  lineHeight: `${itemHeight}px`,
                }}
              >
                {rank}
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

export default RankPicker;
