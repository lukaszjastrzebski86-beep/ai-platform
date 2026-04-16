export default function PortalCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="portal-card glass">
      <div className="portal-card-title">{title}</div>
      <div className="portal-card-text">{text}</div>
    </div>
  );
}