import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryChart({ summary }) {
  const data = {
    labels: ["Work", "Leisure", "Social", "Gaming"],
    datasets: [
      {
        data: [
          summary.workTime,
          summary.leisureTime,
          summary.socialTime,
          summary.gamingTime,
        ],
      },
    ],
  };

  return (
    <div style={{ width: "400px", marginTop: "40px" }}>
      <h2>Category Breakdown</h2>
      <Pie data={data} />
    </div>
  );
}
