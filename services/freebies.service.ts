import { API } from '../util/instance';

export interface Freebie {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  description: string;
  category: string;
  image: string;
  claimedCount: number;
  totalAvailable: number;
  expiryDate: string;
  isActive: boolean;
  site: string;
  minimumThreshold?: string; // Added minimumThreshold property
  createdAt: string;
  updatedAt: string;
}

export interface ThresholdOption {
  label: string;
  value: number;
}

export interface ThresholdRangeResponse {
  thresholds: number[];
  options: ThresholdOption[];
  minThreshold: number;
  maxThreshold: number;
}

export const getFreebies = async (threshold?: number): Promise<Freebie[]> => {
  try {
    const params = threshold ? { thresholdAmount: threshold.toString() } : {};
    const response = await API.get('/customers/claim-free-buy/monthly-freebies', { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching freebies:', error);
    return [];
  }
};

export const getThresholdRanges = async (): Promise<ThresholdRangeResponse> => {
  try {
    const response = await API.get('/customers/claim-free-buy/threshold-ranges');
    return response.data.data || { thresholds: [], options: [], minThreshold: 0, maxThreshold: 0,freebieInfo:{} };
  } catch (error) {
    console.error('Error fetching threshold ranges:', error);
    return { thresholds: [], options: [], minThreshold: 0, maxThreshold: 0 };
  }
};
