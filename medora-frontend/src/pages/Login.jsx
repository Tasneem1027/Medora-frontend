import { ArrowLeft, ArrowRight, Eye, EyeOff, HeartPulse, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { login } from "../services/authService.js";

export default function Login({ expectedRole }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
    if (!form.password) return setError("Enter your password.");
    try {
      const user = login(form, expectedRole);
      signIn(user);
      const destination = user.role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard";
      navigate(location.state?.from?.pathname ?? destination, { replace: true });
    } catch (loginError) {
      setError(loginError.message || "We could not log you in. Please try again.");
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-aside">
        <div className="auth-aside-content"><Link to="/" className="auth-back"><ArrowLeft size={17} /> Back to home</Link><div className="auth-mark"><HeartPulse size={24} /></div><p className="eyebrow">Welcome back</p><h1>Your care,<br />all in one place.</h1><p>Pick up right where you left off. Your health journey is waiting.</p><div className="auth-aside-card"><span><LockKeyhole size={17} /></span><div><strong>Your information matters</strong><small>Your account is protected and personal to you.</small></div></div></div>
        <div className="auth-aside-foot">A little more care, every day.</div>
      </div>
      <div className="auth-main"><form className="auth-form" onSubmit={submit} noValidate>
        <p className="eyebrow">{expectedRole === "DOCTOR" ? "Doctor account" : expectedRole === "PATIENT" ? "Patient account" : "Your Medora account"}</p><h2>Welcome back</h2><p className="auth-subtitle">Log in to continue to your dashboard.</p>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <label className="field-label" htmlFor="email">Email address</label><div className="input-wrap"><Mail size={18} /><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update} /></div>
        <label className="field-label" htmlFor="password">Password</label><div className="input-wrap"><LockKeyhole size={18} /><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={form.password} onChange={update} /><button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <button className="button button-primary button-full button-large auth-submit">{<>Log in <ArrowRight size={18} /></>}</button>
        <p className="auth-switch">New to Medora? <Link to="/register">Create an account</Link></p>
        {expectedRole === "PATIENT" && <p className="auth-switch">Are you a doctor? <Link to="/doctor/login">Doctor login</Link></p>}
        {expectedRole === "DOCTOR" && <p className="auth-switch">Are you a patient? <Link to="/patient/login">Patient login</Link></p>}
        <div className="demo-credentials"><strong>Reviewer demo accounts</strong><span>Patient: patient@medora.test / Patient123!</span><span>Doctor: doctor@medora.test / Doctor123!</span></div>
        <p className="auth-legal">By continuing, you agree to use this project demo responsibly. Do not enter real health information.</p>
      </form></div>
    </main>
  );
}
