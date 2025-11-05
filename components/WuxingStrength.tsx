
import React from 'react';
import type { BaziReport } from '../types';
import { FiveElement } from '../types';

interface Props {
  seasonalData: BaziReport['seasonalStrengths'];
  strengthData: BaziReport['strengthAnalysis'];
}

const stateColors: { [key: string]: string } = {
    '旺': 'bg-red-500',
    '相': 'bg-green-500',
    '休': 'bg-gray-500',
    '囚': 'bg-yellow-700',
    '死': 'bg-slate-800',
};

const ELEMENT_ICONS: { [key in FiveElement]: string } = {
    [FiveElement.Wood]: '🌳',
    [FiveElement.Fire]: '🔥',
    [FiveElement.Earth]: '⛰️',
    [FiveElement.Metal]: '⚙️',
    [FiveElement.Water]: '💧',
};

const WuxingStrength: React.FC<Props> = ({ seasonalData, strengthData }) => {
  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2 text-center">五行旺衰判断</h2>
      <p className="text-sm text-brand-text-muted text-center mb-6">四季轮转，万物生长收藏，五行随之兴衰变化。自然界中这种看似简单的规律，实则蕴含着生命能量流转的深刻密码。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-brand-dark/50 p-4 rounded-lg">
            <h3 className="font-bold">同类力量分析</h3>
            <p className="text-sm text-brand-text-muted mt-2">同类五行力量占比较大，代表您内在的自我、自信和来自同伴的支持，使您在困难面前有较强的韧性和坚持。</p>
        </div>
        <div className="bg-brand-dark/50 p-4 rounded-lg">
            <h3 className="font-bold">异类力量分析</h3>
            <p className="text-sm text-brand-text-muted mt-2">异类五行力量占比较小，代表外部环境的机遇、挑战、财富和事业，您需要更加努力去争取和把握。</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <h3 className="font-bold text-yellow-400">旺衰判断结论</h3>
            <p className="text-sm text-brand-text mt-2">{strengthData.conclusion}</p>
        </div>
        <div className="bg-green-400/10 border-l-4 border-green-400 p-4 rounded-r-lg">
            <h3 className="font-bold text-green-400">人生指导意义</h3>
            <p className="text-sm text-brand-text mt-2">{strengthData.guidance}</p>
        </div>
      </div>
      
      <div className="bg-brand-dark/50 p-4 rounded-lg">
         <h3 className="font-bold text-center mb-4">月令处于冬，五行旺衰状态</h3>
         <div className="flex justify-center space-x-2 mb-6">
            {seasonalData.map(item => (
                <div key={item.element} className={`px-3 py-1 text-sm rounded-full flex items-center ${stateColors[item.state]}`}>
                    <span>{item.element}:{item.state}</span>
                </div>
            ))}
         </div>
         <div className="space-y-3">
             {seasonalData.map(item => (
                <div key={item.element} className="flex items-center space-x-4 p-2 rounded-md bg-slate-800/50">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center text-2xl ${stateColors[item.state]}`}>
                        {ELEMENT_ICONS[item.element]}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">{item.element}</span>
                             <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stateColors[item.state]}`}>{item.state}</span>
                        </div>
                        <p className="text-xs text-brand-text-muted">{item.description}</p>
                    </div>
                </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default WuxingStrength;
