import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const Confirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Safely access state
    const { totalAmount, orderNumber } = location.state || { totalAmount: 0, orderNumber: 'N/A' };
    
    // Redirect if state is missing
    if (!location.state) {
        setTimeout(() => navigate('/'), 0);
        return null;
    }

    return (
        <div className="bg-brand-dark text-brand-text min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <CheckCircleIcon className="w-24 h-24 text-green-500 mb-6 animate-[pulse_2s_ease-in-out_infinite]" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-brand-text-muted mb-8">Thank you for your purchase. Your journey to balance and harmony continues.</p>
            
            <div className="bg-brand-surface w-full max-w-sm p-6 rounded-lg shadow-lg space-y-4 mb-8">
                <div className="flex justify-between">
                    <span className="text-brand-text-muted">Order Number:</span>
                    <span className="font-mono">{orderNumber}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-700 pt-4 mt-4">
                    <span className="text-brand-text-muted">Amount Paid:</span>
                    <span className="text-xl font-bold text-red-500">¥{Number(totalAmount).toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={() => navigate('/report')}
                className="w-full max-w-sm bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
                Continue Your Journey
            </button>
        </div>
    );
};

export default Confirmation;