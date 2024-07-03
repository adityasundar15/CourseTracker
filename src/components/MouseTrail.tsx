import React, { useEffect, useState } from "react";

// Function to generate a random color
const getRandomColor = () => {
  //   const letters = "0123456789ABCDEF";
  const letters = "0000000000000000";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MouseTrail: React.FC = () => {
  const [positions, setPositions] = useState<
    Array<{ x: number; y: number; time: number; color: string }>
  >([]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const currentTime = Date.now();
      setPositions((prev) => {
        const newPositions = [
          ...prev,
          {
            x: event.clientX,
            y: event.clientY,
            time: currentTime,
            color: getRandomColor(),
          },
        ];
        return newPositions.filter((pos) => currentTime - pos.time < 2000);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const interval = setInterval(() => {
      const currentTime = Date.now();
      setPositions((prev) =>
        prev.filter((pos) => currentTime - pos.time < 200)
      );
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mouse-trail">
      {positions.map((pos, index) => (
        <div
          key={index}
          className="trail"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            opacity: 1 - (Date.now() - pos.time) / 200,
            backgroundColor: pos.color, // Set the background color
          }}
        />
      ))}
    </div>
  );
};

export default MouseTrail;
