import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import CategoryChart from "../charts/CategoryChart";
import IntensityChart from "../charts/IntensityChart";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadLiveSummary();
  }, []);

  async function loadLiveSummary() {
    try {
      const res = await fetch("http://localhost:5000/live-summary");
      const data = await res.json();
      console.log(data);
      setSummary(data);
    } catch (err) {
      console.error("Failed to load summary:", err);
    }
  }

  if (!summary || summary.message) {
    return (
      <div style={{ padding: "30px" }}>
        <h1>Burnout Dashboard</h1>
        <p style={{ marginTop: "-8px", color: "#666" }}>
          No summary available yet for today.
        </p>
        <p style={{ fontSize: "14px", color: "#999" }}>
          Start using your system… data will appear automatically.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Burnout Dashboard</h1>
      <p style={{ marginTop: "-8px", color: "#666" }}>
        Live summary of your activity for today
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
          marginTop: "25px",
        }}
      >
        <SummaryCard
          label="Total Screen Time"
          value={`${summary.totalScreenTime} sec`}
        />
        <SummaryCard label="Work Time" value={`${summary.workTime} sec`} />
        <SummaryCard
          label="Leisure Time"
          value={`${summary.leisureTime} sec`}
        />
        <SummaryCard label="Social Time" value={`${summary.socialTime} sec`} />
        <SummaryCard label="Gaming Time" value={`${summary.gamingTime} sec`} />

        <SummaryCard label="Task Switches" value={summary.taskSwitches} />

        <SummaryCard
          label="Keystroke Intensity"
          value={summary.keystrokeIntensity.toFixed(2)}
        />

        <SummaryCard
          label="Mouse Intensity"
          value={summary.mouseIntensity.toFixed(2)}
        />

        <SummaryCard
          label="Scroll Intensity"
          value={summary.scrollIntensity.toFixed(2)}
        />
      </div>

      <div style={{ display: "flex", gap: "40px", marginTop: "40px" }}>
        <CategoryChart summary={summary} />
        <IntensityChart summary={summary} />
      </div>
    </div>
  );
}
