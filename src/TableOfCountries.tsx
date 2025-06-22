import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./tableOfCountries.css";
import "./dashboard.css";

export type Country = {
  name: {
    common: string;
  };
  currencies: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
  languages: {
    [code: string]: string;
  };
  population: number;
  area: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
};

function TableOfCountries() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [sort, setSort] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [search, setSearch] = useState("");
  const [minPopulation, setMinPopulation] = useState("0");
  const [maxPopulation, setMaxPopulation] = useState("");

  useEffect(() => {
    if (countries && countries.length > 0) {
      const maxPop = Math.max(...countries.map((c) => c.population));
      setMaxPopulation(maxPop.toString());
    }
  }, [countries]);

  function handleHeaderClick(header: string) {
    setSort((prev) => {
      if (prev.key === header) {
        return {
          key: header,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      } else {
        return { key: header, direction: "asc" };
      }
    });
  }

  const filteredCountries = React.useMemo(() => {
    if (!countries) return null;
    let filtered = countries;
    const minPop = minPopulation ? parseInt(minPopulation, 10) : 0;
    const maxPop = maxPopulation ? parseInt(maxPopulation, 10) : Infinity;
    filtered = filtered.filter(
      (country) => country.population >= minPop && country.population <= maxPop
    );
    if (!search.trim()) return filtered;
    const lowerSearch = search.toLowerCase();
    return filtered.filter((country) => {
      if (country.name.common.toLowerCase().includes(lowerSearch)) return true;

      if (
        Object.values(country.currencies).some(
          (currency) =>
            currency.name.toLowerCase().includes(lowerSearch) ||
            currency.symbol?.toLowerCase().includes(lowerSearch)
        )
      )
        return true;

      if (
        Object.values(country.languages).some((lang) =>
          lang.toLowerCase().includes(lowerSearch)
        )
      )
        return true;

      if (country.population.toString().includes(lowerSearch)) return true;

      if (country.area.toString().includes(lowerSearch)) return true;
      return false;
    });
  }, [countries, search, minPopulation, maxPopulation]);

  const sortedCountries = React.useMemo(() => {
    if (!filteredCountries) return null;
    if (!sort.key) return filteredCountries;
    const sorted = [...filteredCountries];
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sort.key) {
        case "Name":
          aValue = a.name.common;
          bValue = b.name.common;
          break;
        case "Currency":
          aValue = Object.values(a.currencies)[0]?.name || "";
          bValue = Object.values(b.currencies)[0]?.name || "";
          break;
        case "Language":
          aValue = Object.values(a.languages)[0] || "";
          bValue = Object.values(b.languages)[0] || "";
          break;
        case "Population":
          aValue = a.population;
          bValue = b.population;
          break;
        case "Area":
          aValue = a.area;
          bValue = b.area;
          break;
        default:
          aValue = "";
          bValue = "";
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sort.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
    return sorted;
  }, [filteredCountries, sort]);

  useEffect(() => {
    axios
      .get(
        "https://restcountries.com/v3.1/all?fields=name,currencies,languages,population,area,flags"
      )
      .then((response) => {
        console.log("Data fetched:", response.data);
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const minPopInt = minPopulation ? parseInt(minPopulation, 10) : 0;
  const maxPopInt = maxPopulation ? parseInt(maxPopulation, 10) : Infinity;
  const isPopRangeInvalid = maxPopInt < minPopInt;

  return (
    <div className="App">
      <div className="dashboard-header">
        <h1>Countries Table</h1>
        <button
          id="dashboard-button"
          onClick={() => navigate("/dashboard")}
          style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
        >
          Dashboard
        </button>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem", width: "200px" }}
        />
        <span>Population from</span>
        <input
          type="number"
          placeholder="Min population"
          value={minPopulation}
          onChange={(e) => setMinPopulation(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.5rem", width: "140px" }}
          min="0"
        />
        <span>to</span>
        <input
          type="number"
          placeholder="Max population"
          value={maxPopulation}
          onChange={(e) => setMaxPopulation(e.target.value)}
          style={{ padding: "0.5rem", width: "140px" }}
          min="0"
        />
        <button
          onClick={() => {
            setSearch("");
            setMinPopulation("0");
            setMaxPopulation("");
          }}
          style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
        >
          Reset Filters
        </button>

        {isPopRangeInvalid && (
          <div style={{ color: "red", marginTop: "0.5rem" }}>
            Max population must be greater than or equal to min population.
          </div>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleHeaderClick("Name")}>
              Name{" "}
              {sort.key === "Name"
                ? sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleHeaderClick("Currency")}>
              Currency{" "}
              {sort.key === "Currency"
                ? sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleHeaderClick("Language")}>
              Language{" "}
              {sort.key === "Language"
                ? sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleHeaderClick("Population")}>
              Population{" "}
              {sort.key === "Population"
                ? sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => handleHeaderClick("Area")}>
              Area{" "}
              {sort.key === "Area"
                ? sort.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {isPopRangeInvalid ? (
            <tr>
              <td colSpan={6} style={{ color: "red", textAlign: "center" }}>
                Invalid population range. Please correct the values above.
              </td>
            </tr>
          ) : sortedCountries ? (
            sortedCountries.map((country, index) => (
              <tr key={index}>
                <td>{country.name.common}</td>
                <td>
                  {Object.entries(country.currencies)
                    .map(
                      ([code, currency]) =>
                        `${currency.name} (${currency.symbol})`
                    )
                    .join(", ")}
                </td>
                <td>
                  {Object.entries(country.languages)
                    .map(([code, language]) => `${language}`)
                    .join(", ")}
                </td>
                <td>{country.population.toLocaleString()}</td>
                <td>{country.area.toLocaleString()}</td>
                <td>
                  <img
                    src={country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    style={{ width: "50px" }}
                  />
                </td>
              </tr>
            ))
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export default TableOfCountries;
