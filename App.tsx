
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BirthInfoInput from './pages/BirthInfoInput';
import AnalysisReport from './pages/AnalysisReport';
import { AppContext, AppProvider } from './contexts/AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="bg-brand-dark text-brand-text min-h-screen">
        <div className="max-w-lg mx-auto bg-brand-dark shadow-lg">
          <HashRouter>
            <Routes>
              <Route path="/" element={<BirthInfoInput />} />
              <Route path="/report" element={<AnalysisReport />} />
              {/* Add other routes for e-commerce flow here if needed */}
            </Routes>
          </HashRouter>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
