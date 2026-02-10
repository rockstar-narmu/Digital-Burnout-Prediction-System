import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function IntensityChart({ summary }) {
  const data = {
    labels: ["Keystroke", "Mouse", "Scroll"],
    datasets: [
      {
        label: "Intensity",
        data: [
          summary.keystrokeIntensity,
          summary.mouseIntensity,
          summary.scrollIntensity,
        ],
      },
    ],
  };

  return (
    <div style={{ width: "400px", marginTop: "40px" }}>
      <h2>Activity Intensity</h2>
      <Bar data={data} />
    </div>
  );
}
