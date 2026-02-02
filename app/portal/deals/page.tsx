'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Deal, getDeals, updateDealStatus, mockDeals } from '@/lib/portal-api';

const YourDeals = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'onhold' | 'finished'>('active');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [businesses] = useState([
    { id: 'BARBER_SHOP_01', name: 'Barber Shop', description: 'Professional grooming and haircut services', category: 'Barber' },
    { id: 'SPA_CENTER_02', name: 'Spa Center', description: 'Wellness and relaxation services', category: 'Spa & Wellness' }
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load selected business from localStorage
    if (typeof window !== 'undefined') {
      const business = localStorage.getItem('selectedBusiness');
      if (business) {
        setSelectedBusiness(business);
      }
    }
  }, []);

  // Load deals on component mount
  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      // For now, use mock data. Replace with actual API call when backend is ready
      // const dealsData = await getDeals('business_001');
      const dealsData = mockDeals;
      setDeals(dealsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deals');
      // Fallback to mock data if API fails
      setDeals(mockDeals);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = deal.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const toggleDealStatus = async (dealId: string) => {
    try {
      const deal = deals.find(d => d.id === dealId);
      if (!deal) return;
      
      // For now, just update local state. Replace with API call when ready
      // await updateDealStatus(dealId, !deal.isActive);
      
      setDeals(prevDeals => 
        prevDeals.map(d => 
          d.id === dealId ? { ...d, isActive: !d.isActive } : d
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deal status');
    }
  };

  const DealCard = ({ deal }: { deal: Deal }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
          {deal.discount}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={deal.isActive}
            onChange={() => toggleDealStatus(deal.id)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{deal.title}</h3>
      <p className="text-gray-600 mb-4">{deal.description}</p>
      
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <p>📍 {deal.location}</p>
        <p>📅 {deal.dateRange}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-gray-400 line-through text-sm">
            {deal.originalPrice} SEK
          </span>
          <span className="text-xl font-bold text-green-600 ml-2">
            {deal.currentPrice} SEK
          </span>
        </div>
      </div>
    </div>
  );

  const getTabCount = (status: 'active' | 'onhold' | 'finished') => {
    return deals.filter(deal => deal.status === status).length;
  };

  // Filter deals for current business (assuming deals have a businessId property)
  const businessDeals = deals.filter((deal: any) => deal.businessId === selectedBusiness);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Deals</h1>
          <Link
            href="/portal/deals/add-deal"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            + Add Deal
          </Link>
        </div>

        {/* Deals List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Your Deals</h2>
          </div>
          
          {businessDeals.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No deals found for this business.</p>
              <p className="text-sm">Create your first deal to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {businessDeals.map((deal) => (
                <div key={deal.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{deal.title}</h3>
                      <p className="text-gray-600 mt-1">{deal.description}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-green-600 font-semibold">{deal.currentPrice} SEK</span>
                        <span className="text-gray-400 line-through">{deal.originalPrice} SEK</span>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {deal.discount}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourDeals;
