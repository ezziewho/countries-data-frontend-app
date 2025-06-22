# Candidate name and e-mail

Name: Elżbieta Wilczek
E-mail: elzbietawilczek00@gmail.com

# Country Dashboard React App

This project is a modern, responsive React application for displaying and analyzing country data. It features a sortable and filterable table, a dashboard with summary statistics, and interactive charts.

## Features

- Sortable and filterable table of countries
- Search and filter by population range
- Dashboard with summary statistics (top languages, currencies, averages)
- Bar chart for top 20 countries by population or area
- Responsive, clean UI

## Prerequisites

- Node.js (v16 or higher recommended)
- npm (comes with Node.js)

## Getting Started

1. **Clone the repository** (if you haven't already):

   ```sh
   git clone <your-repo-url>
   cd react_project_recruttion/my-app
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Start the development server:**

   ```sh
   npm start
   ```

   This will open the app in your browser at [http://localhost:3000](http://localhost:3000).

4. **Build for production:**
   ```sh
   npm run build
   ```
   The optimized build will be in the `build/` folder.

## Project Structure

- `src/`
  - `App.tsx` - Main app and routing
  - `TableOfCountries.tsx` - Table view
  - `Dashboard.tsx` - Dashboard view
  - `tableOfCountries.css` - Table styles
  - `dashboard.css` - Dashboard styles

## Notes

- The app fetches live data from the [REST Countries API](https://restcountries.com/).
- For any issues, ensure your Node.js and npm are up to date.

---

Enjoy exploring country data!
