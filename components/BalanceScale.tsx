
import React, { useState, useEffect } from 'react';
import type { BaziReport } from '../types';

interface Props {
  data: BaziReport['balance'];
}

const BalanceScale: React.FC<Props> = ({ data }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const totalWeight = data.similarWeight + data.differentWeight;
    if (totalWeight === 0) {
      setRotation(0);
      return;
    }
    const diff = data.similarWeight - data.differentWeight;
    // Max rotation is arbitrary, e.g., 10 degrees. Scale it.
    const maxRotation = 10;
    const calculatedRotation = (diff / totalWeight) * maxRotation * 2;
    
    const timeoutId = setTimeout(() => {
      setRotation(calculatedRotation);
    }, 500); // Delay animation start

    return () => clearTimeout(timeoutId);
  }, [data]);

  const interpretation = rotation > 0 ? "当天平向左倾斜时，表示同类力量更强，日主偏旺；" : rotation < 0 ? "当天平向右倾斜时，表示异类力量更强，日主偏弱；" : "";

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2 text-center">五行平衡状态分析</h2>
      <p className="text-sm text-brand-text-muted text-center mb-6">五行力量分为两派：生扶您的“同类”和克泄您的“异类”。这两派力量的博弈，构成了您命运的动态平衡。天平的倾斜揭示了您是需要补充力量，还是需要释放压力。</p>

      <div className="relative h-64 w-full flex flex-col items-center justify-end">
        {/* Beam */}
        <div className="absolute top-1/2 left-1/2 w-[300px] h-2 bg-slate-500 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-[1500ms] ease-out" style={{ transform: `translateX(-50%) translateY(-50%) rotate(${rotation}deg)` }}>
          {/* Left Pan */}
          <div className="absolute -left-4 -top-12 flex flex-col items-center">
              <div className="h-12 w-px bg-slate-400"></div>
              <div className="w-20 h-5 bg-gradient-to-t from-slate-600 to-slate-500 rounded-b-full shadow-inner"></div>
              <div className="absolute top-14 text-center">
                  <span className="font-bold text-lg text-green-400">{data.similarWeight}g</span>
                  <p className="text-xs text-green-400">同类元素</p>
              </div>
          </div>
          {/* Right Pan */}
          <div className="absolute -right-4 -top-12 flex flex-col items-center">
              <div className="h-12 w-px bg-slate-400"></div>
              <div className="w-20 h-5 bg-gradient-to-t from-slate-600 to-slate-500 rounded-b-full shadow-inner"></div>
              <div className="absolute top-14 text-center">
                  <span className="font-bold text-lg text-blue-400">{data.differentWeight}g</span>
                  <p className="text-xs text-blue-400">异类元素</p>
              </div>
          </div>
        </div>
        {/* Stand */}
        <div className="w-2 h-16 bg-slate-600"></div>
        <div className="w-20 h-4 bg-slate-700 rounded-t-md"></div>
      </div>
      <p className="text-xs text-brand-text-muted text-center mt-2">注：图中将五行元素百分比转换为克重单位(1%=1g)以直观展示平衡状态</p>

      <div className="mt-6 bg-brand-dark/50 p-4 rounded-lg text-sm">
        <p><span className="font-bold text-yellow-400">天平解读：</span> {interpretation} 天平越平衡，五行力量越协调。</p>
        <p><span className="font-bold text-yellow-400">砝码含义：</span> 每个彩色砝码代表一种五行元素，砝码上的数字表示该元素在您命盘中的占比重量。</p>
      </div>
    </div>
  );
};

export default BalanceScale;
