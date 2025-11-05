import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import WuxingDistribution from '../components/WuxingDistribution';
import DayMaster from '../components/DayMaster';
import ElementBalance from '../components/ElementBalance';
import WuxingStrength from '../components/WuxingStrength';
import BalanceScale from '../components/BalanceScale';
import FavorableGods from '../components/FavorableGods';
import CrystalRecommendations from '../components/CrystalRecommendations';
import { ArrowLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';

const AnalysisReport: React.FC = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!context || !context.baziReport) {
    useEffect(() => {
      navigate('/');
    }, [navigate]);
    return <div className="min-h-screen flex items-center justify-center bg-brand-dark text-brand-text">Loading report data...</div>;
  }

  const { baziReport, isPaid, cart } = context;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);


  return (
    <div className="bg-brand-dark text-brand-text min-h-screen">
       <div className="sticky top-0 bg-brand-dark/80 backdrop-blur-sm z-10 p-4 flex items-center">
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-brand-surface">
                <ArrowLeftIcon className="w-6 h-6 text-brand-text" />
            </button>
            <h1 className="text-xl font-bold text-center flex-grow">我的命理报告</h1>
            <div className="w-8 flex justify-end">
                {isPaid && (
                    <button className="p-2 rounded-full hover:bg-brand-surface relative">
                        <ShoppingCartIcon className="w-6 h-6 text-brand-text" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center border-2 border-brand-dark">
                                {cartItemCount > 9 ? '9+' : cartItemCount}
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>

      <div className="p-4 space-y-8">
        <WuxingDistribution data={baziReport.fiveElementsDistribution} />
        <DayMaster data={baziReport.dayMaster} />
        <ElementBalance data={baziReport.elementGroups} />
        <WuxingStrength seasonalData={baziReport.seasonalStrengths} strengthData={baziReport.strengthAnalysis} />
        <BalanceScale data={baziReport.balance} />
        <FavorableGods data={baziReport.favorableGods} isPaid={isPaid} />
        <CrystalRecommendations data={baziReport.favorableGods} isPaid={isPaid} />
        {/* Placeholder for other paid modules */}
      </div>
    </div>
  );
};

export default AnalysisReport;
