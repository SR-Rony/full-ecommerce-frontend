import { API } from '../util/instance';

export interface Deal {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  category: string;
  image: string;
  expiryDate: string;
  isNew: boolean;
  isFeatured: boolean;
  site: string;
  createdAt: string;
  updatedAt: string;
}

export const getDeals = async (): Promise<Deal[]> => {
  try {
    const response = await API.get('/deals');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
};
