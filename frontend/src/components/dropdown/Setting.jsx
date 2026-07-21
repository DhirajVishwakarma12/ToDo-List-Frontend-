import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";

const Settings = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [darkModeState, setDarkModeState] = useState(true);
    const [privatePasswordSet, setPrivatePasswordSet] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/profile/viewprofile');
                setPrivatePasswordSet(Boolean(response.data.privatePasswordSet));
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile();
    }, []);

    const handlePasswordSave = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error("Please enter both new password fields.");
            return;
        }

        try {
            setIsSavingPassword(true);
            await api.post('/api/profile/private-password', {
                currentPassword: privatePasswordSet ? currentPassword : undefined,
                newPassword,
                confirmPassword,
            });
            toast.success("Private task password saved successfully.");
            setPrivatePasswordSet(true);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to save private password.");
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleLogoutAll = async() => {
        

            try {
                const response = await api.get('/api/auth/logout-all');

                localStorage.removeItem("accessToken");
                toast.success(response.data.message);

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            console.log(1)


            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        


    };

    return (
        <div className="min-h-screen relative bg-slate-100 dark:bg-slate-950 flex justify-center p-5">
            <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="absolute left-4 top-4 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition z-10"
            >
                ← Back 
            </button>
            <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                    ⚙️ Settings
                </h1>

                {/* Dark Mode */}
                <div className="flex items-center justify-between py-5 border-b border-slate-300 dark:border-slate-700">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Dark Mode
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Switch between light and dark theme.
                        </p>
                    </div>

                    <button
                        onClick={() => setDarkModeState(!darkModeState)}
                        className={`relative w-16 h-8 rounded-full transition ${darkModeState ? "bg-blue-600" : "bg-gray-400"
                            }`}
                    >
                        <div
                            className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${darkModeState ? "left-9" : "left-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between py-5 border-b border-slate-300 dark:border-slate-700">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Notifications
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Receive task reminders.
                        </p>
                    </div>

                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={`relative w-16 h-8 rounded-full transition ${notifications ? "bg-green-600" : "bg-gray-400"
                            }`}
                    >
                        <div
                            className={`absolute top-1 w-6 h-6 rounded-full bg-white transition ${notifications ? "left-9" : "left-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Private Task Password */}
                <div className="py-5 border-b border-slate-300 dark:border-slate-700">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Private Task Password
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Set a single password for all private tasks. Existing private tasks will use this password for access.
                        </p>
                    </div>

                    {privatePasswordSet ? (
                        <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-900 dark:bg-green-900/25 dark:text-green-200">
                            Private task password is set. Use the form below to change it.
                        </div>
                    ) : (
                        <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-900 dark:bg-yellow-900/25 dark:text-yellow-200">
                            No private task password is configured yet. Set one now to secure private tasks.
                        </div>
                    )}

                    {privatePasswordSet && (
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                                Current Private Password
                            </label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                            New Private Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handlePasswordSave}
                        disabled={isSavingPassword}
                        className="mb-5 rounded-lg bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSavingPassword ? "Saving..." : privatePasswordSet ? "Change Private Password" : "Set Private Password"}
                    </button>
                </div>

                {/* Logout All Devices */}
                <div className="flex items-center justify-between py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-red-500">
                            Logout from All Devices
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            This will end all active sessions on every device.
                        </p>
                    </div>

                    <button
                        onClick={handleLogoutAll}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
                    >
                        Logout All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
