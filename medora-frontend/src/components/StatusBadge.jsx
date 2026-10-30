export default function StatusBadge({ status = "PENDING" }) {
  const normalized = String(status).toLowerCase();
  return <span className={`status-badge status-${normalized}`}>{normalized}</span>;
}
