import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import api from '../config/api';

const LoginPage = () => {
     useEffect(() => {
        api
            .get('/')
            .catch((err) => console.error(err));
    }, []);



    const navigate = useNavigate();

    const [username, Setusername] = useState("");
    const [password, Setpassword] = useState("");

    const [usernameError, SetusernameError] = useState(false)
    const [passwordError, SetpasswordError] = useState(false)


    //form submit logic
    const submitform = async (e) => {
        e.preventDefault();


        //verification codea
        if (!username.trim()) {
            SetusernameError("Username is required");

            //disapper after 1sec
            setTimeout(() => {
                SetusernameError("");
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
            const response = await api.post(
                '/api/auth/login',
                {
                    username,
                    password,
                }
            );

            if (response.data.accessToken) {
                localStorage.setItem("accessToken", response.data.accessToken);
            }

            toast.success(response.data.message);

            Setusername("");
            Setpassword("");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 transition-colors duration-300 px-4">
            <div className=" w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-200 dark:border-slate-700 p-8">

                {/* Header */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">

                        Welcome Back
                    </h1>

                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Login securely using your email and OTP.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={submitform}>

                    {/* Username */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={username}
                            onChange={(e) => {
                                Setusername(e.target.value)
                            }}
                        />
                        {usernameError && <p className='font-semibold text-red-600 dark:text-red-400'>{usernameError}</p>}
                    </div>

                    {/* password */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Password
                        </label>

                        <div className="flex gap-3">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="flex-1 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                value={password}
                                onChange={(e) => {
                                    Setpassword(e.target.value)
                                }}
                            />

                        </div>
                        {passwordError && <p className='font-semibold text-red-600 dark:text-red-400'>{passwordError}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 active:scale-95"
                    >
                        Login
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="h-px flex-1 bg-gray-300 dark:bg-slate-600"></div>
                    <span className="px-4 text-sm text-gray-500 dark:text-gray-400">
                        OR
                    </span>
                    <div className="h-px flex-1 bg-gray-300 dark:bg-slate-600"></div>
                </div>

                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        New User{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-red-600 hover:underline dark:text-red-400"
                        >
                            Register in
                        </Link>
                    </p>
                </div>

            </div>
        </div>

    )
}

export default LoginPage
