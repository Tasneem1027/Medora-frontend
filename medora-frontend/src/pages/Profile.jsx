import { FileHeart, HeartPulse, Save, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getProfile, updateProfile } from "../services/profileService.js";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ name: user?.name ?? user?.fullName ?? "", email: user?.email ?? "", phone: user?.phone ?? "", specialization: user?.specialization ?? "", qualification: user?.qualification ?? "", experience: user?.experience ?? "" });
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [recordsSelected, setRecordsSelected] = useState(false);
  const isDoctor = user?.role === "DOCTOR";

  useEffect(() => {
    try {
      const profile = getProfile(user);
      setForm((current) => ({ ...current, ...profile }));
    } catch (requestError) {
      setWarning(requestError.message || "Could not load the saved profile.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setRecordsSelected(location.pathname === "/medical-records" || location.state?.section === "records");
  }, [location.pathname, location.state]);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.email.trim()) return setError("Name and email are required.");
    try {
      const updatedProfile = updateProfile(user, form);
      updateUser(updatedProfile);
      setSuccess("Your profile was updated.");
    } catch (requestError) {
      setError(requestError.message || "We could not update your profile.");
    }
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-topline"><span>{isDoctor ? "Doctor workspace" : "Patient workspace"}</span><span className="dashboard-date"><ShieldCheck size={15} /> Your information</span></div>
        <div className="page-title-block"><p className="eyebrow">ACCOUNT SETTINGS</p><h1>{recordsSelected ? "Medical records" : "My profile"}</h1><p>{recordsSelected ? "Keep important health information easy to find." : "Manage your personal information and account details."}</p></div>
        {!isDoctor && <div className="profile-tabs"><button className={!recordsSelected ? "profile-tab active" : "profile-tab"} onClick={() => setRecordsSelected(false)}><UserRound size={16} /> Profile</button><button className={recordsSelected ? "profile-tab active" : "profile-tab"} onClick={() => setRecordsSelected(true)}><FileHeart size={16} /> Medical records</button></div>}
        {warning && <div className="alert alert-info" role="status">{warning}</div>}
        {recordsSelected ? <section className="records-empty panel"><span className="records-empty-icon"><FileHeart size={25} /></span><h2>Your records, all together</h2><p>This demo keeps profile and prescription information in your browser. You can review prescriptions from the Prescriptions page.</p><div className="records-privacy"><ShieldCheck size={17} /> Demo information stays in this browser’s local storage.</div></section> :
          <form className="profile-form panel" onSubmit={submit} noValidate>
            <div className="form-heading"><span className="form-heading-icon"><UserRound size={20} /></span><div><h2>Personal information</h2><p>Your details help your care team know you better.</p></div></div>
            {error && <div className="alert alert-error" role="alert">{error}</div>}{success && <div className="alert alert-success" role="status">{success}</div>}
            <div className="form-two-col"><div><label className="field-label" htmlFor="profile-name">Full name</label><input className="text-input" id="profile-name" name="name" value={form.name} onChange={update} disabled={loading} /></div><div><label className="field-label" htmlFor="profile-email">Email address</label><input className="text-input" id="profile-email" name="email" type="email" value={form.email} onChange={update} disabled={loading} /></div></div>
            <div className="form-two-col"><div><label className="field-label" htmlFor="profile-phone">Phone number</label><input className="text-input" id="profile-phone" name="phone" type="tel" value={form.phone} onChange={update} disabled={loading} /></div>{isDoctor && <div><label className="field-label" htmlFor="specialization">Specialization</label><input className="text-input" id="specialization" name="specialization" value={form.specialization} onChange={update} disabled={loading} /></div>}</div>
            {isDoctor && <div className="form-two-col"><div><label className="field-label" htmlFor="qualification">Qualification</label><input className="text-input" id="qualification" name="qualification" value={form.qualification} onChange={update} disabled={loading} /></div><div><label className="field-label" htmlFor="experience">Years of experience</label><input className="text-input" id="experience" name="experience" type="number" min="0" value={form.experience} onChange={update} disabled={loading} /></div></div>}
            <div className="profile-security"><span><HeartPulse size={18} /></span><div><strong>Your information deserves care</strong><p>This profile is a project demo. Avoid adding sensitive medical details.</p></div></div>
            <button className="button button-primary" disabled={loading}><Save size={17} /> Save changes</button>
          </form>}
      </div>
    </DashboardLayout>
  );
}
