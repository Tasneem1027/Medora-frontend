import { ArrowRight, CalendarCheck, CalendarClock, CalendarDays, FileText, HeartPulse, Plus, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import AppointmentCard from "../components/AppointmentCard.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useResource from "../hooks/useResource.js";
import { sampleAppointments } from "../data/sampleData.js";
import { getAppointments } from "../services/appointmentService.js";

const loadAppointments = () => getAppointments();

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: appointments, loading, warning } = useResource(loadAppointments, sampleAppointments);
  const myAppointments = appointments.filter((item) => item.patientEmail === user?.email);
  const pending = myAppointments.filter((item) => String(item.status).toUpperCase() === "PENDING").length;
  const confirmed = myAppointments.filter((item) => String(item.status).toUpperCase() === "CONFIRMED").length;

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-topline"><span>Patient workspace</span><span className="dashboard-date"><CalendarDays size={15} /> Your care, at a glance</span></div>
        <section className="welcome-panel"><div><p className="eyebrow">YOUR HEALTH JOURNEY</p><h1>Good to see you, {user?.name?.split(" ")[0] ?? user?.fullName?.split(" ")[0] ?? "there"}.</h1><p>Here’s what’s happening with your care today.</p></div><div className="welcome-art"><HeartPulse size={43} /><span /></div></section>
        {warning && <div className="alert alert-info" role="status">{warning}</div>}
        <section className="stat-grid">
          <article className="stat-card"><span className="stat-icon stat-blue"><CalendarDays size={19} /></span><div><p>Total appointments</p><strong>{loading ? "—" : myAppointments.length}</strong><small>Across your care journey</small></div></article>
          <article className="stat-card"><span className="stat-icon stat-orange"><CalendarClock size={19} /></span><div><p>Pending</p><strong>{loading ? "—" : pending}</strong><small>Waiting for confirmation</small></div></article>
          <article className="stat-card"><span className="stat-icon stat-green"><CalendarCheck size={19} /></span><div><p>Confirmed</p><strong>{loading ? "—" : confirmed}</strong><small>Coming up on your calendar</small></div></article>
        </section>
        <section className="dashboard-section">
          <div className="section-title-row"><div><p className="eyebrow">YOUR SCHEDULE</p><h2>Recent appointments</h2></div><Link className="text-link" to="/appointments">View all <ArrowRight size={16} /></Link></div>
          {loading ? <div className="loading-panel"><span className="spinner" /> Loading appointments...</div> : myAppointments.length ? <div className="appointment-list">{myAppointments.slice(0, 3).map((appointment, index) => <AppointmentCard appointment={appointment} key={appointment.id ?? index} />)}</div> : <div className="empty-state compact-empty"><div className="empty-icon"><CalendarDays size={22} /></div><h3>No appointments yet</h3><p>Your upcoming visits will appear here.</p><Link className="button button-primary button-small" to="/find-doctors"><Plus size={16} /> Find a doctor</Link></div>}
        </section>
        <section className="dashboard-quick-links"><Link to="/find-doctors"><span className="quick-icon"><Stethoscope size={19} /></span><span><strong>Find a doctor</strong><small>Meet your care team</small></span><ArrowRight size={17} /></Link><Link to="/prescriptions"><span className="quick-icon quick-icon-green"><FileText size={19} /></span><span><strong>Prescriptions</strong><small>Review your treatment details</small></span><ArrowRight size={17} /></Link></section>
      </div>
    </DashboardLayout>
  );
}
