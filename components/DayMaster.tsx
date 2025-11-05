
import React from 'react';
import type { BaziReport } from '../types';

interface Props {
  data: BaziReport['dayMaster'];
}

const DayMaster: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2 text-center">日主分析</h2>
      <p className="text-sm text-brand-text-muted text-center mb-6">日主，即您出生之日的天干（{data.name}），是整个八字命盘的核心，代表着最本质的“我”。洞悉日主的特质，是开启命运解读的第一把钥匙。</p>
      
      <div className="flex flex-col md:flex-row items-center gap-6 bg-brand-dark/50 p-6 rounded-lg">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-yellow-900/50 border-4 border-yellow-600 flex flex-col items-center justify-center shadow-lg">
             <div className="text-4xl font-serif text-yellow-300">{data.name.charAt(0)}</div>
             <div className="text-sm text-yellow-400">{data.name.charAt(1)}</div>
          </div>
        </div>
        <div className="text-left">
          <h3 className="font-bold text-lg mb-2">您的日主：{data.name}</h3>
          <p className="text-sm text-brand-text-muted leading-relaxed">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default DayMaster;
