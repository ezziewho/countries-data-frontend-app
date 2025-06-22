import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./tableOfCountries.css";
import "./dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [metric, setMetric] = useState<"population" | "area">("population");

  useEffect(() => {
    axios
      .get(
        "https://restcountries.com/v3.1/all?fields=name,currencies,languages,population,area,borders"
      )
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const languageCounts = {} as Record<string, number>;
  const currencyCounts = {} as Record<string, number>;
  let totalPopulation = 0;
  let totalArea = 0;
  let totalNeighbours = 0;

  countries.forEach((country: any) => {
    if (country.languages) {
      Object.values(country.languages).forEach((lang) => {
        const language = String(lang);
        languageCounts[language] = (languageCounts[language] || 0) + 1;
      });
    }

    if (country.currencies) {
      Object.values(country.currencies).forEach((currency: any) => {
        currencyCounts[currency.name] =
          (currencyCounts[currency.name] || 0) + 1;
      });
    }

    totalPopulation += country.population || 0;
    totalArea += country.area || 0;

    totalNeighbours += country.borders ? country.borders.length : 0;
  });

  const topLanguagesArr = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => `${lang} (${count})`);
  const topLanguages = topLanguagesArr.join(", ");

  const topCurrenciesArr = Object.entries(currencyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cur, count]) => `${cur} (${count})`);
  const topLanguagesDisplay = topLanguagesArr.map((lang, i) => (
    <span key={lang}>
      {lang}
      {i < topLanguagesArr.length - 1 ? ", " : ""}
      <br />
    </span>
  ));

  const topCurrenciesDisplay = topCurrenciesArr.map((cur, i) => (
    <span key={cur}>
      {cur}
      {i < topCurrenciesArr.length - 1 ? ", " : ""}
      <br />
    </span>
  ));

  const avgPopulation = countries.length
    ? Math.round(totalPopulation / countries.length)
    : 0;
  const avgArea = countries.length
    ? Math.round(totalArea / countries.length)
    : 0;
  const avgNeighbours = countries.length
    ? (totalNeighbours / countries.length).toFixed(2)
    : 0;

  const top20 = [...countries]
    .filter((c) => c && typeof c[metric] === "number" && !isNaN(c[metric]))
    .sort((a: any, b: any) => (b[metric] || 0) - (a[metric] || 0))
    .slice(0, 20);
  const chartData = {
    labels: top20.map((c: any) =>
      c.name && c.name.common ? c.name.common : "-"
    ),
    datasets: [
      {
        label: metric.charAt(0).toUpperCase() + metric.slice(1),
        data: top20.map((c: any) =>
          typeof c[metric] === "number" ? c[metric] : 0
        ),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div className="App">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "0.5rem 1.2rem" }}
        >
          Table
        </button>
      </div>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="label">Total countries</div>
          <div className="big-value">{countries.length}</div>
        </div>
        <div className="dashboard-card">
          <div className="label">Top 5 languages</div>
          <div className="value">{topLanguagesDisplay}</div>
        </div>
        <div className="dashboard-card">
          <div className="label">Top 5 currencies</div>
          <div className="value">{topCurrenciesDisplay}</div>
        </div>
        <div className="dashboard-card">
          <div className="label">Avg. area</div>
          <div className="value">{avgArea.toLocaleString()}</div>
        </div>
        <div className="dashboard-card">
          <div className="label">Avg. population</div>
          <div className="value">{avgPopulation.toLocaleString()}</div>
        </div>
        <div className="dashboard-card">
          <div className="label">Avg. neighbours</div>
          <div className="value">{avgNeighbours}</div>
        </div>
      </div>
      <div style={{ margin: "2rem 0", maxWidth: 900 }}>
        <div className="dashboard-toggle-row">
          <span>Show top 20 by:</span>
          <div className="dashboard-toggle">
            <span
              className={`toggle-label${metric === "population" ? " selected" : ""}`}
            >
              Population
            </span>
            <label className="dashboard-switch">
              <input
                type="checkbox"
                checked={metric === "area"}
                onChange={() =>
                  setMetric(metric === "population" ? "area" : "population")
                }
              />
              <span className="slider"></span>
              <span className="knob"></span>
            </label>
            <span
              className={`toggle-label${metric === "area" ? " selected" : ""}`}
            >
              Area
            </span>
          </div>
        </div>
        
        <Bar className="bar-chart"
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: `Top 20 Countries by ${metric.charAt(0).toUpperCase() + metric.slice(1)}`,
              },
            },
            scales: {
              x: {
                ticks: { autoSkip: false, maxRotation: 90, minRotation: 60 },
              },
              y: { beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
