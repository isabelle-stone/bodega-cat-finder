/**
 * App.jsx
 * -------
 * Main app with routing
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddCat from './pages/AddCat';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddCat />} />
        {/* potentially add routes here:
            <Route path="/cat/:id" element={<CatDetail />} />
            <Route path="/about" element={<About />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;