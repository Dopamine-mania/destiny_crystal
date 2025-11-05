
import type { UserInfo, BaziReport } from '../types';
import { FiveElement } from '../types';

// This is a mock service. In a real application, you would import and use @google/genai.
// import { GoogleGenAI, Type } from '@google/genai';

export const generateBaziReport = async (userInfo: UserInfo): Promise<BaziReport> => {
  console.log("Generating Bazi report for:", userInfo);

  // Simulate API call to Gemini
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mocked response based on the PRD designs
  const mockReport: BaziReport = {
    dayMaster: {
      element: FiveElement.Earth,
      name: '戊土',
      description: '您的日主为戊土, 土的本质属性为稳重、踏实, 代表自然界的大地。您固执己见, 极富影响力, 会将他人思想同化, 外柔内刚, 沉着具雅量, 易沉溺于情欲中。善于照顾别人, 心肠慈悲, 适应力强且逆来顺受, 默默耕耘却经常不受赏识, 不会攀亲带故。怀才不遇, 重诚信, 僧恨不守信用之人, 墨守成规且较收敛, 外表沉静内心急躁, 如高山之土不易被挖掘, 其实内在丰富。喜欢旧事物, 不喜搬迁, 承诺后会守信实践到底, 不拖拉。可能会有胃、肋骨的疾病。',
    },
    fiveElementsDistribution: [
      { element: FiveElement.Wood, exposed: 1, hidden: 1, percentage: 11 },
      { element: FiveElement.Fire, exposed: 2, hidden: 2, percentage: 22 },
      { element: FiveElement.Earth, exposed: 2, hidden: 3, percentage: 33 },
      { element: FiveElement.Metal, exposed: 0, hidden: 0, percentage: 0 },
      { element: FiveElement.Water, exposed: 3, hidden: 3, percentage: 34 },
    ],
    elementGroups: {
      similar: 55, // Fire + Earth
      different: 45, // Wood + Metal + Water
    },
    seasonalStrengths: [
        { element: FiveElement.Water, state: '旺', description: '气最盛, 寒冷主宰, 水凝结成冰' },
        { element: FiveElement.Wood, state: '相', description: '水生木, 植物根部积蓄养分准备春季生长' },
        { element: FiveElement.Metal, state: '休', description: '秋季肃杀后归于平静' },
        { element: FiveElement.Earth, state: '囚', description: '寒冰封土, 大地坚硬' },
        { element: FiveElement.Fire, state: '死', description: '严寒之下, 热能难以存续, 火气式微至极点' },
    ],
    strengthAnalysis: {
        similarStrength: 55,
        differentStrength: 45,
        conclusion: "综合评估, 您的日主'戊土'处于偏弱的状态。",
        guidance: "您个性温和, 依赖性强, 需要外部的支持和有利环境, 善于借力发展。在事业上, 您可能需要更加积极主动地去争取机会, 同时也要注意人际关系的处理, 避免因过于固执而失去朋友和支持。",
    },
    balance: {
        similarWeight: 55,
        differentWeight: 45,
    },
    favorableGods: {
        favorable: [FiveElement.Earth, FiveElement.Fire],
        unfavorable: [FiveElement.Water],
    }
  };

  return mockReport;
};
