
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface Props {
  data: {
    similar: number;
    different: number;
  };
}

const ElementBalance: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: '同类', value: data.similar, color: '#4ADE80' },
    { name: '异类', value: data.different, color: '#60A5FA' },
  ];
  const total = data.similar + data.different;

  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2 text-center">五行同类与异类分析</h2>
      <p className="text-sm text-brand-text-muted text-center mb-6">在八字命理中，日主五行与其他五行的关系并非平等，而是分为对您有益的“同类”和对您形成制约的“异类”。理解这种分类是准确判断五行平衡的关键。</p>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        <div className="md:col-span-2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
                 <Label value="日主" position="center" fill="#EAB308" fontSize="24px" fontWeight="bold" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="md:col-span-3 space-y-4">
          <div className="bg-brand-dark/50 p-4 rounded-lg">
            <h3 className="font-bold text-green-400 mb-2">同类 (助力) - {data.similar}%</h3>
            <p className="text-xs text-brand-text-muted">1. 生我者「火」🔥: 火生土，如烈焰煅烧，使土凝聚成形。</p>
            <p className="text-xs text-brand-text-muted">2. 同我者「土」⛰️: 土土相合，如大地厚重，彼此倚靠。</p>
            <p className="text-sm mt-2">这两者能增强日主土的稳定性和承载力，为根基之本。</p>
          </div>
          <div className="bg-brand-dark/50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-400 mb-2">异类 (压力) - {data.different}%</h3>
            <p className="text-xs text-brand-text-muted">1. 我生者「金」⚙️: 土生金，会逐渐削弱自身厚度。</p>
            <p className="text-xs text-brand-text-muted">2. 克我者「木」🌳: 木克土，如树根穿透大地，对土形成冲击。</p>
            <p className="text-xs text-brand-text-muted">3. 我克者「水」💧: 土克水，虽能围堵，但耗力巨大。</p>
            <p className="text-sm mt-2">这些异类会削弱日主土的稳固与支持，减弱土的承载力与稳定性。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElementBalance;
