import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const dashboardPath = user?.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard";

  function signOut() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="site-header" id="top">
      <div className="nav-inner">
        <Link className="brand" to="/" aria-label="Medora home">
          <span className="brand-mark"><Activity size={21} strokeWidth={2.6} /></span>
          <span>medora<span className="brand-period">.</span></span>
        </Link>
        <button className="icon-button mobile-menu-toggle" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav ${open ? "nav-open" : ""}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/find-doctors" onClick={() => setOpen(false)}>Find doctors</NavLink>
          <a href="/#about" onClick={() => setOpen(false)}>About</a>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="nav-dashboard" onClick={() => setOpen(false)}>My dashboard</Link>
              <button className="button button-primary button-small" onClick={signOut}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/register" className="button button-primary button-small" onClick={() => setOpen(false)}>Get started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
