'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRecommendations } from '@/lib/api';
import { getClientJournalHistory } from '@/lib/portal-api';

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
  const [journalHistory, setJournalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [journalLoading, setJournalLoading] = useState(false);
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
    // Automatically load recommendations and journal when client is selected
    if (selectedClient) {
      loadRecommendations();
      loadJournalHistory();
    }
  }, [selectedClient]);

  const loadJournalHistory = async () => {
    if (!selectedClient) return;
    
    setJournalLoading(true);
    try {
      const history = await getClientJournalHistory(selectedClient);
      setJournalHistory(history);
    } catch (err) {
      console.error('Error loading journal history:', err);
    } finally {
      setJournalLoading(false);
    }
  };

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
        
        {/* Journal History Section */}
        {selectedClient && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📋 Client Journal History
            </h2>
            
            {journalLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mr-3"></div>
                <span className="text-gray-600">Loading journal history...</span>
              </div>
            ) : (
              <>
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-purple-700">
                    <strong>Client:</strong> {clients.find(c => c.id === selectedClient)?.name}<br/>
                    <strong>Email:</strong> {clients.find(c => c.id === selectedClient)?.email}<br/>
                    <strong>Total Journal Entries:</strong> {journalHistory.length}
                  </p>
                </div>
                
                {/* Journal Entries as Paragraphs */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Visit History</h3>
                  {journalHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No journal entries found for this client.</p>
                    </div>
                  ) : (
                    journalHistory.map((entry: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              Journal Entry
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {entry.date || 'No date'}
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                              {entry.text || 'No description available'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Client: {entry.client_id}
                            </p>
                            <p className="text-xs text-gray-500">
                              Business: {entry.business_id}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
        
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
