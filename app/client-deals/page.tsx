'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRecommendations } from '@/lib/api';

interface Deal {
  deal_title: string;
  description: string;
  badge_text: string;
  current_price: string;
  original_price: string;
  location: string;
  date_range: string;
  primary_button_text: string;
}

const ClientDeals = () => {
  const router = useRouter();
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load selections from localStorage
    if (typeof window !== 'undefined') {
      const business = localStorage.getItem('selectedBusiness');
      const client = localStorage.getItem('selectedClient');
      const mode = localStorage.getItem('selectedMode');
      
      if (mode !== 'client') {
        router.push('/home');
        return;
      }
      
      setSelectedBusiness(business || '');
      setSelectedClient(client || '');
    }
  }, [router]);

  const handleGetRecommendations = async () => {
    if (!selectedBusiness || !selectedClient) {
      setError('Please select both business and client');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Call your existing FastAPI endpoint
      const result = await getRecommendations(selectedBusiness, selectedClient);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const DealCard = ({ deal, title }: { deal: Deal; title: string }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <h4 className="text-xl font-bold text-purple-600 mb-2">{deal.deal_title}</h4>
        <p className="text-gray-600 mb-4">{deal.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-gray-400 line-through text-sm">
              {deal.original_price}
            </span>
            <span className="text-2xl font-bold text-green-600 ml-2">
              {deal.current_price}
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
        
        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
          {deal.primary_button_text}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.push('/home')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            ←
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            Personalized Deals for You
          </h1>
        </div>
        
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Business
              </label>
              <input
                type="text"
                value={selectedBusiness}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selected Client
              </label>
              <input
                type="text"
                value={selectedClient}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleGetRecommendations}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors shadow-sm"
              >
                {loading ? 'Loading...' : 'Get My Deals'}
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
                🎯 Personalized Deals for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.personalized_deals.map((deal: Deal, index: number) => (
                  <DealCard key={index} deal={deal} title="Personalized" />
                ))}
              </div>
            </div>
            
            {/* Market Intelligence */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📊 Trending Deals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.market_intel_deals.map((deal: Deal, index: number) => (
                  <DealCard key={index} deal={deal} title="Trending" />
                ))}
              </div>
            </div>
            
            {/* AI Innovation */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🤖 AI Innovation Deals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.ai_innovation_deals.map((deal: Deal, index: number) => (
                  <DealCard key={index} deal={deal} title="AI Generated" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDeals;
