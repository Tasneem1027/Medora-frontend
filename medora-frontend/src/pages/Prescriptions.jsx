import { ClipboardPlus, FileText, Pill, Printer, Save } from "lucide-react";
import { useCallback, useState } from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useResource from "../hooks/useResource.js";
import { samplePrescriptions } from "../data/sampleData.js";
import { createPrescription, getPrescriptions } from "../services/prescriptionService.js";
import { getAccounts } from "../services/localStore.js";

const initialForm = {
  patient: "",
  diagnosis: "",
  medicine: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  prescriptionDate: new Date().toISOString().slice(0, 10),
};

function PrescriptionCard({ prescription }) {
  return (
    <article className="prescription-card">
      <div className="prescription-card-head"><span className="prescription-icon"><FileText size={19} /></span><div><p className="eyebrow">{prescription.date ?? prescription.prescriptionDate ?? "Date not provided"}</p><h3>{prescription.diagnosis ?? "Prescription"}</h3></div><button className="icon-button print-button" onClick={() => window.print()} aria-label="Print prescription"><Printer size={17} /></button></div>
      <div className="prescription-details"><p><span>Patient</span><strong>{prescription.patientName ?? prescription.patient ?? "Patient"}</strong></p><p><span>Prescribed by</span><strong>{prescription.doctorName ?? prescription.doctor ?? "Doctor"}</strong></p></div>
      <div className="medicine-row"><span className="medicine-icon"><Pill size={18} /></span><div><strong>{prescription.medicine ?? prescription.medicineName ?? "Medicine not listed"}</strong><span>{[prescription.dosage, prescription.frequency, prescription.duration].filter(Boolean).join(" · ")}</span></div></div>
      {prescription.instructions && <div className="prescription-instructions"><strong>Instructions</strong><p>{prescription.instructions}</p></div>}
    </article>
  );
}

export default function Prescriptions() {
  const { user } = useAuth();
  const isDoctor = user?.role === "DOCTOR";
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const load = useCallback(() => getPrescriptions(), []);
  const { data, loading, warning, setData } = useResource(load, samplePrescriptions);
  const prescriptions = data.filter((prescription) =>
    isDoctor ? prescription.doctorEmail === user.email : prescription.patientEmail === user.email,
  );

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    setFormError("");
    setSuccess("");
    if (Object.entries(form).some(([key, value]) => key !== "instructions" && !String(value).trim())) {
      return setFormError("Complete the patient email, diagnosis, medicine, dosage, frequency, duration, and date fields.");
    }
    const patientEmail = form.patient.trim().toLowerCase();
    const patient = getAccounts().find((account) => account.email === patientEmail && account.role === "PATIENT");
    if (!patient) return setFormError("Enter the email address of a registered patient.");

    try {
      createPrescription({
        ...form,
        patientEmail,
        patientName: patient.name,
        doctorEmail: user.email,
        doctorName: user.name,
      });
      setSuccess("Prescription saved successfully.");
      setForm(initialForm);
      setData(getPrescriptions());
    } catch (error) {
      setFormError(error.message || "Could not save this prescription.");
    }
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="dashboard-topline"><span>{isDoctor ? "Doctor workspace" : "Patient workspace"}</span><span className="dashboard-date"><FileText size={15} /> Clear, connected care</span></div>
        <div className="page-title-block"><p className="eyebrow">{isDoctor ? "PATIENT CARE" : "YOUR CARE"}</p><h1>{isDoctor ? "Prescriptions" : "My prescriptions"}</h1><p>{isDoctor ? "Create a clear treatment plan for your patients." : "Review the treatment information shared by your doctor."}</p></div>
        {warning && <div className="alert alert-info" role="status">{warning}</div>}
        {isDoctor && <form className="prescription-form panel" onSubmit={submit} noValidate>
          <div className="form-heading"><span className="form-heading-icon"><ClipboardPlus size={20} /></span><div><h2>Write a prescription</h2><p>Enter the treatment details for your patient.</p></div></div>
          {formError && <div className="alert alert-error" role="alert">{formError}</div>}{success && <div className="alert alert-success" role="status">{success}</div>}
          <div className="form-two-col"><div><label className="field-label" htmlFor="patient">Patient email</label><input className="text-input" id="patient" name="patient" type="email" placeholder="patient@example.test" value={form.patient} onChange={update} /></div><div><label className="field-label" htmlFor="diagnosis">Diagnosis</label><input className="text-input" id="diagnosis" name="diagnosis" placeholder="Diagnosis or condition" value={form.diagnosis} onChange={update} /></div></div>
          <div className="form-three-col"><div><label className="field-label" htmlFor="medicine">Medicine name</label><input className="text-input" id="medicine" name="medicine" placeholder="Medicine" value={form.medicine} onChange={update} /></div><div><label className="field-label" htmlFor="dosage">Dosage</label><input className="text-input" id="dosage" name="dosage" placeholder="e.g. 10 mg" value={form.dosage} onChange={update} /></div><div><label className="field-label" htmlFor="frequency">Frequency</label><input className="text-input" id="frequency" name="frequency" placeholder="e.g. once daily" value={form.frequency} onChange={update} /></div></div>
          <div className="form-two-col"><div><label className="field-label" htmlFor="duration">Duration</label><input className="text-input" id="duration" name="duration" placeholder="e.g. 7 days" value={form.duration} onChange={update} /></div><div><label className="field-label" htmlFor="prescriptionDate">Prescription date</label><input className="text-input" id="prescriptionDate" name="prescriptionDate" type="date" value={form.prescriptionDate} onChange={update} /></div></div>
          <label className="field-label" htmlFor="instructions">Instructions</label><textarea className="plain-textarea" id="instructions" name="instructions" rows="3" placeholder="Additional guidance for your patient..." value={form.instructions} onChange={update} />
          <button className="button button-primary"><Save size={17} /> Save prescription</button>
        </form>}
        <section className="prescription-list-section"><div className="section-title-row"><div><p className="eyebrow">{isDoctor ? "RECENTLY CREATED" : "YOUR TREATMENT"}</p><h2>{isDoctor ? "Recent prescriptions" : "Available prescriptions"}</h2></div><span className="directory-result">{prescriptions.length} total</span></div>
          {loading ? <div className="loading-panel"><span className="spinner" /> Loading prescriptions...</div> : prescriptions.length ? <div className="prescription-grid">{prescriptions.map((prescription, index) => <PrescriptionCard prescription={prescription} key={prescription.id ?? index} />)}</div> : <div className="empty-state"><div className="empty-icon"><FileText size={23} /></div><h3>No prescriptions yet</h3><p>Prescriptions shared with you will appear here.</p></div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
