import { Activity, CalendarDays, FileText, LayoutDashboard, LogOut, Search, UserRound, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const patientLinks = [
  { to: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/find-doctors", label: "Find doctors", icon: Search },
  { to: "/appointments", label: "My appointments", icon: CalendarDays },
  { to: "/prescriptions", label: "Prescriptions", icon: FileText },
  { to: "/medical-records", label: "Medical records", icon: FileText },
  { to: "/profile", label: "My profile", icon: UserRound },
];

const doctorLinks = [
  { to: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/profile", label: "My profile", icon: UserRound },
  { to: "/appointments?view=requests", label: "Appointment requests", icon: Users },
  { to: "/appointments", label: "My appointments", icon: CalendarDays },
  { to: "/prescriptions", label: "Prescriptions", icon: FileText },
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isDoctor = user?.role === "DOCTOR";

  function signOut() {
    logout();
    navigate("/");
  }

  return (
    <aside className="dashboard-sidebar">
      <NavLink className="brand sidebar-brand" to="/"><span className="brand-mark"><Activity size={20} /></span><span>medora<span className="brand-period">.</span></span></NavLink>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {(isDoctor ? doctorLinks : patientLinks).map(({ icon: Icon, ...link }) => (
          <NavLink key={link.label} to={link.to} end={link.end} state={link.state} onClick={onNavigate} className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}>
            <Icon size={18} />{link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-user">
        <div className="user-avatar">{(user?.name ?? user?.fullName ?? "M").slice(0, 1).toUpperCase()}</div>
        <div className="sidebar-user-info"><strong>{user?.name ?? user?.fullName ?? "Medora user"}</strong><span>{isDoctor ? "Doctor account" : "Patient account"}</span></div>
      </div>
      <button className="sidebar-link sidebar-logout" onClick={() => { signOut(); onNavigate?.(); }}><LogOut size={18} />Log out</button>
    </aside>
  );
}
