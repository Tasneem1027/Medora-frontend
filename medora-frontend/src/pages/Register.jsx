import { ArrowLeft, ArrowRight, Eye, EyeOff, HeartPulse, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService.js";

const initialForm = { name: "", email: "", password: "", confirmPassword: "", phone: "", role: "PATIENT" };

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim()) return setError("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError("Enter a valid email address.");
    if (form.password.length < 8) return setError("Choose a password with at least 8 characters.");
    if (form.password !== form.confirmPassword) return setError("Your passwords do not match.");
    if (!form.phone.trim()) return setError("Enter your phone number.");
    try {
      register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        role: form.role,
        ...(form.role === "DOCTOR" ? { specialization: "General Medicine" } : {}),
      });
      setSuccess("Registration successful. You can now log in.");
      window.setTimeout(
        () => navigate(form.role === "DOCTOR" ? "/doctor/login" : "/patient/login", { replace: true }),
        900,
      );
    } catch (registrationError) {
      setError(registrationError.message || "We could not create your account. Please try again.");
    }
  }

  return (
    <main className="auth-page register-page">
      <div className="auth-aside">
        <div className="auth-aside-content"><Link to="/" className="auth-back"><ArrowLeft size={17} /> Back to home</Link><div className="auth-mark"><HeartPulse size={24} /></div><p className="eyebrow">Care starts here</p><h1>Make space<br />for your health.</h1><p>One account brings your appointments, prescriptions, and care team closer together.</p><div className="auth-aside-card"><span><HeartPulse size={17} /></span><div><strong>A healthier connection</strong><small>Get started with the care that fits your life.</small></div></div></div>
        <div className="auth-aside-foot">A little more care, every day.</div>
      </div>
      <div className="auth-main"><form className="auth-form register-form" onSubmit={submit} noValidate>
        <p className="eyebrow">Join the Medora community</p><h2>Create your account</h2><p className="auth-subtitle">A few details are all it takes to get started.</p>
        {error && <div className="alert alert-error" role="alert">{error}</div>}{success && <div className="alert alert-success" role="status">{success}</div>}
        <label className="field-label" htmlFor="name">Full name</label><div className="input-wrap"><UserRound size={18} /><input id="name" name="name" autoComplete="name" placeholder="Your full name" value={form.name} onChange={update} /></div>
        <label className="field-label" htmlFor="register-email">Email address</label><div className="input-wrap"><Mail size={18} /><input id="register-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update} /></div>
        <div className="form-two-col"><div><label className="field-label" htmlFor="phone">Phone number</label><div className="input-wrap"><Phone size={18} /><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={update} /></div></div><div><label className="field-label" htmlFor="role">I am a</label><select className="select-input" id="role" name="role" value={form.role} onChange={update}><option value="PATIENT">Patient</option><option value="DOCTOR">Doctor</option></select></div></div>
        <label className="field-label" htmlFor="register-password">Password</label><div className="input-wrap"><LockKeyhole size={18} /><input id="register-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={update} /><button type="button" className="input-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <label className="field-label" htmlFor="confirm-password">Confirm password</label><div className="input-wrap"><LockKeyhole size={18} /><input id="confirm-password" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" value={form.confirmPassword} onChange={update} /></div>
        <button className="button button-primary button-full button-large auth-submit">{<>Create account <ArrowRight size={18} /></>}</button>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
        <p className="auth-legal">This is a student project demo. Please do not submit real personal or health information.</p>
      </form></div>
    </main>
  );
}
