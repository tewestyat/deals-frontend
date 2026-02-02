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

const ClientDealsDirect = () => {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState('');
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients] = useState([
    { id: 'client_001', name: 'Client 001', email: 'client001@example.com' },
    { id: 'client_002', name: 'Client 002', email: 'client002@example.com' },
    { id: 'client_003', name: 'Client 003', email: 'client003@example.com' },
    { id: 'client_004', name: 'Client 004', email: 'client004@example.com' },
    { id: 'client_005', name: 'Client 005', email: 'client005@example.com' }
  ]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load selected client from localStorage if exists
    if (typeof window !== 'undefined') {
      const savedClient = localStorage.getItem('selectedClient');
      if (savedClient) {
        setSelectedClient(savedClient);
      }
    }
  }, []);

  useEffect(() => {
    // Automatically load recommendations when client is selected
    if (selectedClient) {
      loadRecommendations();
    }
  }, [selectedClient]);

  const loadRecommendations = async () => {
    if (!selectedClient) return;

    // Map each client to their correct business based on your journal entries
    let businessId = 'BARBER_SHOP_01'; // default
    if (selectedClient === 'client_004' || selectedClient === 'client_005') {
      businessId = 'SPA_CENTER_02';
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Call your FastAPI endpoint with correct business-client pairing
      const result = await getRecommendations(businessId, selectedClient);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const DealCard = ({ deal }: { deal: Deal }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
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
            Your Personalized Deals
          </h1>
        </div>
        
        {/* Client Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-2">
                Select Client
              </label>
              <select
                id="client"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
              >
                <option value="">Choose a client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
        
        {/* Results - Only Personalized Deals */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your personalized deals...</p>
          </div>
        )}
        
        {recommendations && !loading && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Your Personalized Deals
            </h2>
            {recommendations.personalized_deals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.personalized_deals.map((deal: Deal, index: number) => (
                  <DealCard key={index} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No personalized deals available for this client.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDealsDirect;
