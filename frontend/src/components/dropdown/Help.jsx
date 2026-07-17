import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Help = () => {
    const navigate = useNavigate();
    const [feedback, Setfeedback] = useState("");

    return (
        <>
        <div className="min-h-screen relative bg-slate-100 dark:bg-slate-950 flex justify-center items-center px-4 py-10 pb-2">
            <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="absolute left-4 top-4 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition z-10"
            >
                ← Back 
            </button>
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">

                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                    🛠️ Service & Help
                </h1>

                {/* Service Number */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        📞 Service Number
                    </h2>

                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-lg text-slate-900 dark:text-white">
                        +91 98765 XXXXX
                    </div>
                </div>

                {/* Service Email */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        📧 Service Email
                    </h2>

                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-lg text-slate-900 dark:text-white break-all">
                        support@todolist.com
                    </div>
                </div>

                {/* Service Message */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        💬 Service Message
                    </h2>

                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-base text-slate-700 dark:text-slate-300 leading-7">
                        If you have any issues with your account, tasks, or application,
                        please contact our support team. We are available Monday to Saturday
                        from <strong>9:00 AM to 6:00 PM</strong> and will respond as soon as
                        possible.
                    </div>
                </div>

                {/* Feedback */}

                <div className="pt-6">
                    <hr className="border-amber-50 border-"/>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 pt-2">
                        Feedback
                    </h2>

                        <label
                            htmlFor="feedback"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            We'd love to hear your thoughts
                        </label>

                        <textarea
                            id="feedback"
                            value={feedback}
                            onChange={(e)=>{
                                Setfeedback(e.target.value)
                            }}
                            rows={6}
                            placeholder="Share your experience, suggestions, or report a problem..."
                            className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
                        />

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Your feedback helps us improve.
                            </p>

                            <button
                                className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white transition-all duration-300 hover:bg-indigo-700 hover:scale-105 active:scale-95"
                                onClick={() => {
                                    toast.success("Feedback send successfully",
                                        Setfeedback("")
                                    )
                                }}
                            >
                                Submit Feedback
                            </button>
                        </div>
                </div>

                
            </div>
        </div>
            <p className="text-white flex items-center justify-center opacity-50 py-4">
                @Many features are in development..
                </p>
        </>
    );
};

export default Help;
