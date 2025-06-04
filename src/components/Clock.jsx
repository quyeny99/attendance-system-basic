import { useState, useEffect } from "react";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="clock-container rounded-2xl p-8 text-center text-white mb-8 shadow-lg">
      <div className="text-4xl md:text-6xl font-bold mb-2 font-mono">
        {formatTime(currentTime)}
      </div>
      <div className="text-lg md:text-xl opacity-90">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};

export default Clock;
