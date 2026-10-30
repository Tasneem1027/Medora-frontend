import { ArrowRight, ArrowUpRight, CalendarCheck, Check, FileHeart, HeartPulse, ShieldCheck, Sparkles, Stethoscope, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { sampleDoctors } from "../data/sampleData.js";

const features = [
  { icon: CalendarCheck, title: "Appointments, made easy", text: "Find a time that works for you and book a consultation in just a few clicks.", color: "feature-blue" },
  { icon: ShieldCheck, title: "Care you can trust", text: "Explore doctor profiles with credentials and specialties, all in one place.", color: "feature-green" },
  { icon: FileHeart, title: "Care that stays with you", text: "Keep prescriptions and important health information easy to find.", color: "feature-purple" },
  { icon: Video, title: "Connect from anywhere", text: "Bring your next healthcare conversation closer, wherever life takes you.", color: "feature-orange" },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-kicker"><span className="kicker-dot" /> A more thoughtful way to care</div>
          <h1>Your health,<br /><span>our priority.</span></h1>
          <p>Care should fit your life. Find trusted doctors, book appointments, and keep your health journey in one calm, connected place.</p>
          <div className="hero-actions">
            <Link to="/find-doctors" className="button button-primary button-large">Find a doctor <ArrowRight size={18} /></Link>
            <Link to="/register" className="button button-light button-large">Get started <ArrowUpRight size={17} /></Link>
          </div>
          <div className="hero-proof"><div className="proof-avatars"><span>AC</span><span>SC</span><span>EB</span></div><div><strong>Care that feels closer</strong><small>Explore a more connected health experience</small></div></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a telehealth appointment">
          <div className="hero-circle circle-one" /><div className="hero-circle circle-two" />
          <div className="hero-note note-top"><span className="note-icon"><HeartPulse size={18} /></span><span><strong>Care, connected</strong><small>Right where you are</small></span><Check className="note-check" size={17} /></div>
          <div className="doctor-illustration">
            <div className="doctor-screen-top"><span /><span /><span /><b>medora call</b></div>
            <div className="portrait-background"><div className="portrait-sun" /><div className="portrait-hair" /><div className="portrait-neck" /><div className="portrait-coat"><div className="coat-neck" /><div className="coat-pocket"><HeartPulse size={18} /></div></div><div className="portrait-face"><div className="portrait-ear" /><div className="portrait-eyes"><i /><i /></div><div className="portrait-nose" /><div className="portrait-smile" /><div className="portrait-hair-front" /></div></div>
            <div className="doctor-screen-bottom"><div><strong>Dr. Amelia Carter</strong><small>Cardiology · Available today</small></div><span className="call-button"><Video size={18} /></span></div>
          </div>
          <div className="hero-note note-bottom"><span className="note-icon note-icon-green"><CalendarCheck size={18} /></span><span><strong>Your next step, simplified</strong><small>Book a visit in a few clicks</small></span></div>
          <div className="sparkle sparkle-a"><Sparkles size={20} /></div><div className="sparkle sparkle-b"><span>+</span></div>
        </div>
      </section>

      <section className="trust-strip">
        <span>HEALTHCARE, WITH YOU AT THE CENTER</span>
        <div><ShieldCheck size={17} /> Private by design</div><div><Stethoscope size={17} /> Care made personal</div><div><HeartPulse size={17} /> Support at every step</div>
      </section>

      <section className="section features-section" id="about">
        <div className="section-heading">
          <div><p className="eyebrow">A better care experience</p><h2>Healthcare that works<br />a little more like <span>you do.</span></h2></div>
          <p>From finding the right specialist to keeping track of your care, Medora makes the little things feel simpler.</p>
        </div>
        <div className="feature-grid">{features.map(({ icon: Icon, ...feature }) => <article className="feature-card" key={feature.title}><div className={`feature-icon ${feature.color}`}><Icon size={21} /></div><h3>{feature.title}</h3><p>{feature.text}</p><Link to="/find-doctors" aria-label={`Learn about ${feature.title}`}><ArrowUpRight size={17} /></Link></article>)}</div>
      </section>

      <section className="section doctor-preview">
        <div className="section-heading preview-heading">
          <div><p className="eyebrow">Meet your care team</p><h2>Good care starts with<br /><span>the right connection.</span></h2></div>
          <Link className="text-link" to="/find-doctors">Meet our doctors <ArrowRight size={17} /></Link>
        </div>
        <div className="preview-doctors">{sampleDoctors.slice(0, 3).map((doctor) => <article className="preview-doctor" key={doctor.id}><div className={`doctor-avatar avatar-${doctor.color}`}>{doctor.initials}</div><div><strong>{doctor.name}</strong><span>{doctor.specialization}</span></div><ArrowUpRight size={17} /></article>)}</div>
        <p className="sample-note">Fictional doctor profiles for this frontend-only demonstration.</p>
      </section>

      <section className="cta-section">
        <div className="cta-pattern" />
        <div><p className="eyebrow">Your health journey starts here</p><h2>Care that comes<br />to meet you.</h2><p>Take the next step toward a more connected healthcare experience.</p></div>
        <Link to="/register" className="button button-white button-large">Create your account <ArrowRight size={18} /></Link>
      </section>
    </main>
  );
}
