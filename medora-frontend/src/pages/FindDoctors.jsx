import { Search, SlidersHorizontal, Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";
import DoctorCard from "../components/DoctorCard.jsx";
import { getDoctors } from "../services/doctorService.js";

export default function FindDoctors() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const doctors = getDoctors();
  const specialties = useMemo(
    () => ["All specialties", ...new Set(doctors.map((doctor) => doctor.specialization ?? doctor.specialty).filter(Boolean))],
    [doctors],
  );
  const filtered = doctors.filter((doctor) => {
    const name = doctor.name ?? doctor.fullName ?? "";
    const area = doctor.specialization ?? doctor.specialty ?? "";
    const matchesText = `${name} ${area} ${doctor.qualification ?? ""}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (specialty === "All specialties" || area === specialty);
  });

  return (
    <main className="find-doctors-page">
      <section className="directory-hero">
        <div className="directory-hero-inner">
          <div className="directory-copy"><p className="eyebrow"><Stethoscope size={15} /> Care begins with a connection</p><h1>Find the right<br /><span>doctor for you.</span></h1><p>Meet thoughtful healthcare professionals ready to listen, guide, and care for you.</p></div>
          <div className="directory-stat"><strong>{doctors.length.toString().padStart(2, "0")}</strong><span>care professionals<br />to explore</span></div>
          <div className="directory-shape directory-shape-one" /><div className="directory-shape directory-shape-two" />
        </div>
      </section>
      <section className="directory-content">
        <div className="directory-toolbar">
          <div><h2>Explore our doctors</h2><p>Search by name, specialty, or qualification.</p></div>
          <span className="directory-result">{filtered.length} {filtered.length === 1 ? "doctor" : "doctors"}</span>
        </div>
        <div className="doctor-filters">
          <div className="search-field"><Search size={18} /><input aria-label="Search doctors" placeholder="Search doctors or specialties..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <div className="filter-field"><SlidersHorizontal size={17} /><select aria-label="Filter by specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>{specialties.map((item) => <option key={item}>{item}</option>)}</select></div>
        </div>
        {filtered.length ? <div className="doctor-grid">{filtered.map((doctor, index) => <DoctorCard doctor={doctor} key={doctor.id ?? doctor.doctorId ?? `${doctor.name}-${index}`} />)}</div> : <div className="empty-state"><div className="empty-icon"><Search size={23} /></div><h3>No doctors found</h3><p>Try a different search or select another specialty.</p><button className="button button-outline" onClick={() => { setQuery(""); setSpecialty("All specialties"); }}>Clear filters</button></div>}
        <p className="directory-disclaimer">Doctor profiles and appointment availability are fictional demonstration data stored locally in this browser.</p>
      </section>
    </main>
  );
}
