
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RoadDataPage from './RoadDataPage';
import Predictions from './Predictions';
import AboutUsPage from './AboutUs';
import Penalty from './Penalty';
import LocationDetailPage from './Analitic'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/road-data" element={<RoadDataPage />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/penalty" element={<Penalty />} />
        <Route path="/analitic" element={<LocationDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
