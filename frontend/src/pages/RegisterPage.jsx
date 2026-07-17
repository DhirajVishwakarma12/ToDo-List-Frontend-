import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import Config from '../config/config';

const RegisterPage = () => {


    const navigate = useNavigate();


    //value
    const [username, Setusername] = useState("");
    const [email, Setemail] = useState("");
    const [password, Setpassword] = useState("");

    //error
    const [usernameError, SetusernameError] = useState(false)
    const [emailError, SetemailError] = useState(false)
    const [passwordError, SetpasswordError] = useState(false)


    const submitform = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            SetusernameError("Username is required");

            //disapper after 1sec
            setTimeout(() => {
                SetusernameError("");
            }, 1000)
            return
        }
        if (!email.trim()) {
            SetemailError("email is required");

            //disapper after 1sec
            setTimeout(() => {
                SetemailError("");
            }, 1000)
            return
        }

        if (!password.trim()) {
            SetpasswordError("password is required");

            //disapper after 1sec
            setTimeout(() => {
                SetpasswordError("");
            }, 1000)
            return
        }

        try {
            const response = await axios.post(
                `${Config.API_URL}/api/auth/register`,
                {
                    username,
                    email,
                    password,
                }
            );

            localStorage.setItem("email", email);

            toast.success(response.data.message);

            Setusername("");
            Setemail("");
            Setpassword("");

            setTimeout(() => {
                navigate("/otp");
            }, 1500);

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }

    };

    
    return (


        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 transition-colors duration-300 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-200 dark:border-slate-700 p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Make something Better

                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Register to continue to your account
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-5" onSubmit={submitform}>

                    {/* Username */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition "
                            value={username}
                            onChange={(e) => {
                                Setusername(e.target.value)
                            }}
                        />
                        {usernameError && <p className='font-semibold text-red-600 dark:text-red-400'>{usernameError}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            suggested="email"
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={email}
                            onChange={(e) => {
                                Setemail(e.target.value)
                            }}
                        />
                        {emailError && <p className='font-semibold text-red-600 dark:text-red-400'>{emailError}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={password}
                            onChange={(e) => {
                                Setpassword(e.target.value)
                            }}
                        />
                        {passwordError && <p className='font-semibold text-red-600 dark:text-red-400'>{passwordError}</p>}
                    </div>
                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-99"
                    >
                        Register
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400">

                        Already have an Account?
                        <Link
                            to="/login"
                            className="font-semibold text-red-600 dark:text-red-400 hover:underline"
                        >
                            Log in

                        </Link>

                    </p>
                </div>
            </div>
        </div>

    )
}

export default RegisterPage