import { Menu, X } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar.jsx";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dashboard-shell">
      <div className={`sidebar-overlay ${sidebarOpen ? "overlay-visible" : ""}`} onClick={() => setSidebarOpen(false)} />
      <div className={`dashboard-sidebar-wrap ${sidebarOpen ? "sidebar-visible" : ""}`}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
        <button className="mobile-sidebar-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
      </div>
      <main className="dashboard-main">
        <button className="mobile-sidebar-open" onClick={() => setSidebarOpen(true)}><Menu size={19} /> Menu</button>
        {children}
      </main>
    </div>
  );
}
