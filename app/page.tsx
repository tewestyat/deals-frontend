'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRecommendations, BUSINESSES, Deal, RecommendationResponse } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [selectedBusiness, setSelectedBusiness] = useState(BUSINESSES[0].id);
  const [clientId, setClientId] = useState('client_005');
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getRecommendations(selectedBusiness, clientId);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const DealCard = ({ deal, title, buttonText, navigateToCreate }: { 
    deal: Deal; 
    title: string; 
    buttonText?: string;
    navigateToCreate?: boolean;
  }) => {
    const handleCardClick = () => {
      if (navigateToCreate) {
        // Navigate to create-deal page with deal data
        const dealData = encodeURIComponent(JSON.stringify(deal));
        router.push(`/create-deal?deal=${dealData}`);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <h4 className="text-xl font-bold text-purple-600 mb-2">{deal.deal_title}</h4>
        <p className="text-gray-600 mb-4">{deal.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-gray-400 line-through text-sm">
              {deal.original_price} {deal.currency}
            </span>
            <span className="text-2xl font-bold text-green-600 ml-2">
              {deal.current_price} {deal.currency}
            </span>
          </div>
          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
            {deal.badge_text}
          </span>
        </div>
        
        <div className="text-sm text-gray-500 mb-4">
          <p>📍 {deal.location}</p>
          <p>📅 {deal.date_range}</p>
        </div>
        
        <button 
          onClick={handleCardClick}
          className={`w-full py-2 px-4 rounded transition-colors ${
            navigateToCreate 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {buttonText || deal.primary_button_text}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          AI Deal Recommendation Engine
        </h1>
        
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2">
                Select Business
              </label>
              <select
                id="business"
                value={selectedBusiness}
                onChange={(e) => setSelectedBusiness(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
              >
                {BUSINESSES.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name} - {business.description}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <input
                id="clientId"
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="e.g., client_005"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleGetRecommendations}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors shadow-sm"
              >
                {loading ? 'Loading...' : 'Get Recommendations'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
        
        {/* Results */}
        {recommendations && (
          <div className="space-y-8">
            {/* Personalized Deals */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Personalized Deals for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.personalized_deals.map((deal, index) => (
                  <DealCard key={index} deal={deal} title="Personalized" />
                ))}
              </div>
            </div>
            
            {/* Market Intelligence */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📊 Market Intelligence
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.market_intel_deals.map((deal, index) => (
                  <DealCard 
                    key={index} 
                    deal={deal} 
                    title="Trending" 
                    buttonText="Create Deal"
                    navigateToCreate={true}
                  />
                ))}
              </div>
            </div>
            
            {/* AI Innovation */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🤖 AI Innovation Deals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.ai_innovation_deals.map((deal, index) => (
                  <DealCard 
                    key={index} 
                    deal={deal} 
                    title="AI Generated" 
                    buttonText="Create Deal"
                    navigateToCreate={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
