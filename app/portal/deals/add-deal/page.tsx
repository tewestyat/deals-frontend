'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateDealRequest, getDealRecommendations, DealRecommendation } from '@/lib/portal-api';


const AddDeal = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    originalPrice: '',
    currentPrice: '',
    location: '',
    dateRange: '',
    buttonText: '',
    isActive: 'true'
  });
  
  const [recommendations, setRecommendations] = useState<DealRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    setMounted(true);
    // Load recommendations automatically when component mounts
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      
      // Get selected business from localStorage (client-side only)
      let selectedBusiness = 'BARBER_SHOP_01'; // fallback
      if (mounted) {
        selectedBusiness = localStorage.getItem('selectedBusiness') || 'BARBER_SHOP_01';
      }
      
      console.log('Loading recommendations for business:', selectedBusiness);
      
      // Connect to REAL Railway backend API
      const recs = await getDealRecommendations(selectedBusiness);
      console.log('Real API response:', recs);
      
      // Combine Market Intelligence and AI Innovation deals (no personalized for business)
      const allRecommendations = [
        ...recs.market_intel_deals,
        ...recs.ai_innovation_deals
      ];
      
      setRecommendations(allRecommendations);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error loading recommendations from Railway API:', error);
      // Don't show error, just continue without recommendations
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const applyRecommendation = (recommendation: DealRecommendation) => {
    setFormData(prev => ({
      ...prev,
      title: recommendation.title,
      description: recommendation.description,
      originalPrice: String(recommendation.originalPrice),
      currentPrice: String(recommendation.suggestedPrice),
      discount: recommendation.discount
    }));
    setShowRecommendations(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API to save deal
    console.log('New deal:', formData);
    alert('Deal created successfully!');
    router.push('/portal/deals');
  };

  const handleCancel = () => {
    router.push('/portal/deals');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={handleCancel}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            ←
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Deal</h1>
        </div>
      </div>

      {/* Form and Preview */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Deal Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                placeholder="e.g., Weekend Special"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                placeholder="Describe your deal..."
              />
            </div>

            {/* Original Price */}
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (SEK) *
              </label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                placeholder="100"
              />
            </div>

            {/* Current Price */}
            <div>
              <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Deal Price (SEK) *
              </label>
              <input
                type="number"
                id="currentPrice"
                name="currentPrice"
                value={formData.currentPrice}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                placeholder="80"
              />
            </div>

            {/* Discount */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                Discount Text
              </label>
              <input
                type="text"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                placeholder="20% OFF"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                placeholder="Stockholm, Sweden"
              />
            </div>

            {/* Date Range */}
            <div className="md:col-span-2">
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <input
                type="text"
                id="dateRange"
                name="dateRange"
                value={formData.dateRange}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                placeholder="Valid until Dec 31, 2024"
              />
            </div>

            {/* Button Text */}
            <div>
              <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                id="buttonText"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
                placeholder="Book Now"
              />
            </div>

            {/* Active Status */}
            <div>
              <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="isActive"
                name="isActive"
                value={formData.isActive}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/portal/deals')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Deal'}
            </button>
          </div>
        </form>
        </div>

        {/* Preview */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Deal Preview</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Preview Header */}
              <div className="bg-purple-500 px-3 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-white text-xs font-medium">PREVIEW</span>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    New Deal
                  </span>
                </div>
              </div>
              
              {/* Preview Content */}
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-2">
                  {formData.title || 'Deal Title'}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {formData.description || 'Deal description will appear here...'}
                </p>
                
                {/* Price section */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {formData.originalPrice && (
                      <span className="text-gray-400 line-through text-sm mr-2">
                        {formData.originalPrice} SEK
                      </span>
                    )}
                    {formData.currentPrice ? (
                      <span className="text-green-600 font-bold text-lg">
                        {formData.currentPrice} SEK
                      </span>
                    ) : (
                      <span className="text-gray-400 font-bold text-lg">
                        Price SEK
                      </span>
                    )}
                  </div>
                  {formData.discount && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                      {formData.discount}
                    </span>
                  )}
                </div>
                
                {/* Additional Info */}
                {(formData.location || formData.dateRange) && (
                  <div className="text-xs text-gray-500 mb-3 space-y-1">
                    {formData.location && (
                      <p>📍 {formData.location}</p>
                    )}
                    {formData.dateRange && (
                      <p>📅 {formData.dateRange}</p>
                    )}
                  </div>
                )}
                
                {/* Preview Button */}
                <button
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm font-medium"
                  disabled
                >
                  {formData.buttonText || 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Section - Moved to Bottom */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">💡 AI-Powered Deal Suggestions</h2>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Use these AI-generated templates to create effective deals for your business.
            </p>

            {/* Only show Market Intelligence and AI Innovation for business side */}
            <div className="space-y-6">
              {/* Market Intelligence Section */}
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  Market Intelligence (Trending Deals)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations
                    .filter(rec => rec.category === "Market Intelligence")
                    .map((rec, index) => (
                      <div key={`market-${index}`} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        {/* Header with badge */}
                        <div className="bg-purple-500 px-3 py-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-xs font-medium">TRENDING</span>
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                              Popular
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-2">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                          
                          {/* Price section */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-gray-400 line-through text-sm">
                                {rec.originalPrice} SEK
                              </span>
                              <span className="text-green-600 font-bold text-lg ml-2">
                                {rec.suggestedPrice} SEK
                              </span>
                            </div>
                            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                              {rec.discount}
                            </span>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>🔥 2.3k people used</span>
                            <span>⭐ 4.8 rating</span>
                          </div>
                          
                          {/* Button */}
                          <button
                            onClick={() => applyRecommendation(rec)}
                            className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 transition-colors font-medium"
                          >
                            Create Deal
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {recommendations.filter(rec => rec.category === "Market Intelligence").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No market intelligence deals available.</p>
                  </div>
                )}
              </div>

              {/* AI Innovation Section */}
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Innovation (Cutting-Edge Strategies)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations
                    .filter(rec => rec.category === "AI Innovation")
                    .map((rec, index) => (
                      <div key={`ai-${index}`} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        {/* Header with badge */}
                        <div className="bg-purple-500 px-3 py-2">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-xs font-medium">AI GENERATED</span>
                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                              New
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 mb-2">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                          
                          {/* Price section */}
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-gray-400 line-through text-sm">
                                {rec.originalPrice} SEK
                              </span>
                              <span className="text-green-600 font-bold text-lg ml-2">
                                {rec.suggestedPrice} SEK
                              </span>
                            </div>
                            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded">
                              {rec.discount}
                            </span>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>🚀 AI Optimized</span>
                            <span>📈 95% success</span>
                          </div>
                          
                          {/* Button */}
                          <button
                            onClick={() => applyRecommendation(rec)}
                            className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700 transition-colors font-medium"
                          >
                            Create Deal
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {recommendations.filter(rec => rec.category === "AI Innovation").length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No AI innovation deals available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDeal;
