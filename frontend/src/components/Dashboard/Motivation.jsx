import React, { useState } from "react";

const MotivationCard = () => {

    const [messages,Setmessages] = useState(true)

    function message(){
      setTimeout(() => {
        Setmessages(false)
      }, 1000);
    }

  return (
   <>{messages &&
    <div className="bg-linear-to-r from-blue-600 to-violet-600 text-white rounded-2xl p-8 shadow-lg mt-18">
      <h1 className="text-3xl font-bold">
        Stay Focused 🚀
      </h1>

      <p className="mt-4 text-lg text-blue-100">
        Every great journey begins with a single task. Complete today's work, and tomorrow will thank you.
      </p>
      <p className=" text-lg text-blue-100">
        A single decision today can transform your entire life.
      </p>

      <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
        onClick={message}
      >
        Start Today
      </button>
    </div>
    
    }
   </>
  );
};

export default MotivationCard;