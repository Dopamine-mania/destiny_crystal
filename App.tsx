import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import BirthInfoInput from './pages/BirthInfoInput';
import AnalysisReport from './pages/AnalysisReport';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import { AppProvider } from './contexts/AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="bg-brand-dark text-brand-text min-h-screen">
        <div className="max-w-lg mx-auto bg-brand-dark shadow-lg">
          <HashRouter>
            <Routes>
              <Route path="/" element={<BirthInfoInput />} />
              <Route path="/report" element={<AnalysisReport />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/confirmation" element={<Confirmation />} />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;