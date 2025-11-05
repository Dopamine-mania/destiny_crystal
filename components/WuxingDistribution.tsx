
import React from 'react';
import type { FiveElementDistribution } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FiveElement } from '../types';

interface Props {
  data: FiveElementDistribution[];
}

const COLORS: { [key in FiveElement]: string } = {
  [FiveElement.Wood]: '#22C55E', // green
  [FiveElement.Fire]: '#EF4444', // red
  [FiveElement.Earth]: '#EAB308', // yellow
  [FiveElement.Metal]: '#A1A1AA', // gray
  [FiveElement.Water]: '#3B82F6', // blue
};

const ELEMENT_ICONS: { [key in FiveElement]: string } = {
    [FiveElement.Wood]: '🌳',
    [FiveElement.Fire]: '🔥',
    [FiveElement.Earth]: '⛰️',
    [FiveElement.Metal]: '⚙️',
    [FiveElement.Water]: '💧',
};


const WuxingDistribution: React.FC<Props> = ({ data }) => {
  const chartData = data.map(item => ({ name: item.element, value: item.percentage }));

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">五行力量分布</h2>
      <p className="text-sm text-brand-text-muted text-center mb-6">您的命盘中，天干、地支及藏干所含的五行元素力量分布如下，这揭示了您与生俱来的能量构成。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-brand-text-muted uppercase bg-brand-dark/50">
                    <tr>
                        <th scope="col" className="px-4 py-2">五行</th>
                        <th scope="col" className="px-4 py-2">显露个数</th>
                        <th scope="col" className="px-4 py-2">藏干个数</th>
                        <th scope="col" className="px-4 py-2">总体占比</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.element} className="border-b border-slate-700">
                            <th scope="row" className="px-4 py-2 font-medium whitespace-nowrap flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[item.element] }}></span>
                                {item.element}
                            </th>
                            <td className="px-4 py-2">{item.exposed}</td>
                            <td className="px-4 py-2">{item.hidden}</td>
                            <td className="px-4 py-2 font-bold">{item.percentage}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="h-48 md:h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as FiveElement]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155' }}
                labelStyle={{ color: '#E2E8F0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
       <div className="mt-6 bg-brand-dark/50 p-4 rounded-lg text-center text-sm">
         <p>从总体上看，您命盘中<span className="font-bold text-blue-400">水</span>的力量最为强势，而<span className="font-bold text-yellow-400">土</span>和<span className="font-bold text-red-400">火</span>的力量相对不足，整体呈现出水旺土囚的分布特点。</p>
      </div>
    </div>
  );
};

export default WuxingDistribution;
