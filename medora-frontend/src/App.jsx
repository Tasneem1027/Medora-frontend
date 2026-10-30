import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Appointments from "./pages/Appointments.jsx";
import BookAppointment from "./pages/BookAppointment.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import FindDoctors from "./pages/FindDoctors.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
import Prescriptions from "./pages/Prescriptions.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";

function PublicLayout({ children }) {
  return <><Navbar />{children}<Footer /></>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/find-doctors" element={<PublicLayout><FindDoctors /></PublicLayout>} />
      <Route path="/doctors/:id" element={<PublicLayout><DoctorProfile /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/patient/login" element={<PublicLayout><Login expectedRole="PATIENT" /></PublicLayout>} />
      <Route path="/doctor/login" element={<PublicLayout><Login expectedRole="DOCTOR" /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route element={<ProtectedRoute roles={["PATIENT"]} />}>
        <Route path="/book-appointment" element={<PublicLayout><BookAppointment /></PublicLayout>} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/medical-records" element={<Profile />} />
      </Route>
      <Route element={<ProtectedRoute roles={["PATIENT"]} />}>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={["DOCTOR"]} />}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
