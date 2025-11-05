
import React, { useState, useContext, useMemo } from 'react';
import type { BaziReport, Crystal } from '../types';
import { FiveElement } from '../types';
import { ShoppingCartIcon, StarIcon, ChatBubbleBottomCenterTextIcon, CheckIcon } from '@heroicons/react/24/solid';
import { AppContext } from '../contexts/AppContext';

interface Props {
  data: BaziReport['favorableGods'];
  isPaid: boolean;
}

const ELEMENT_ICONS: { [key in FiveElement]: string } = {
    [FiveElement.Wood]: '🌳',
    [FiveElement.Fire]: '🔥',
    [FiveElement.Earth]: '⛰️',
    [FiveElement.Metal]: '⚙️',
    [FiveElement.Water]: '💧',
};

const allCrystals: Crystal[] = [
    { name: '黄水晶手链', element: FiveElement.Earth, description: '黄水晶五行属土，对应太阳轮，是著名的“财富之石”。能增强自信心、稳定情绪、助事业运。', image: '💎', price: 288, originalPrice: 388, reviews: 128, rating: 4.9, specs: '6mm / 16cm' },
    { name: '虎眼石手串', element: FiveElement.Earth, description: '虎眼石对应太阳轮和脐轮，能带来信心、勇气和决断力，帮助突破事业瓶颈。', image: '🐯', price: 188, reviews: 256, rating: 5, specs: '8mm / 17cm' },
    { name: '红玛瑙吊坠', element: FiveElement.Fire, description: '红玛瑙五行属火，对应海底轮，能激发热情与活力，改善人际关系，带来好运气。', image: '🔴', price: 168, reviews: 89, rating: 4.8, specs: '精选A货' },
    { name: '紫水晶', element: FiveElement.Fire, description: '紫水晶五行属火，能激发灵感、提升智慧，并有助于建立和谐的人际关系。', image: '💜', price: 258, reviews: 150, rating: 4.9, specs: '10mm / 16cm' },
    { name: '绿幽灵', element: FiveElement.Wood, description: '绿幽灵五行属木，被称为“正港财神”，能招正财，助事业发展，并有强大的净化磁场能力。', image: '🌿', price: 320, reviews: 95, rating: 5, specs: '8mm / 17cm' },
    { name: '白水晶', element: FiveElement.Metal, description: '白水晶五行属金，是“水晶之王”，能平衡身心能量，净化负能量，提升专注力。', image: '⚪', price: 150, reviews: 310, rating: 4.7, specs: '12mm / 18cm' },
    { name: '黑曜石', element: FiveElement.Water, description: '黑曜石五行属水，具有强大的辟邪化煞能力，能吸收负能量，守护佩戴者。', image: '⚫', price: 175, reviews: 220, rating: 4.8, specs: '10mm / 16cm' },
];

