import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { UserRepoStats } from "../types";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default function PieChart({
  userRepoData,
}: {
  userRepoData: UserRepoStats;
}) {
  const labels = useMemo(
    () => Object.keys(userRepoData.languages),
    [userRepoData.languages]
  );
  const dataValues = useMemo(
    () => Object.values(userRepoData.languages),
    [userRepoData.languages]
  );

  // Generate random colors for each language
  const backgroundColors = useMemo(
    () => labels.map(() => getRandomColor()),
    [labels]
  );

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors,
      },
    ],
  };

  return <Pie data={data} />;
}
