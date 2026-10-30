import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, FileText, Stethoscope } from "lucide-react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { createAppointment } from "../services/appointmentService.js";
import { getDoctors } from "../services/doctorService.js";
import { useAuth } from "../context/AuthContext.jsx";

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const doctors = getDoctors();
  const [form, setForm] = useState({ doctorId: searchParams.get("doctor") ?? "", appointmentDate: "", appointmentTime: "", reason: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.doctorId || !form.appointmentDate || !form.appointmentTime || !form.reason.trim()) {
      return setError("Complete each field before requesting your appointment.");
    }
    if (form.appointmentDate < localDateString(new Date())) return setError("Choose today or a future date.");
    try {
      const doctor = doctors.find((item) => String(item.id ?? item.doctorId) === form.doctorId);
      if (!doctor) return setError("Choose a doctor from the list.");
      createAppointment({
        ...form,
        doctorId: doctor.id ?? doctor.doctorId,
        doctorEmail: doctor.email,
        doctorName: doctor.name ?? doctor.fullName,
        specialty: doctor.specialization ?? doctor.specialty,
        patientEmail: user.email,
        patientName: user.name,
        reason: form.reason.trim(),
      });
      setSuccess("Appointment request saved. Its status is Pending until your doctor responds.");
      setForm({ ...form, appointmentDate: "", appointmentTime: "", reason: "" });
    } catch (requestError) {
      setError(requestError.message || "We could not save your appointment request.");
    }
  }

  return (
    <main className="booking-page">
      <div className="booking-layout">
        <div className="booking-intro"><Link to="/find-doctors" className="back-link"><ArrowLeft size={16} /> Back to doctors</Link><p className="eyebrow"><CalendarDays size={15} /> Take the next step</p><h1>Book an<br /><span>appointment.</span></h1><p>Choose a doctor and a time that works for you. Your provider will confirm the request.</p><div className="booking-note"><span><CheckCircle2 size={18} /></span><div><strong>It starts with a request</strong><p>Your appointment is confirmed after your doctor approves it.</p></div></div></div>
        <form className="booking-form panel" onSubmit={submit} noValidate>
          <div className="form-heading"><span className="form-heading-icon"><Stethoscope size={20} /></span><div><h2>Appointment details</h2><p>Tell us what works best for you.</p></div></div>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          {success && <div className="alert alert-success" role="status">{success}</div>}
          <label className="field-label" htmlFor="doctorId">Choose a doctor</label><select className="select-input" id="doctorId" name="doctorId" value={form.doctorId} onChange={update}><option value="">Select a doctor</option>{doctors.map((doctor, index) => { const id = doctor.id ?? doctor.doctorId ?? ""; return <option key={id || index} value={id}>{doctor.name ?? doctor.fullName ?? "Doctor"} — {doctor.specialization ?? doctor.specialty ?? "Specialist"}</option>; })}</select>
          <div className="form-two-col"><div><label className="field-label" htmlFor="appointmentDate">Preferred date</label><div className="input-wrap"><CalendarDays size={18} /><input id="appointmentDate" name="appointmentDate" type="date" min={localDateString(new Date())} value={form.appointmentDate} onChange={update} /></div></div><div><label className="field-label" htmlFor="appointmentTime">Preferred time</label><div className="input-wrap"><Clock3 size={18} /><input id="appointmentTime" name="appointmentTime" type="time" value={form.appointmentTime} onChange={update} /></div></div></div>
          <label className="field-label" htmlFor="reason">Reason for consultation</label><div className="textarea-wrap"><FileText size={18} /><textarea id="reason" name="reason" rows="4" placeholder="Share a little about what you'd like to discuss..." value={form.reason} onChange={update} maxLength="500" /></div>
          <p className="form-hint">Please don't include highly sensitive personal information.</p>
          <button className="button button-primary button-full button-large">Request appointment <CalendarDays size={18} /></button>
        </form>
      </div>
    </main>
  );
}
