import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { ArrowLeftIcon, CreditCardIcon, LockClosedIcon, UserIcon, CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const Payment: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    if (!context) {
        throw new Error("Payment page must be used within an AppProvider");
    }

    const { cart, clearCart } = context;
    const totalAmount = cart.reduce((sum, item) => sum + item.crystal.price * item.quantity, 0);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!cardholderName) newErrors.cardholderName = "Cardholder name is required.";
        if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardNumber)) newErrors.cardNumber = "Invalid card number format.";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) newErrors.expiryDate = "Invalid expiry date format (MM/YY).";
        if (!/^\d{3,4}$/.test(cvv)) newErrors.cvv = "Invalid CVV.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ').substr(0, 19) || '';
        setCardNumber(formatted);
    }
    
    const formatExpiryDate = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length > 2) {
            formatted = `${cleaned.substr(0, 2)}/${cleaned.substr(2, 2)}`;
        }
        setExpiryDate(formatted.substr(0, 5));
    }

    const handlePayment = async () => {
        if (!validateForm()) return;
        
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        clearCart();
        navigate('/confirmation', { state: { totalAmount, orderNumber: `DW${Date.now()}` } });
        setIsLoading(false);
    };

    if (cart.length === 0 && !isLoading) {
        // Redirect if cart is empty, might happen on page refresh
        setTimeout(() => navigate('/cart'), 0);
        return null;
    }

    return (
        <div className="bg-brand-dark text-brand-text min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 bg-brand-dark/80 backdrop-blur-sm z-10 p-4 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-brand-surface" aria-label="Go back">
                    <ArrowLeftIcon className="w-6 h-6 text-brand-text" />
                </button>
                <h1 className="text-xl font-bold text-center flex-grow">Secure Checkout</h1>
                <div className="w-8"></div> {/* Placeholder for alignment */}
            </header>
            
            <main className="flex-grow p-4 space-y-6">
                <div className="bg-brand-surface p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-brand-text-muted">Order Total</span>
                        <span className="text-2xl font-bold text-red-500">¥{totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-brand-surface p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-lg font-semibold text-center mb-2">Payment Details</h2>
                    {/* Cardholder Name */}
                    <div>
                        <label htmlFor="cardholderName" className="text-sm font-medium text-brand-text-muted">Cardholder Name</label>
                        <div className="relative mt-1">
                            <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                            <input id="cardholderName" type="text" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} placeholder="JOHN DOE" className="w-full bg-brand-dark border border-slate-600 rounded-md py-2 pl-10 pr-3 focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                         {errors.cardholderName && <p className="text-xs text-red-500 mt-1">{errors.cardholderName}</p>}
                    </div>

                    {/* Card Number */}
                    <div>
                        <label htmlFor="cardNumber" className="text-sm font-medium text-brand-text-muted">Card Number</label>
                        <div className="relative mt-1">
                            <CreditCardIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                            <input id="cardNumber" type="text" value={cardNumber} onChange={(e) => formatCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="w-full bg-brand-dark border border-slate-600 rounded-md py-2 pl-10 pr-3 focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         {/* Expiry Date */}
                        <div>
                            <label htmlFor="expiryDate" className="text-sm font-medium text-brand-text-muted">Expiry Date</label>
                            <div className="relative mt-1">
                                <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                                <input id="expiryDate" type="text" value={expiryDate} onChange={(e) => formatExpiryDate(e.target.value)} placeholder="MM/YY" className="w-full bg-brand-dark border border-slate-600 rounded-md py-2 pl-10 pr-3 focus:ring-brand-primary focus:border-brand-primary" />
                            </div>
                            {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
                        </div>
                         {/* CVV */}
                        <div>
                            <label htmlFor="cvv" className="text-sm font-medium text-brand-text-muted">CVV / CVC</label>
                            <div className="relative mt-1">
                                <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
                                <input id="cvv" type="password" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 4))} placeholder="•••" maxLength={4} className="w-full bg-brand-dark border border-slate-600 rounded-md py-2 pl-10 pr-3 focus:ring-brand-primary focus:border-brand-primary" />
                            </div>
                            {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="sticky bottom-0 bg-brand-surface p-4 border-t border-slate-700">
                <button 
                    onClick={handlePayment} 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <ArrowPathIcon className="w-6 h-6 animate-spin mr-2" />
                    ) : (
                        <LockClosedIcon className="w-5 h-5 mr-2" />
                    )}
                    <span>{isLoading ? 'Processing Payment...' : `Pay ¥${totalAmount.toFixed(2)}`}</span>
                </button>
            </footer>
        </div>
    );
};

export default Payment;