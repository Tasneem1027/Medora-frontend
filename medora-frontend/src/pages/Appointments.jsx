import { CalendarDays, Check, Clock3, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AppointmentCard from "../components/AppointmentCard.jsx";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useResource from "../hooks/useResource.js";
import { sampleAppointments } from "../data/sampleData.js";
import { getAppointments, updateAppointmentStatus } from "../services/appointmentService.js";

export default function Appointments() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState("");
  const load = useCallback(() => getAppointments(), []);
  const { data, setData, loading, warning } = useResource(load, sampleAppointments);
  const isDoctor = user?.role === "DOCTOR";
  const showingRequests = isDoctor && searchParams.get("view") === "requests";
  const appointments = data.filter((item) => isDoctor ? item.doctorEmail === user.email : item.patientEmail === user.email);
  const shown = showingRequests ? appointments.filter((item) => String(item.status).toUpperCase() === "PENDING") : appointments;

  async function decide(id, status) {
    setActionError("");
    setBusyId(id);
    try {
      updateAppointmentStatus(id, status);
      setData((current) => current.map((item) => String(item.id ?? item.appointmentId) === String(id) ? { ...item, status } : item));
    } catch (error) {
      setActionError(error.message || "Could not update this appointment.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-topline"><span>{isDoctor ? "Doctor workspace" : "Patient workspace"}</span><span className="dashboard-date"><CalendarDays size={15} /> Keep your care in view</span></div>
        <div className="page-title-block"><p className="eyebrow">{showingRequests ? "YOUR INBOX" : "YOUR SCHEDULE"}</p><h1>{showingRequests ? "Appointment requests" : "My appointments"}</h1><p>{showingRequests ? "Review and respond to requests from your patients." : "A clear view of your upcoming and past visits."}</p></div>
        {warning && <div className="alert alert-info" role="status">{warning}</div>}{actionError && <div className="alert alert-error" role="alert">{actionError}</div>}
        {loading ? <div className="loading-panel"><span className="spinner" /> Loading appointments...</div> : shown.length ? <div className="appointment-list appointments-full">{shown.map((appointment, index) => {
          const id = appointment.id ?? appointment.appointmentId;
          const actions = isDoctor && showingRequests && String(appointment.status).toUpperCase() === "PENDING" ? <><button className="button button-approve button-small" disabled={busyId === id} onClick={() => decide(id, "CONFIRMED")}><Check size={15} /> Approve</button><button className="button button-reject button-small" disabled={busyId === id} onClick={() => decide(id, "REJECTED")}><X size={15} /> Reject</button></> : null;
          return <AppointmentCard appointment={appointment} actions={actions} key={id ?? index} />;
        })}</div> : <div className="empty-state"><div className="empty-icon"><Clock3 size={22} /></div><h3>{showingRequests ? "No requests waiting" : "No appointments yet"}</h3><p>{showingRequests ? "You’re all caught up for now." : "Your appointments will appear here once they’re booked."}</p></div>}
      </div>
    </DashboardLayout>
  );
}
