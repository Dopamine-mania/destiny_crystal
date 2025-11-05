
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { generateBaziReport } from '../services/geminiService';
import { CalendarIcon, UserIcon, MapPinIcon, SparklesIcon, SunIcon, MoonIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const BirthInfoInput: React.FC = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [year, setYear] = useState('2000');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [hour, setHour] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const context = useContext(AppContext);
  
  if (!context) throw new Error("AppContext not found");
  const { setUserInfo, setBaziReport } = context;

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (name.length >= 2 && name.length <= 4 && gender && year && month && day && hour) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, gender, year, month, day, hour]);


  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour));
    const userInfo = {
      name,
      gender: gender!,
      birthDate,
      birthLocation: '北京', // Mocked value
      useSolarTime: false, // Mocked value
    };
    
    setUserInfo(userInfo);
    try {
        const report = await generateBaziReport(userInfo);
        setBaziReport(report);
        navigate('/report');
    } catch (error) {
        console.error("Failed to generate report:", error);
        // Handle error state in UI
    } finally {
        setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 126 }, (_, i) => (currentYear - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const hours = Array.from({ length: 12 }, (_, i) => i * 2).map(h => `${h}:00-${h+1}:59`);
  const hourValues = Array.from({ length: 12 }, (_, i) => (i*2).toString());


  return (
    <div className="min-h-screen bg-brand-dark p-6 space-y-6 text-brand-text">
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-brand-secondary" />
            <span>出生信息</span>
        </h1>
        <p className="text-brand-text-muted mt-2">请准确填写您的出生年月日时，这将影响分析的准确性</p>
      </div>

      <div className="bg-brand-surface p-6 rounded-lg shadow-lg space-y-6">
        <div>
          <label className="text-sm font-medium text-brand-text-muted">您的姓名</label>
          <div className="relative mt-1">
            <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-muted" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入2-4个字的姓名"
              className="w-full bg-brand-dark border border-slate-600 rounded-md py-2 pl-10 pr-3 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>

        <div>
            <label className="text-sm font-medium text-brand-text-muted">您的性别</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <button onClick={() => setGender('male')} className={`flex items-center justify-center p-3 rounded-md border-2 transition-all ${gender === 'male' ? 'border-brand-primary bg-brand-primary/20' : 'border-slate-600'}`}>
                    <span className="text-2xl mr-2">👨</span> 男性
                </button>
                <button onClick={() => setGender('female')} className={`flex items-center justify-center p-3 rounded-md border-2 transition-all ${gender === 'female' ? 'border-brand-primary bg-brand-primary/20' : 'border-slate-600'}`}>
                    <span className="text-2xl mr-2">👩</span> 女性
                </button>
            </div>
        </div>

        <div>
            <label className="text-sm font-medium text-brand-text-muted">出生日期 (阳历)</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
                <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-brand-dark border border-slate-600 rounded-md py-2 px-3 focus:ring-brand-primary focus:border-brand-primary">
                    {years.map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
                 <select value={month} onChange={e => setMonth(e.target.value)} className="w-full bg-brand-dark border border-slate-600 rounded-md py-2 px-3 focus:ring-brand-primary focus:border-brand-primary">
                    {months.map(m => <option key={m} value={m}>{m}月</option>)}
                </select>
                 <select value={day} onChange={e => setDay(e.target.value)} className="w-full bg-brand-dark border border-slate-600 rounded-md py-2 px-3 focus:ring-brand-primary focus:border-brand-primary">
                    {days.map(d => <option key={d} value={d}>{d}日</option>)}
                </select>
            </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-brand-text-muted">出生时间</label>
          <select value={hour} onChange={e => setHour(e.target.value)} className="w-full mt-1 bg-brand-dark border border-slate-600 rounded-md py-2 px-3 focus:ring-brand-primary focus:border-brand-primary">
            {hourValues.map((h, i) => <option key={h} value={h}>{['早子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'][i]} {hours[i]}</option>)}
          </select>
        </div>
      </div>
      
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || isLoading}
        className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? (
            <ArrowPathIcon className="w-6 h-6 animate-spin mr-2" />
        ) : (
            <SparklesIcon className="w-6 h-6 mr-2" />
        )}
        <span>{isLoading ? '正在生成报告...' : '立即生成我的命理报告'}</span>
      </button>
    </div>
  );
};

export default BirthInfoInput;
