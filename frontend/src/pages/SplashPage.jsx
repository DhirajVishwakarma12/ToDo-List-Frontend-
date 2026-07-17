import React from "react";
import logoo from "../assets/logoo.png";
import { useNavigate  } from "react-router-dom";

const SplashScreen = () => {

    const navigate = useNavigate();

    setTimeout(() => {
        navigate("/login")
    }, 4000)

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black overflow-hidden">
            <img
                src={logoo}
                alt="Logo"
                className="w-70 md:w-80 lg:w-90 opacity-0 animate-pulse"
                style={{
                    animation: "fadeInOut 3s ease-in-out forwards",
                }}
            />
        </div>
    );
};

export default SplashScreen;