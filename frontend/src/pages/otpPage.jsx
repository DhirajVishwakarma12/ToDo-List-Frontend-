import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Config from "../config/config";


const OtpPage = () => {


    useEffect(() => {
        axios
            .get(`${Config.API_URL}/`)
            .catch((err) => console.error(err));
    }, []);

    let count = 0;
    const [otp, setOtp] = useState("");
    const [otpError, SetotpError] = useState(false)


    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!otp.trim()) {
            SetotpError("otp is required");

            //disapper after 1sec
            setTimeout(() => {
                SetotpError("");
            }, 1000)
            return
        }

        if (otp.length != 6 || otp.length < 6) {
            SetotpError("otp must be 6 digit")

            //disapper after 1sec
            setTimeout(() => {
                SetotpError("");
            }, 1000)
            return
        }

        console.log("OTP:", otp);

        try {
            const response = await axios.post(
                `${Config.API_URL}/api/auth/otp`,
                {
                    otp
                }
            );

            localStorage.removeItem("email");

            toast.success(response.data.message);
            setOtp("")

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            // Verify OTP API
        }
    };


    async function resend() {

        if (count > 2) {
            toast.error("you reached limit , wait for 24 hours");
            return
        }
        count = count + 1;

        console.log(count)


        try {
            const email = localStorage.getItem("email");
            console.log(email)
            const response = await axios.post(
                `${Config.API_URL}/api/auth/resendotp`,
                {
                    email,
                }
            );
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-700">
                <h2 className="text-3xl font-bold text-white text-center">
                    OTP Verification
                </h2>

                <p className="text-slate-400 text-center mt-2 mb-6">
                    Enter the 6-digit OTP sent to your email
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-center text-2xl tracking-[10px] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {otpError && <p className='font-semibold text-red-600 dark:text-red-400'>{otpError}</p>}


                    <button
                        type="submit"
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Verify OTP
                    </button>
                </form>

                <p className="text-center text-slate-400 mt-5">
                    Didn't receive the OTP?{" "}
                    <button
                        type="button"
                        className="text-blue-400 hover:text-blue-500 font-medium active:scale-94"
                        onClick={resend}
                    >
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
};

export default OtpPage;