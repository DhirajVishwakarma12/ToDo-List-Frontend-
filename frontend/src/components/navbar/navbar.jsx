import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import profile from "../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
  });




  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile/viewprofile');

        if (response.data.user && response.data.user.length > 0) {
          const userData = response.data.user[0];

          setUser({
            username: userData.username,
            email: userData.email,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  // Logout
  const log_out = async () => {
    try {
      const response = await api.get('/api/auth/logout');

      localStorage.removeItem("accessToken");
      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <nav className="w-full bg-white dark:bg-slate-900 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-full mx-3 flex items-center justify-between py-2 pb-1">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />

          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Todo App
          </h1>
        </div>

        {/* Search + Navigation */}
        <div className="hidden md:flex flex-col items-center w-1/3">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          />

          {/* Navigation Links */}
          <div className="flex justify-center items-center gap-12 mt-3">
            <NavLink
              to="/dashboard"
              onMouseEnter={() => { 
                setTimeout(() => {
                  navigate("/dashboard")
            }, 500)
              }}
            >
              {({ isActive }) => (
                <div className="relative group cursor-pointer">
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 group-hover:text-blue-600"
                      }`}
                  >
                    Create Task
                  </span>

                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </div>
              )}
            </NavLink>

            <NavLink
              to="/taskview"
              onMouseEnter={() => { 
                setTimeout(() => {
                  navigate("/taskview")
            }, 500)
               }}
            >
              {({ isActive }) => (
                <div className="relative group cursor-pointer">
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 group-hover:text-blue-600"
                      }`}
                  >
                    View Task
                  </span>

                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-blue-600 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </div>
              )}
            </NavLink>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* Notification */}
          <button className="text-2xl">🔔</button>

          {/* Profile */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <img
              src={profile}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500 cursor-pointer object-cover"
            />

            {open && (
              <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col items-center py-5 bg-gray-50 dark:bg-slate-900">
                  <img
                    src={profile}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover"
                  />

                  <h2 className="mt-3 text-lg font-semibold dark:text-white">
                    {user.username || "Guest"}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email || "No Email"}
                  </p>
                </div>

                <hr className="dark:border-slate-700" />

                {/* Menu */}

                <button
                  className="w-full text-left px-5 py-3 hover:bg-blue-100 dark:hover:bg-slate-700 dark:text-white transition"
                  onClick={() => navigate("/nav_profile")}
                >
                  👤 Profile
                </button>

                <button
                  className="w-full text-left px-5 py-3 hover:bg-blue-100 dark:hover:bg-slate-700 dark:text-white transition"
                  onClick={() => navigate("/nav_setting")}
                >
                  ⚙️ Settings
                </button>

                <button
                  className="w-full text-left px-5 py-3 hover:bg-blue-100 dark:hover:bg-slate-700 dark:text-white transition"
                  onClick={() => navigate("/nav_help")}
                >
                  🛠 Services & Help
                </button>

                <hr className="dark:border-slate-700" />

                <button
                  className="w-full text-left px-5 py-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                  onClick={log_out}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
