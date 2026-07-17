import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const navigate = useNavigate();
  const text = "TO DO LIST";
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index + 1));
      index++;

      if (index === text.length) {
        clearInterval(interval);

        // Wait 1 second after the animation completes
        setTimeout(() => {
          navigate("/splash"); // Change to your route
        }, 2000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <h1 className="text-6xl font-bold text-white tracking-widest">
        {displayText}
      </h1>
    </div>
  );
};

export default Loading;