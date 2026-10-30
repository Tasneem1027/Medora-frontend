import { ArrowLeft, ArrowRight, Award, CalendarCheck, CalendarDays, Clock3, ShieldCheck, Stethoscope } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getDoctorById } from "../services/doctorService.js";

export default function DoctorProfile() {
  const { id } = useParams();
  const doctor = getDoctorById(id);

  if (!doctor) return <main className="doctor-profile-page"><div className="empty-state"><div className="empty-icon"><Stethoscope size={22} /></div><h3>Doctor profile not found</h3><p>This doctor may no longer be available.</p><Link className="button button-outline button-small" to="/find-doctors"><ArrowLeft size={15} /> Back to doctors</Link></div></main>;

  const name = doctor.name ?? doctor.fullName ?? "Doctor";
  const specialty = doctor.specialization ?? doctor.specialty ?? "Healthcare professional";
  const initials = doctor.initials ?? name.split(" ").slice(-2).map((part) => part[0]).join("");

  return (
    <main className="doctor-profile-page">
      <div className="doctor-profile-wrap">
        <Link to="/find-doctors" className="back-link"><ArrowLeft size={16} /> Back to doctors</Link>
        <section className="doctor-profile-card panel">
          <div className={`doctor-profile-avatar avatar-${doctor.color ?? "blue"}`}>{initials}</div>
          <div className="doctor-profile-main">
            <p className="eyebrow">{specialty}</p>
            <h1>{name}</h1>
            <p className="profile-qualification">{doctor.qualification ?? "Professional qualifications not listed"}</p>
            <div className="doctor-profile-facts"><span><Award size={16} />{doctor.experience ? `${doctor.experience} years of experience` : "Experience not listed"}</span>{doctor.fee != null && <span>Consultation fee: ${doctor.fee}</span>}</div>
            {doctor.availability && <div className="profile-availability"><span />{doctor.availability}</div>}
            <div className="doctor-profile-actions"><Link className="button button-primary button-large" to={`/book-appointment?doctor=${encodeURIComponent(doctor.id ?? doctor.doctorId ?? id)}`}>Book an appointment <ArrowRight size={17} /></Link><div className="profile-trust-note"><ShieldCheck size={16} />Fictional profile for local demonstration.</div></div>
          </div>
        </section>
        <section className="doctor-profile-details">
          <div className="panel"><span className="profile-detail-icon"><Stethoscope size={18} /></span><h2>Specialty & care</h2><p>{specialty} consultations designed around your needs. This fictional profile is part of the local demonstration.</p></div>
          <div className="panel"><span className="profile-detail-icon profile-detail-green"><CalendarCheck size={18} /></span><h2>Appointment information</h2><p>Choose your preferred date and time. Your appointment request is saved locally and starts as Pending.</p><div className="profile-detail-meta"><span><CalendarDays size={14} />Flexible scheduling</span><span><Clock3 size={14} />Local demo confirmation</span></div></div>
        </section>
      </div>
    </main>
  );
}
