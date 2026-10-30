import { ArrowUpRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  const id = doctor.id ?? doctor.doctorId;
  const name = doctor.name ?? doctor.fullName ?? "Doctor";
  const initials = doctor.initials ?? name.split(" ").slice(-2).map((part) => part[0]).join("");

  return (
    <article className="doctor-card">
      <div className={`doctor-avatar avatar-${doctor.color ?? "blue"}`}>{initials}</div>
      <div className="doctor-card-main">
        <div className="doctor-heading">
          <div>
            <p className="eyebrow">{doctor.specialization ?? doctor.specialty ?? "Specialist"}</p>
            <h3>{name}</h3>
          </div>
          {doctor.rating && <span className="rating"><Star size={15} fill="currentColor" /> {doctor.rating}</span>}
        </div>
        <p className="doctor-qualification">{doctor.qualification ?? "Qualification not provided"}</p>
        <div className="doctor-meta">
          <span>{doctor.experience ? `${doctor.experience} years experience` : "Experience not listed"}</span>
          {doctor.fee != null && <span>${doctor.fee} <small>consultation</small></span>}
        </div>
        {doctor.availability && <p className="availability"><span />{doctor.availability}</p>}
        <div className="doctor-actions">
          <Link className="button button-outline button-small" to={`/doctors/${encodeURIComponent(id ?? "")}`}>
            View profile <ArrowUpRight size={15} />
          </Link>
          <Link className="button button-primary button-small" to={`/book-appointment?doctor=${encodeURIComponent(id ?? "")}`}>
            Book appointment
          </Link>
        </div>
      </div>
    </article>
  );
}
