// API configuration for connecting to Railway backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dealsuggestionbot-production.up.railway.app';

export interface Deal {
  target_service_id: string;
  deal_title: string;
  description: string;
  original_price: number;
  current_price: number;
  currency: string;
  badge_text: string;
  location: string;
  date_range: string;
  primary_button_text: string;
  is_active: boolean;
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

// Available businesses
export const BUSINESSES: Business[] = [
  { id: 'BARBER_SHOP_01', name: 'Barber Shop', description: 'Stockholm, Sweden' },
  { id: 'SPA_CENTER_02', name: 'SPA Center', description: 'Addis Ababa, Ethiopia' },
];

// API functions
export async function getRecommendations(bizId: string, clientId: string): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/recommend/${bizId}/${clientId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
  }
  
  return response.json();
}

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/`);
  return response.json();
}
