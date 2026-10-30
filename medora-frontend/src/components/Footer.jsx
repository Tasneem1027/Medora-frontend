import { Activity, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="brand brand-light" to="/"><span className="brand-mark"><Activity size={20} /></span><span>medora<span className="brand-period">.</span></span></Link>
          <p>Thoughtful care, made easier. Connect with trusted healthcare professionals from wherever you are.</p>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/find-doctors">Find a doctor</Link>
          <Link to="/register">Create an account</Link>
          <a href="/#about">About Medora</a>
        </div>
        <div className="footer-column footer-contact">
          <h3>Get in touch</h3>
          <span><Mail size={15} /> hello@medora.health</span>
          <span><Phone size={15} /> +1 (800) 555-0148</span>
          <span><MapPin size={15} /> Healthcare, made accessible</span>
        </div>
        <a className="footer-top" href="#top" aria-label="Back to top"><ArrowUpRight size={18} /></a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Medora. Final-year project demo.</span>
        <span>For informational purposes only — not for medical emergencies.</span>
      </div>
    </footer>
  );
}
