import { CalendarDays, Clock3 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function AppointmentCard({ appointment, actions }) {
  const doctorName = appointment.doctorName ?? appointment.doctor?.name ?? "Doctor";
  const patientName = appointment.patientName ?? appointment.patient?.name;
  return (
    <article className="appointment-card">
      <div className="appointment-avatar">{(patientName ?? doctorName).split(" ").slice(-1)[0]?.[0] ?? "M"}</div>
      <div className="appointment-info">
        <div className="appointment-title">
          <div>
            <h3>{patientName || doctorName}</h3>
            <p>{patientName ? `with ${doctorName}` : (appointment.specialty ?? "Consultation")}</p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
        <div className="appointment-detail-line">
          <span><CalendarDays size={15} />{appointment.date ?? appointment.appointmentDate ?? "Date not set"}</span>
          <span><Clock3 size={15} />{appointment.time ?? appointment.appointmentTime ?? "Time not set"}</span>
        </div>
        {appointment.reason && <p className="appointment-reason">{appointment.reason}</p>}
        {actions && <div className="appointment-actions">{actions}</div>}
      </div>
    </article>
  );
}
