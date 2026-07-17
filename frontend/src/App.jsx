import "./Splash.css";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SplashPage from "./pages/SplashPage";
import Loading from "./pages/IntroPage";
import BlackPage from "./pages/BlackPage";
import DeshBoard from "./pages/DeshBoard";
import OtpPage from "./pages/otpPage";
import TaskView from "./pages/ViewTask";

//dropdown pages
import Proflle from "./components/dropdown/Proflle";
import Settings from "./components/dropdown/Setting";
import Help from "./components/dropdown/Help";
import TaskCardView from "./components/Dashboard/TaskCardView"

function App() {
  return (
    <Routes>
      <Route path="/" element={<BlackPage />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/splash" element={<SplashPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DeshBoard />} />
      <Route path="/taskview" element={<TaskView />} />

      {/* Task views */}
      <Route path="/taskcardview" element={<TaskCardView />} />




      {/* Navbar pages */}
      <Route path="/nav_profile" element={<Proflle />} />
      <Route path="/nav_setting" element={< Settings/>} />
      <Route path="/nav_help" element={< Help/>} />




    </Routes>
  );
}

export default App;
