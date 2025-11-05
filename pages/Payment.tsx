import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { ArrowLeftIcon, LockClosedIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

type PaymentMethod = 'alipay' | 'wechat';

// A simple QR Code Modal component defined within the Payment page
const QRCodeModal: React.FC<{
    paymentMethod: PaymentMethod;
    totalAmount: number;
    onClose: () => void;
    onPaymentSuccess: () => void;
}> = ({ paymentMethod, totalAmount, onClose, onPaymentSuccess }) => {
    
    useEffect(() => {
        // Simulate payment success after 3 seconds
        const timer = setTimeout(() => {
            onPaymentSuccess();
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [onPaymentSuccess]);

    const details = {
        alipay: { name: '支付宝', color: 'text-blue-500', icon: '支付宝' },
        wechat: { name: '微信支付', color: 'text-green-500', icon: '微信' },
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-sm p-6 text-brand-text relative flex flex-col items-center">
                 <button onClick={onClose} className="absolute top-3 right-3 text-brand-text-muted hover:text-brand-text text-2xl" aria-label="关闭">&times;</button>
                 <h3 className={`text-lg font-bold text-center mb-4 ${details[paymentMethod].color}`}>
                    请使用{details[paymentMethod].name}扫码支付
                 </h3>
                 <div className="bg-white p-2 rounded-lg">
                    {/* Placeholder for QR Code */}
                    <svg className="w-48 h-48" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path fill="#000" d="M140 140h-24v-24h24v24Zm-52-52H64V64h24v24Zm-4 56h24v-24H84v24Zm-4-28H56v-24h24v24Zm76 28h24v-24h-24v24Zm56-56h-24V84h24v24Zm-28-4h24V60h-24v24Zm-52 80h24v-24h-24v24Zm-28-4h24v-24h-24v24Zm-28 4h24v-24H84v24Zm112-112h24V60h-24v24Zm-56 0h24V84h-24v24Zm56 28h24v-24h-24v24ZM60 60V36h24v24H60Zm28 0V36h24v24H88Zm80 24V60h24v24h-24ZM60 144V-8h24v24H60v128Zm108-24h24v-24h-24v24ZM60 196v-24h24v24H60Zm28 0v-24h24v24H88Zm28 28v-24h24v24h-24Zm56-28v-24h24v24h-24Z M36 220V36H12v184h24Zm160 0V36h-24v184h24Z M36 36V12h24v24H36Zm160 0V12h24v24h-24Z"/></svg>
                 </div>
                 <p className="font-bold text-2xl mt-4">¥{totalAmount.toFixed(2)}</p>
                 <div className="flex items-center gap-2 mt-4 text-sm text-brand-text-muted">
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>正在等待支付结果...</span>
                 </div>
            </div>
        </div>
    );
};

const Payment: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('alipay');
    const [showQRModal, setShowQRModal] = useState(false);

    if (!context) {
        throw new Error("Payment page must be used within an AppProvider");
    }

    const { cart, clearCart } = context;
    const totalAmount = cart.reduce((sum, item) => sum + item.crystal.price * item.quantity, 0);

    const handlePayment = () => {
        setShowQRModal(true);
    };
    
    const handlePaymentSuccess = () => {
        setShowQRModal(false);
        clearCart();
        navigate('/confirmation', { state: { totalAmount, orderNumber: `DW${Date.now()}` } });
    };

    if (cart.length === 0 && !showQRModal) {
        // Redirect if cart is empty, might happen on page refresh
        setTimeout(() => navigate('/cart'), 0);
        return null;
    }

    return (
        <div className="bg-brand-dark text-brand-text min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 bg-brand-dark/80 backdrop-blur-sm z-10 p-4 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-brand-surface" aria-label="返回">
                    <ArrowLeftIcon className="w-6 h-6 text-brand-text" />
                </button>
                <h1 className="text-xl font-bold text-center flex-grow">安全支付</h1>
                <div className="w-8"></div> {/* Placeholder for alignment */}
            </header>
            
            <main className="flex-grow p-4 space-y-6">
                <div className="bg-brand-surface p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-brand-text-muted">订单总额</span>
                        <span className="text-2xl font-bold text-red-500">¥{totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="bg-brand-surface p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-lg font-semibold mb-2">选择支付方式</h2>
                    
                    {/* Alipay Option */}
                    <div onClick={() => setPaymentMethod('alipay')} className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600'}`}>
                        <div className="flex items-center gap-4">
                             <span className="text-3xl">支</span>
                             <span className="font-semibold">支付宝</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'alipay' ? 'bg-blue-500 border-blue-400' : 'border-slate-500'}`}></div>
                    </div>
                    
                    {/* WeChat Pay Option */}
                    <div onClick={() => setPaymentMethod('wechat')} className={`p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-500/10' : 'border-slate-600'}`}>
                        <div className="flex items-center gap-4">
                             <span className="text-3xl">信</span>
                             <span className="font-semibold">微信支付</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'wechat' ? 'bg-green-500 border-green-400' : 'border-slate-500'}`}></div>
                    </div>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="sticky bottom-0 bg-brand-surface p-4 border-t border-slate-700">
                <button 
                    onClick={handlePayment} 
                    disabled={!paymentMethod}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    <LockClosedIcon className="w-5 h-5 mr-2" />
                    <span>确认支付 ¥{totalAmount.toFixed(2)}</span>
                </button>
            </footer>
            
            {showQRModal && (
                <QRCodeModal 
                    paymentMethod={paymentMethod}
                    totalAmount={totalAmount}
                    onClose={() => setShowQRModal(false)}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default Payment;