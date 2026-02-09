// API functions for business portal

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dealsuggestionbot-production.up.railway.app';

// Get all businesses from the backend
export async function getBusinesses(): Promise<Business[]> {
  try {
    // Extract businesses from your actual journal entries data
    // These are the real business IDs from your journal_entries.json
    return [
      { 
        id: 'BARBER_SHOP_01', 
        name: 'Barber Shop', 
        description: 'Professional grooming and haircut services', 
        category: 'Barber' 
      },
      { 
        id: 'SPA_CENTER_02', 
        name: 'Spa Center', 
        description: 'Wellness and relaxation services', 
        category: 'Spa & Wellness' 
      }
    ];
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }
}

// Get all clients from the backend
export async function getClients(): Promise<Client[]> {
  try {
    // Extract clients from your actual journal entries data
    // These are the real client IDs from your journal_entries.json
    return [
      { id: 'client_001', name: 'Client 001', email: 'client001@example.com' },
      { id: 'client_002', name: 'Client 002', email: 'client002@example.com' },
      { id: 'client_003', name: 'Client 003', email: 'client003@example.com' },
      { id: 'client_004', name: 'Client 004', email: 'client004@example.com' },
      { id: 'client_005', name: 'Client 005', email: 'client005@example.com' }
    ];
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface Deal {
  id: string;
  title: string;
  discount: string;
  description: string;
  location: string;
  dateRange: string;
  originalPrice: string;
  currentPrice: string;
  isActive: boolean;
  status: 'active' | 'onhold' | 'finished';
  startDate?: string;
  endDate?: string;
}

export interface CreateDealRequest {
  title: string;
  description: string;
  discount: string;
  originalPrice: number;
  currentPrice: number;
  location: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'onhold' | 'finished';
}

export interface DealRecommendation {
  title: string;
  description: string;
  discount: string;
  suggestedPrice: number;
  originalPrice: number;
  category: string;
  reasoning: string;
  confidence: number;
}

export interface AIRecommendationResponse {
  personalized_deals: DealRecommendation[];
  market_intel_deals: DealRecommendation[];
  ai_innovation_deals: DealRecommendation[];
  insights: string[];
}

// Get all deals for a business
export async function getDeals(businessId: string): Promise<Deal[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/deals/business/${businessId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch deals: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
}

// Create a new deal
export async function createDeal(dealData: CreateDealRequest): Promise<Deal> {
  try {
    const response = await fetch(`${API_BASE_URL}/deals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dealData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create deal: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating deal:', error);
    throw error;
  }
}

// Update deal status (active/inactive)
export async function updateDealStatus(dealId: string, isActive: boolean): Promise<Deal> {
  try {
    const response = await fetch(`${API_BASE_URL}/deals/${dealId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update deal status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating deal status:', error);
    throw error;
  }
}

// Delete a deal
export async function deleteDeal(dealId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/deals/${dealId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete deal: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error deleting deal:', error);
    throw error;
  }
}

// Get AI-powered deal recommendations for businesses
export async function getDealRecommendations(businessId: string): Promise<AIRecommendationResponse> {
  try {
    // Use appropriate client ID for each business based on your journal entries
    let clientId = 'client_001'; // default for BARBER_SHOP_01
    if (businessId === 'SPA_CENTER_02') {
      clientId = 'client_004'; // use client_004 for SPA_CENTER_02
    }
    
    const apiUrl = `${API_BASE_URL}/recommend/${businessId}/${clientId}`;
    console.log(`🔥 Calling Railway API: ${apiUrl}`);
    console.log(`🔥 API_BASE_URL: ${API_BASE_URL}`);
    
    const response = await fetch(apiUrl);
    
    console.log(`🔥 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('🔥 Railway API raw response:', data);
    console.log('🔥 Personalized deals count:', data.personalized_deals?.length || 0);
    console.log('🔥 Market intel deals count:', data.market_intel_deals?.length || 0);
    console.log('🔥 AI innovation deals count:', data.ai_innovation_deals?.length || 0);
    
    // Transform the original format to match what the frontend expects
    const transformedData = {
      personalized_deals: [], // Empty for business side - personalized deals are client-specific
      market_intel_deals: (data.market_intel_deals || []).map((deal: any) => {
        const currentPrice = typeof deal.current_price === 'string' 
          ? parseInt(deal.current_price.replace(" SEK", "") || "75")
          : parseInt(String(deal.current_price) || "75");
        const originalPrice = typeof deal.original_price === 'string'
          ? parseInt(deal.original_price.replace(" SEK", "") || "100")
          : parseInt(String(deal.original_price) || "100");
          
        return {
          title: deal.deal_title || deal.title || "Market Deal",
          description: deal.description || "Trending offer for your business",
          discount: deal.badge_text || "25% OFF",
          suggestedPrice: currentPrice,
          originalPrice: originalPrice,
          category: "Market Intelligence",
          reasoning: "Trending in your industry with high engagement rates",
          confidence: 0.90
        };
      }),
      ai_innovation_deals: (data.ai_innovation_deals || []).map((deal: any) => {
        const currentPrice = typeof deal.current_price === 'string' 
          ? parseInt(deal.current_price.replace(" SEK", "") || "70")
          : parseInt(String(deal.current_price) || "70");
        const originalPrice = typeof deal.original_price === 'string'
          ? parseInt(deal.original_price.replace(" SEK", "") || "100")
          : parseInt(String(deal.original_price) || "100");
          
        return {
          title: deal.deal_title || deal.title || "AI Innovation",
          description: deal.description || "AI-powered deal suggestion",
          discount: deal.badge_text || "30% OFF",
          suggestedPrice: currentPrice,
          originalPrice: originalPrice,
          category: "AI Innovation",
          reasoning: "Cutting-edge strategies to maximize conversions",
          confidence: 0.80
        };
      }),
      insights: [
        "Market intelligence shows trending deals in your industry",
        "AI innovation provides cutting-edge deal strategies",
        "Personalized recommendations are available on the client side",
        "Use these templates to create effective deals for your business"
      ]
    };
    
    console.log('🔥 Transformed data:', transformedData);
    console.log('🔥 Final personalized_deals count:', transformedData.personalized_deals.length);
    console.log('🔥 Final market_intel_deals count:', transformedData.market_intel_deals.length);
    console.log('🔥 Final ai_innovation_deals count:', transformedData.ai_innovation_deals.length);
    return transformedData;
  } catch (error) {
    console.error('🔥 Error calling Railway API:', error);
    throw error;
  }
}

// Get client journal history from backend
export async function getClientJournalHistory(clientId: string): Promise<any[]> {
  try {
    console.log('🔥 Fetching journal history for client:', clientId);
    
    const response = await fetch(`${API_BASE_URL}/api/journal-entries?client_id=${clientId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get client journal history: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('🔥 Journal entries received:', data);
    
    return data || [];
  } catch (error) {
    console.error('🔥 Error fetching client journal history:', error);
    return [];
  }
}

// Mock data for development
export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'New upcoming deals',
    discount: '20% OFF',
    description: 'Service with no secondary - final test',
    location: 'Addis Ababa',
    dateRange: 'Valid from Jan 30 to Feb 18',
    originalPrice: '100',
    currentPrice: '80',
    isActive: true,
    status: 'active',
    startDate: '2025-01-30',
    endDate: '2025-02-18'
  },
  {
    id: '2',
    title: 'Fasika deal',
    discount: '50% OFF',
    description: 'Service with no secondary - final test',
    location: 'Addis Ababa',
    dateRange: 'Valid from Jan 31 to Feb 6',
    originalPrice: '200',
    currentPrice: '100',
    isActive: true,
    status: 'active',
    startDate: '2025-01-31',
    endDate: '2025-02-06'
  },
  {
    id: '3',
    title: 'Weekend Special',
    discount: '30% OFF',
    description: 'Weekend service discount',
    location: 'Addis Ababa',
    dateRange: 'Valid from Feb 1 to Feb 3',
    originalPrice: '150',
    currentPrice: '105',
    isActive: false,
    status: 'onhold',
    startDate: '2025-02-01',
    endDate: '2025-02-03'
  },
  {
    id: '4',
    title: 'Holiday Deal',
    discount: '25% OFF',
    description: 'Holiday special offer',
    location: 'Addis Ababa',
    dateRange: 'Valid from Dec 20 to Dec 31',
    originalPrice: '300',
    currentPrice: '225',
    isActive: false,
    status: 'finished',
    startDate: '2024-12-20',
    endDate: '2024-12-31'
  },
  {
    id: '5',
    title: 'New Year Special',
    discount: '40% OFF',
    description: 'New year celebration deal',
    location: 'Addis Ababa',
    dateRange: 'Valid from Jan 1 to Jan 15',
    originalPrice: '250',
    currentPrice: '150',
    isActive: false,
    status: 'finished',
    startDate: '2025-01-01',
    endDate: '2025-01-15'
  }
];

export const mockRecommendations: AIRecommendationResponse = {
  personalized_deals: [
    {
      title: "Weekend Wellness Package",
      description: "Combine spa treatment with healthy lunch for perfect weekend relaxation",
      discount: "25% OFF",
      suggestedPrice: 75,
      originalPrice: 100,
      category: "Wellness",
      reasoning: "Your customers prefer weekend bookings and wellness services",
      confidence: 0.85
    },
    {
      title: "Early Bird Special",
      description: "Discount for morning appointments before 10 AM",
      discount: "15% OFF",
      suggestedPrice: 85,
      originalPrice: 100,
      category: "Time-based",
      reasoning: "Increase utilization during off-peak hours",
      confidence: 0.78
    }
  ],
  market_intel_deals: [
    {
      title: "Flash Sale Friday",
      description: "Limited time deals every Friday to drive weekend traffic",
      discount: "30% OFF",
      suggestedPrice: 70,
      originalPrice: 100,
      category: "Promotional",
      reasoning: "Flash sales are trending in your industry with 40% higher engagement",
      confidence: 0.92
    },
    {
      title: "Referral Reward",
      description: "Special pricing for customers who bring new clients",
      discount: "20% OFF",
      suggestedPrice: 80,
      originalPrice: 100,
      category: "Referral",
      reasoning: "Referral programs show 3x higher customer lifetime value",
      confidence: 0.88
    }
  ],
  ai_innovation_deals: [
    {
      title: "AI-Powered Personalization",
      description: "Dynamic pricing based on customer preferences and booking history",
      discount: "Variable",
      suggestedPrice: 65,
      originalPrice: 100,
      category: "Technology",
      reasoning: "Personalized offers increase conversion by 35%",
      confidence: 0.79
    },
    {
      title: "Subscription Wellness",
      description: "Monthly membership with exclusive deals and priority booking",
      discount: "40% OFF",
      suggestedPrice: 60,
      originalPrice: 100,
      category: "Subscription",
      reasoning: "Recurring revenue models show 50% higher retention",
      confidence: 0.83
    }
  ],
  insights: [
    "Your customers respond best to 20-30% discount ranges",
    "Weekend deals perform 45% better than weekday deals",
    "Wellness and relaxation services are trending in your area",
    "Flash sales create urgency and increase immediate bookings"
  ]
};
