import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutFlow from './pages/LayoutFlow';
import HomePage from './pages/HomePage'; 
import NavBar from './components/NavBar'; 

function App() {
  return (
    <Router>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar />  
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tree/:id" element={<LayoutFlow />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

