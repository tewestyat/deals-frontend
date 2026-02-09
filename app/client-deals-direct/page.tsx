'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRecommendations, getPassportSummary, PassportResponse } from '@/lib/api';
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
  
  // Passport modal states
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [passportLoading, setPassportLoading] = useState(false);
  const [passportResult, setPassportResult] = useState<PassportResponse | null>(null);
  const [passportError, setPassportError] = useState<string | null>(null);
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

  const handlePassportSummary = async () => {
    if (!selectedClient || !selectedCategory) {
      setPassportError('Please select a category');
      return;
    }

    setPassportLoading(true);
    setPassportError(null);
    setPassportResult(null);

    try {
      const result = await getPassportSummary(selectedClient, selectedCategory);
      setPassportResult(result);
    } catch (err) {
      setPassportError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setPassportLoading(false);
    }
  };

  const openPassportModal = () => {
    setShowPassportModal(true);
    setPassportResult(null);
    setPassportError(null);
    setSelectedCategory('');
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
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-purple-700">
                        <strong>Client:</strong> {clients.find(c => c.id === selectedClient)?.name}<br/>
                        <strong>Email:</strong> {clients.find(c => c.id === selectedClient)?.email}<br/>
                        <strong>Total Journal Entries:</strong> {journalHistory.length}
                      </p>
                    </div>
                    <button
                      onClick={openPassportModal}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      📋 Summarize
                    </button>
                  </div>
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
        
        {/* Passport Modal */}
        {showPassportModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200 relative transform scale-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Generate Technical Briefing</h3>
                <button
                  onClick={() => setShowPassportModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Client:</strong> {clients.find(c => c.id === selectedClient)?.name}
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-900"
                >
                  <option value="">Choose a category...</option>
                  <option value="barber">Barber</option>
                  <option value="spa">Spa</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="fitness">Fitness</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              
              {passportError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-4">
                  {passportError}
                </div>
              )}
              
              {passportResult && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Technical Briefing</h4>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {passportResult.technical_briefing}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handlePassportSummary}
                  disabled={passportLoading || !selectedCategory}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {passportLoading ? 'Generating...' : 'Generate Summary'}
                </button>
                <button
                  onClick={() => setShowPassportModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDealsDirect;
