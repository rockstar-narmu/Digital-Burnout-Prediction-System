import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import CategoryChart from "../charts/CategoryChart";
import IntensityChart from "../charts/IntensityChart";
import formatTime from "../utils/formatTime";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadSummary(selectedDate);
  }, [selectedDate]);

  async function loadSummary(date) {
    try {
      const res = await fetch(
        `http://localhost:5000/live-summary?date=${date}`,
      );
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Failed to load summary:", err);
    }
  }

  function handleDateChange(e) {
    setSelectedDate(e.target.value);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Burnout Dashboard</h1>

      {/* Dynamic Title */}
      <p style={{ marginTop: "-8px", color: "#666" }}>
        {selectedDate === today
          ? "Live summary of your activity for today"
          : `Summary of your activity for ${selectedDate}`}
      </p>

      {/* 🌸 Date Picker with Label */}
      <div style={{ marginTop: "12px", marginBottom: "10px" }}>
        <label
          style={{
            marginRight: "10px",
            fontWeight: "500",
            fontSize: "15px",
          }}
        >
          Choose date:
        </label>

        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={handleDateChange}
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* No Summary */}
      {!summary || summary.message ? (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "#999" }}>No summary available for this date.</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
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
              value={formatTime(summary.totalScreenTime)}
            />

            <SummaryCard
              label="Work Time"
              value={formatTime(summary.workTime)}
            />

            <SummaryCard
              label="Leisure Time"
              value={formatTime(summary.leisureTime)}
            />

            <SummaryCard
              label="Social Time"
              value={formatTime(summary.socialTime)}
            />

            <SummaryCard
              label="Gaming Time"
              value={formatTime(summary.gamingTime)}
            />

            <SummaryCard label="Task Switches" value={summary.taskSwitches} />
            <SummaryCard
              label="Keystroke Intensity"
              value={summary.keystrokeIntensity?.toFixed(2) || 0}
            />
            <SummaryCard
              label="Mouse Intensity"
              value={summary.mouseIntensity?.toFixed(2) || 0}
            />
            <SummaryCard
              label="Scroll Intensity"
              value={summary.scrollIntensity?.toFixed(2) || 0}
            />
          </div>

          {/* Charts Centered */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              marginTop: "40px",
            }}
          >
            <CategoryChart summary={summary} />
            <IntensityChart summary={summary} />
          </div>
        </>
      )}
    </div>
  );
}
