import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TableOfCountries from './TableOfCountries';
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TableOfCountries />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
