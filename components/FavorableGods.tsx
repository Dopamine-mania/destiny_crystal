import React, { useState, useContext } from 'react';
import type { BaziReport } from '../types';
import { AppContext } from '../contexts/AppContext';
import { LockClosedIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/solid';

interface Props {
  data: BaziReport['favorableGods'];
  isPaid: boolean;
}

const FavorableGods: React.FC<Props> = ({ data, isPaid }) => {
    const [showModal, setShowModal] = useState(false);
    const context = useContext(AppContext);

    if (!context) throw new Error("AppContext not found");
    const { setIsPaid } = context;

    const handleUnlock = () => {
        // In a real app, this would trigger a payment flow.
        // We simulate success here.
        setIsPaid(true);
        setShowModal(false);
    };

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg relative">
      <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        <SparklesIcon className="w-6 h-6 text-brand-secondary"/>
        您的喜用神
      </h2>
      
      {!isPaid && (
        <div className="absolute inset-0 bg-brand-surface/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg p-4 text-center">
            <LockClosedIcon className="w-12 h-12 text-brand-text-muted mb-4"/>
            <h3 className="text-lg font-bold">解锁AI深度分析</h3>
            <p className="text-brand-text-muted mb-2">查看您的喜用神，获得专属开运建议</p>
            <p className="text-xs text-yellow-400 mb-6">解锁后还将为您推荐专属开运水晶</p>
            <button onClick={() => setShowModal(true)} className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 animate-shake">
                <SparklesIcon className="w-5 h-5 mr-2" />
                立即解锁
            </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-500/20 border-2 border-red-500 p-4 rounded-lg text-center shadow-lg">
            <p className="text-sm text-red-300">喜用神</p>
            <p className="text-4xl font-bold my-2">{data.favorable.join('')}</p>
        </div>
        <div className="bg-blue-500/20 border-2 border-blue-500 p-4 rounded-lg text-center shadow-lg">
            <p className="text-sm text-blue-300">忌神</p>
            <p className="text-4xl font-bold my-2">{data.unfavorable.join('')}</p>
        </div>
      </div>
      
      {showModal && <PaymentModal onUnlock={handleUnlock} onClose={() => setShowModal(false)} />}
    </div>
  );
};


const PaymentModal: React.FC<{onUnlock: () => void, onClose: () => void}> = ({ onUnlock, onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState('full');

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-sm p-6 text-brand-text relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-brand-text-muted hover:text-brand-text">&times;</button>
                <h3 className="text-lg font-bold text-center mb-4">解锁AI深度分析</h3>
                <p className="text-sm text-center text-brand-text-muted mb-6">选择您的解锁方案：</p>

                <div className="space-y-3">
                    <div onClick={() => setSelectedPlan('single')} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPlan === 'single' ? 'border-brand-primary bg-brand-primary/10' : 'border-slate-600'}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold">单模块解锁</h4>
                                <p className="text-xs text-brand-text-muted">解锁 当前运势深度分析</p>
                            </div>
                            <p className="font-bold text-lg text-brand-secondary">¥9.9</p>
                        </div>
                         <p className="text-right text-xs text-brand-text-muted mt-1">7天有效</p>
                    </div>
                     <div onClick={() => setSelectedPlan('full')} className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPlan === 'full' ? 'border-yellow-500 bg-yellow-500/10 animate-glow' : 'border-slate-600'}`}>
                        <span className="absolute -top-3 right-3 bg-yellow-500 text-brand-dark text-xs font-bold px-2 py-0.5 rounded-full">推荐</span>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold">全模块解锁</h4>
                                <p className="text-xs text-brand-text-muted">解锁所有AI分析</p>
                            </div>
                            <p className="font-bold text-lg text-brand-secondary">¥29.9</p>
                        </div>
                         <p className="text-right text-xs text-brand-text-muted mt-1">30天有效</p>
                    </div>
                     <div onClick={() => setSelectedPlan('yearly')} className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPlan === 'yearly' ? 'border-brand-primary bg-brand-primary/10' : 'border-slate-600'}`}>
                        <span className="absolute -top-3 right-3 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">VIP</span>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold">年度会员</h4>
                                <p className="text-xs text-brand-text-muted">全功能 + 优先更新</p>
                            </div>
                            <p className="font-bold text-lg text-brand-secondary">¥99.9</p>
                        </div>
                         <p className="text-right text-xs text-brand-text-muted mt-1">365天有效</p>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 font-bold py-2 px-4 rounded-lg transition-colors">取消</button>
                    <button onClick={onUnlock} className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-2 px-4 rounded-lg">立即解锁</button>
                </div>

            </div>
        </div>
    );
};

export default FavorableGods;
