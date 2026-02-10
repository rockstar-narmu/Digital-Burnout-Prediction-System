export default function SummaryCard({ label, value }) {
  return (
    <div
      style={{
        padding: "18px",
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "18px" }}>{label}</h3>
      <p style={{ marginTop: "6px", fontSize: "20px", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}
