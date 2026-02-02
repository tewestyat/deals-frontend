'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBusinesses, getClients } from '@/lib/portal-api';

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

const Home = () => {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<'business' | 'client' | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [businessesData, clientsData] = await Promise.all([
        getBusinesses(),
        getClients()
      ]);
      
      console.log('Loaded businesses:', businessesData);
      console.log('Loaded clients:', clientsData);
      
      setBusinesses(businessesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedMode) {
      alert('Please select a mode (Business or Client)');
      return;
    }

    if (selectedMode === 'business' && !selectedBusiness) {
      alert('Please select a business');
      return;
    }

    if (selectedMode === 'client' && !selectedClient) {
      alert('Please select a client');
      return;
    }

    // Store selections in localStorage for other pages to use
    if (mounted) {
      localStorage.setItem('selectedMode', selectedMode);
      localStorage.setItem('selectedBusiness', selectedBusiness);
      if (selectedClient) {
        localStorage.setItem('selectedClient', selectedClient);
      }
    }

    // Navigate to appropriate page
    if (selectedMode === 'business') {
      router.push('/portal/deals');
    } else {
      router.push('/client-deals-direct');
    }
  };

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading businesses and clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🤖 AI Deal Recommendation Engine
          </h1>
          <p className="text-xl text-gray-600">
            Choose your mode to get personalized deal recommendations
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Mode</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setSelectedMode('business')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedMode === 'business'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Mode</h3>
              <p className="text-gray-600">
                Create and manage deals for your business with AI-powered suggestions
              </p>
              {selectedMode === 'business' && (
                <div className="mt-4 text-purple-600 font-semibold">✓ Selected</div>
              )}
            </button>

            <button
              onClick={() => setSelectedMode('client')}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedMode === 'client'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Client Mode</h3>
              <p className="text-gray-600">
                Browse personalized deals as a customer
              </p>
              {selectedMode === 'client' && (
                <div className="mt-4 text-blue-600 font-semibold">✓ Selected</div>
              )}
            </button>
          </div>

          {/* Business Selection */}
          {selectedMode === 'business' && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Business to Manage
              </h3>
              {businesses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No businesses available.</p>
                  <p className="text-sm">Please add businesses to your backend.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businesses.map((business) => (
                    <button
                      key={business.id}
                      onClick={() => setSelectedBusiness(business.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedBusiness === business.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{business.name}</h4>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {business.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{business.description}</p>
                      {selectedBusiness === business.id && (
                        <div className="mt-2 text-purple-600 font-semibold text-sm">✓ Selected</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Client Selection (only for client mode) */}
          {selectedMode === 'client' && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Client Profile</h3>
              {clients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No clients available.</p>
                  <p className="text-sm">Please add clients to your backend.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClient(client.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedClient === client.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-800">{client.name}</h4>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      {selectedClient === client.id && (
                        <div className="mt-2 text-blue-600 font-semibold text-sm">✓ Selected</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Continue to {selectedMode === 'business' ? 'Business Portal' : 'Client Deals'}
            </button>
          </div>
        </div>

        {/* Status Display */}
        {selectedMode && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Selection</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-600 mr-2">Mode:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedMode === 'business' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedMode === 'business' ? '🏢 Business' : '👤 Client'}
                </span>
              </div>
              {selectedBusiness && (
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 mr-2">Business:</span>
                  <span className="text-gray-800">
                    {businesses.find(b => b.id === selectedBusiness)?.name}
                  </span>
                </div>
              )}
              {selectedClient && (
                <div className="flex items-center">
                  <span className="font-medium text-gray-600 mr-2">Client:</span>
                  <span className="text-gray-800">
                    {clients.find(c => c.id === selectedClient)?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
