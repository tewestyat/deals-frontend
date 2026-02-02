// API configuration for connecting to Railway backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dealsuggestionbot-production.up.railway.app';

export interface Deal {
  deal_title: string;
  description: string;
  original_price: string;
  current_price: string;
  currency: string;
  badge_text: string;
  location: string;
  date_range: string;
  primary_button_text: string;
}

export interface RecommendationResponse {
  personalized_deals: Deal[];
  market_intel_deals: Deal[];
  ai_innovation_deals: Deal[];
}

export interface Business {
  id: string;
  name: string;
  description: string;
}

// Get recommendations from your FastAPI backend
export async function getRecommendations(businessId: string, clientId: string): Promise<RecommendationResponse> {
  try {
    console.log(`🔥 Calling FastAPI: ${API_BASE_URL}/recommend/${businessId}/${clientId}`);
    const response = await fetch(`${API_BASE_URL}/recommend/${businessId}/${clientId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('🔥 FastAPI response:', data);
    return data;
  } catch (error) {
    console.error('🔥 Error calling FastAPI:', error);
    throw error;
  }
}

export const BUSINESSES: Business[] = [
  { id: 'BARBER_SHOP_01', name: 'Barber Shop', description: 'Stockholm, Sweden' },
  { id: 'SPA_CENTER_02', name: 'SPA Center', description: 'Addis Ababa, Ethiopia' },
];

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/`);
  return response.json();
}
