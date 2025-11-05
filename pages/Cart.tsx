import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { ArrowLeftIcon, TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const Cart: React.FC = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();

    if (!context) {
        throw new Error("Cart must be used within an AppProvider");
    }

    const { cart, updateQuantity, removeFromCart } = context;

    const handleQuantityChange = (name: string, currentQuantity: number, change: number) => {
        const newQuantity = currentQuantity + change;
        updateQuantity(name, newQuantity);
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.crystal.price * item.quantity, 0);

    return (
        <div className="bg-brand-dark text-brand-text min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 bg-brand-dark/80 backdrop-blur-sm z-10 p-4 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-brand-surface" aria-label="Go back">
                    <ArrowLeftIcon className="w-6 h-6 text-brand-text" />
                </button>
                <h1 className="text-xl font-bold text-center flex-grow">我的购物车</h1>
                <div className="w-8"></div> {/* Placeholder for alignment */}
            </header>

            {/* Cart Content */}
            <main className="flex-grow p-4 space-y-4">
                {cart.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                        <p className="text-brand-text-muted mb-4">您的购物车是空的</p>
                        <button onClick={() => navigate('/report')} className="bg-brand-primary hover:bg-brand-primary/80 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            去选购
                        </button>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {cart.map(item => (
                            <li key={item.crystal.name} className="bg-brand-surface p-4 rounded-lg flex items-center gap-4 animate-fade-in">
                                <div className="w-16 h-16 bg-slate-700 rounded-md flex items-center justify-center text-3xl flex-shrink-0">
                                    {item.crystal.image}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold">{item.crystal.name}</h3>
                                    <p className="text-sm text-red-500 font-semibold">¥{item.crystal.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleQuantityChange(item.crystal.name, item.quantity, -1)} className="p-1 bg-slate-600 rounded-full hover:bg-slate-500 transition-colors" aria-label="Decrease quantity">
                                        <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-bold" aria-label="Current quantity">{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.crystal.name, item.quantity, 1)} className="p-1 bg-slate-600 rounded-full hover:bg-slate-500 transition-colors" aria-label="Increase quantity">
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <button onClick={() => removeFromCart(item.crystal.name)} className="p-2 text-brand-text-muted hover:text-red-500 transition-colors" aria-label={`Remove ${item.crystal.name}`}>
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            {/* Footer */}
            {cart.length > 0 && (
                <footer className="sticky bottom-0 bg-brand-surface p-4 border-t border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-brand-text-muted">总计</span>
                        <span className="text-2xl font-bold text-red-500">¥{totalAmount.toFixed(2)}</span>
                    </div>
                    <button onClick={() => navigate('/payment')} className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        结算
                    </button>
                </footer>
            )}
        </div>
    );
};

export default Cart;