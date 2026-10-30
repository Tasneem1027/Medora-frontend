import { ArrowRight, CalendarCheck, CalendarClock, CalendarDays, Check, Clock3, Users, X } from "lucide-react";
import { Link } from "react-router-dom";
import AppointmentCard from "../components/AppointmentCard.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useResource from "../hooks/useResource.js";
import { sampleAppointments } from "../data/sampleData.js";
import { getAppointments, updateAppointmentStatus } from "../services/appointmentService.js";
import { useState } from "react";

const loadAppointments = () => getAppointments();

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { data, setData, loading, warning } = useResource(loadAppointments, sampleAppointments);
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState("");
  const appointments = data.filter((item) => item.doctorEmail === user?.email);
  const pending = appointments.filter((item) => String(item.status).toUpperCase() === "PENDING");
  const recent = appointments.filter((item) => String(item.status).toUpperCase() !== "PENDING").slice(0, 3);
  const confirmed = appointments.filter((item) => String(item.status).toUpperCase() === "CONFIRMED").length;

  async function decide(id, status) {
    setActionError("");
    setBusyId(id);
    try {
      updateAppointmentStatus(id, status);
      setData((current) => current.map((item) => String(item.id ?? item.appointmentId) === String(id) ? { ...item, status } : item));
    } catch (error) {
      setActionError(error.message || `Could not ${status.toLowerCase()} this appointment.`);
    } finally {
      setBusyId("");
    }
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-topline"><span>Doctor workspace</span><span className="dashboard-date"><CalendarDays size={15} /> Your practice, at a glance</span></div>
        <section className="welcome-panel doctor-welcome"><div><p className="eyebrow">YOUR PRACTICE</p><h1>Welcome, Dr. {user?.name?.replace(/^Dr\.?\s*/i, "").split(" ")[0] ?? user?.fullName?.split(" ")[0] ?? "Doctor"}.</h1><p>Here’s a look at your patients and appointment requests.</p></div><div className="welcome-art"><Users size={42} /><span /></div></section>
        {warning && <div className="alert alert-info" role="status">{warning}</div>}{actionError && <div className="alert alert-error" role="alert">{actionError}</div>}
        <section className="stat-grid">
          <article className="stat-card"><span className="stat-icon stat-blue"><CalendarDays size={19} /></span><div><p>Total appointments</p><strong>{loading ? "—" : appointments.length}</strong><small>Your patient schedule</small></div></article>
          <article className="stat-card"><span className="stat-icon stat-orange"><CalendarClock size={19} /></span><div><p>Pending requests</p><strong>{loading ? "—" : pending.length}</strong><small>Need your attention</small></div></article>
          <article className="stat-card"><span className="stat-icon stat-green"><CalendarCheck size={19} /></span><div><p>Confirmed</p><strong>{loading ? "—" : confirmed}</strong><small>Approved appointments</small></div></article>
        </section>
        <section className="dashboard-section">
          <div className="section-title-row"><div><p className="eyebrow">NEEDS YOUR ATTENTION</p><h2>Appointment requests</h2></div><Link className="text-link" to="/appointments?view=requests">View all <ArrowRight size={16} /></Link></div>
          {loading ? <div className="loading-panel"><span className="spinner" /> Loading requests...</div> : pending.length ? <div className="appointment-list">{pending.slice(0, 4).map((appointment, index) => {
            const id = appointment.id ?? appointment.appointmentId;
            return <AppointmentCard key={id ?? index} appointment={appointment} actions={<><button className="button button-approve button-small" disabled={busyId === id} onClick={() => decide(id, "CONFIRMED")}><Check size={15} /> Approve</button><button className="button button-reject button-small" disabled={busyId === id} onClick={() => decide(id, "REJECTED")}><X size={15} /> Reject</button></>} />;
          })}</div> : <div className="empty-state compact-empty"><div className="empty-icon"><Clock3 size={22} /></div><h3>All caught up</h3><p>New appointment requests will show up here.</p></div>}
        </section>
        <section className="dashboard-section">
          <div className="section-title-row"><div><p className="eyebrow">YOUR SCHEDULE</p><h2>Recent appointments</h2></div><Link className="text-link" to="/appointments">View all <ArrowRight size={16} /></Link></div>
          {loading ? <div className="loading-panel"><span className="spinner" /> Loading appointments...</div> : recent.length ? <div className="appointment-list">{recent.map((appointment, index) => <AppointmentCard appointment={appointment} key={appointment.id ?? index} />)}</div> : <div className="empty-state compact-empty"><div className="empty-icon"><CalendarDays size={22} /></div><h3>No handled appointments yet</h3><p>Approved and completed appointments will appear here.</p></div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
