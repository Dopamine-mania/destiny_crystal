export interface UserInfo {
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthLocation: string;
  useSolarTime: boolean;
}

export enum FiveElement {
    Wood = '木',
    Fire = '火',
    Earth = '土',
    Metal = '金',
    Water = '水',
}

export interface FiveElementDistribution {
    element: FiveElement;
    exposed: number;
    hidden: number;
    percentage: number;
}

export interface BaziReport {
    dayMaster: {
        element: FiveElement;
        name: string;
        description: string;
    };
    fiveElementsDistribution: FiveElementDistribution[];
    elementGroups: {
        similar: number;
        different: number;
    };
    seasonalStrengths: {
        element: FiveElement;
        state: '旺' | '相' | '休' | '囚' | '死';
        description: string;
    }[];
    strengthAnalysis: {
        similarStrength: number;
        differentStrength: number;
        conclusion: string;
        guidance: string;
    };
    balance: {
        similarWeight: number;
        differentWeight: number;
    };
    favorableGods: {
        favorable: FiveElement[];
        unfavorable: FiveElement[];
    };
}

export interface Crystal {
  name: string;
  element: FiveElement;
  description: string;
  image: string; // Could be a URL or an emoji/icon identifier
  price: number;
  originalPrice?: number;
  reviews: number;
  rating: number;
  specs: string;
}

export interface CartItem {
  crystal: Crystal;
  quantity: number;
}
