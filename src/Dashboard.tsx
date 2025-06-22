// src/pages/Dashboard.js or Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [metric, setMetric] = useState<'population' | 'area'>('population');

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all?fields=name,currencies,languages,population,area,borders')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Calculate statistics
  const languageCounts = {} as Record<string, number>;
  const currencyCounts = {} as Record<string, number>;
  let totalPopulation = 0;
  let totalArea = 0;
  let totalNeighbours = 0;

  countries.forEach((country: any) => {
    // Languages
    if (country.languages) {
      Object.values(country.languages).forEach((lang) => {
        const language = String(lang);
        languageCounts[language] = (languageCounts[language] || 0) + 1;
      });
    }
    // Currencies
    if (country.currencies) {
      Object.values(country.currencies).forEach((currency: any) => {
        currencyCounts[currency.name] = (currencyCounts[currency.name] || 0) + 1;
      });
    }
    // Population & Area
    totalPopulation += country.population || 0;
    totalArea += country.area || 0;
    // Neighbours
    totalNeighbours += country.borders ? country.borders.length : 0;
  });

  // Top 5 languages
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang, count]) => `${lang} (${count})`)
    .join(', ');

  // Top 5 currencies
  const topCurrencies = Object.entries(currencyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cur, count]) => `${cur} (${count})`)
    .join(', ');

  const avgPopulation = countries.length ? Math.round(totalPopulation / countries.length) : 0;
  const avgArea = countries.length ? Math.round(totalArea / countries.length) : 0;
  const avgNeighbours = countries.length ? (totalNeighbours / countries.length).toFixed(2) : 0;

  // Chart data for top 20 countries by selected metric
  const top20 = [...countries]
    .sort((a: any, b: any) => (b[metric] || 0) - (a[metric] || 0))
    .slice(0, 20);
  const chartData = {
    labels: top20.map((c: any) => c.name.common),
    datasets: [
      {
        label: metric.charAt(0).toUpperCase() + metric.slice(1),
        data: top20.map((c: any) => c[metric]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
      >
        Table
      </button>
      <div>
        <p>Total number of countries: {countries.length}</p>
        <p>Top 5 most common languages: {topLanguages}</p>
        <p>Top 5 most common currencies: {topCurrencies}</p>
        <p>Average area: {avgArea.toLocaleString()}</p>
        <p>Average population: {avgPopulation.toLocaleString()}</p>
        <p>Average number of neighbours: {avgNeighbours}</p>
      </div>
      <div style={{ margin: '2rem 0', maxWidth: 900 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ marginRight: 8 }}>Show top 20 by:</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 8, fontWeight: metric === 'population' ? 'bold' : 'normal' }}>Population</span>
            <label style={{ position: 'relative', display: 'inline-block', width: 50, height: 24, marginRight: 8 }}>
              <input
                type="checkbox"
                checked={metric === 'area'}
                onChange={() => setMetric(metric === 'population' ? 'area' : 'population')}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: metric === 'area' ? '#2196F3' : '#ccc',
                transition: '.4s',
                borderRadius: 24
              }}></span>
              <span style={{
                position: 'absolute',
                left: metric === 'area' ? 26 : 4,
                top: 4,
                width: 16,
                height: 16,
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '.4s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}></span>
            </label>
            <span style={{ fontWeight: metric === 'area' ? 'bold' : 'normal' }}>Area</span>
          </div>
        </div>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              title: { display: true, text: `Top 20 Countries by ${metric.charAt(0).toUpperCase() + metric.slice(1)}` },
            },
            scales: {
              x: { ticks: { autoSkip: false, maxRotation: 90, minRotation: 60 } },
              y: { beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