const CrystalCard: React.FC<{ crystal: Crystal }> = ({ crystal }) => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('CrystalCard must be used within an AppProvider');
    }
    const { addToCart } = context;
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        if (added) return;
        addToCart(crystal);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000); // Reset after 2 seconds
    };

    return (
        <div className="bg-brand-dark/50 rounded-lg shadow-lg overflow-hidden border border-slate-700 flex p-4 gap-4">
            <div className={`w-24 h-24 rounded-lg bg-gradient-to-br from-yellow-700 to-yellow-900 flex items-center justify-center text-4xl flex-shrink-0 ${crystal.element === FiveElement.Fire ? 'from-red-700 to-red-900' : ''}`}>
                {crystal.image}
            </div>
            <div className="flex flex-col flex-grow">
                <h4 className="font-bold text-lg text-brand-text">{crystal.name}</h4>
                <p className="text-xs text-brand-text-muted my-1">{ELEMENT_ICONS[crystal.element]} {crystal.element}属性 | {crystal.specs}</p>
                <p className="text-sm text-brand-text-muted my-2 leading-relaxed flex-grow">{crystal.description}</p>
                <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-3 h-3 ${i < Math.round(crystal.rating) ? 'text-yellow-400' : 'text-slate-600'}`} />)}
                    </div>
                    <span>({crystal.reviews}人购买)</span>
                </div>
                <div className="flex items-end justify-between mt-auto pt-2">
                     <div>
                        <span className="text-xl font-bold text-red-500">¥{crystal.price}</span>
                        {crystal.originalPrice && <span className="text-xs text-brand-text-muted line-through ml-2">¥{crystal.originalPrice}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                          onClick={() => alert(`Viewing details for ${crystal.name}`)} 
                          className="text-brand-text-muted text-sm py-1 px-3 rounded-full hover:bg-slate-700 transition-colors border border-slate-600"
                        >
                            详情
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={added}
                            className={`text-sm font-bold py-1 px-3 rounded-full flex items-center gap-1 transition-all duration-300 ${
                                added 
                                ? 'bg-green-600 text-white cursor-default' 
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            {added ? (
                                <CheckIcon className="w-4 h-4"/>
                            ) : (
                                <ShoppingCartIcon className="w-4 h-4"/>
                            )}
                            <span className="w-20 text-center">{added ? '已添加' : '加入购物车'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

type SortType = 'default' | 'price_asc' | 'price_desc' | 'rating' | 'reviews';

const SortButton: React.FC<{ label: string; value: SortType; activeSort: SortType; setSort: (value: SortType) => void; }> = ({ label, value, activeSort, setSort }) => {
    const isActive = activeSort === value;
    return (
        <button
            onClick={() => setSort(value)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                isActive
                    ? 'bg-brand-secondary text-brand-dark'
                    : 'bg-brand-dark/50 text-brand-text-muted hover:bg-slate-700'
            }`}
        >
            {label}
        </button>
    );
};


const CrystalRecommendations: React.FC<Props> = ({ data, isPaid }) => {
  const [sortBy, setSortBy] = useState<SortType>('default');

  const recommendedCrystals = useMemo(() => 
    allCrystals.filter(crystal => data.favorable.includes(crystal.element)),
    [data.favorable]
  );

  const sortedCrystals = useMemo(() => {
    const crystals = [...recommendedCrystals];
    switch (sortBy) {
        case 'price_asc':
            crystals.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            crystals.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            crystals.sort((a, b) => b.rating - a.rating);
            break;
        case 'reviews':
            crystals.sort((a, b) => b.reviews - a.reviews);
            break;
        default:
            // Default case, no sorting needed.
            break;
    }
    return crystals;
  }, [sortBy, recommendedCrystals]);

  if (!isPaid) {
    return null; // Don't render anything if the user hasn't paid
  }


  return (
    <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2 text-center">专属补运水晶</h2>
      <p className="text-sm text-brand-text-muted text-center mb-4 flex items-center justify-center gap-2">
        <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-brand-secondary"/>
        根据您的喜用神「<span className="font-bold text-brand-secondary">{data.favorable.join(' ')}</span>」，为您精选以下水晶
      </p>

      <div className="flex flex-wrap gap-2 mb-6 justify-center border-t border-b border-slate-700 py-3">
        <SortButton label="推荐" value="default" activeSort={sortBy} setSort={setSortBy} />
        <SortButton label="价格 ↑" value="price_asc" activeSort={sortBy} setSort={setSortBy} />
        <SortButton label="价格 ↓" value="price_desc" activeSort={sortBy} setSort={setSortBy} />
        <SortButton label="评价" value="rating" activeSort={sortBy} setSort={setSortBy} />
        <SortButton label="销量" value="reviews" activeSort={sortBy} setSort={setSortBy} />
      </div>

      <div className="space-y-4">
        {sortedCrystals.map(crystal => (
          <CrystalCard key={crystal.name} crystal={crystal} />
        ))}
      </div>

       <button className="w-full text-center mt-6 text-sm text-brand-text-muted hover:text-brand-text transition-colors">
          ↓ 查看更多水晶
       </button>
    </div>
  );
};

export default CrystalRecommendations;
