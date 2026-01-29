'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Deal } from '@/lib/api';

export default function CreateDeal() {
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_price: 0,
    current_price: 0,
    discount: 0,
    currency: 'ETB',
    location: 'Addis Ababa, ET',
    valid_until: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Get deal data from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const dealData = urlParams.get('deal');
    
    if (dealData) {
      try {
        const parsedDeal = JSON.parse(dealData);
        setDeal(parsedDeal);
        
        // Pre-fill form with deal data
        setFormData({
          title: parsedDeal.deal_title,
          description: parsedDeal.description,
          original_price: parsedDeal.original_price,
          current_price: parsedDeal.current_price,
          discount: parsedDeal.original_price - parsedDeal.current_price,
          currency: parsedDeal.currency,
          location: parsedDeal.location,
          valid_until: ''
        });
      } catch (error) {
        console.error('Error parsing deal data:', error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') || name === 'discount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send this to your backend API
    console.log('Creating deal:', formData);
    
    // Show success message
    alert('Deal created successfully!');
    
    // Navigate back to home
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Calculate badge text
  const getBadgeText = () => {
    const discountAmount = formData.original_price - formData.current_price;
    return `SAVE ${discountAmount.toFixed(0)} ${formData.currency}`;
  };

  // Preview Deal Card Component
  const PreviewDealCard = () => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview</h3>
      <h4 className="text-xl font-bold text-blue-600 mb-2">{formData.title || 'Deal Title'}</h4>
      <p className="text-gray-600 mb-4">{formData.description || 'Deal description will appear here...'}</p>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-gray-400 line-through text-sm">
            {formData.original_price} {formData.currency}
          </span>
          <span className="text-2xl font-bold text-green-600 ml-2">
            {formData.current_price} {formData.currency}
          </span>
        </div>
        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
          {getBadgeText()}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">
        <p>📍 {formData.location}</p>
        <p>📅 {formData.valid_until ? `Valid until ${new Date(formData.valid_until).toLocaleDateString()}` : 'Valid until 2 weeks from now'}</p>
      </div>
      
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
        Create Deal
      </button>
    </div>
  );

  if (!deal && window.location.search.includes('deal')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Recommendations
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Deal</h1>
              {deal && (
                <p className="text-sm text-gray-600">
                  Inspired by: <span className="font-semibold">{deal.deal_title}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={togglePreview}
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors shadow-sm"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Deal Title */}
              <div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Enter deal title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  placeholder="Describe your deal"
                />
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price *
                  </label>
                  <input
                    type="number"
                    id="original_price"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="current_price" className="block text-sm font-medium text-gray-700 mb-2">
                    Final Price *
                  </label>
                  <input
                    type="number"
                    id="current_price"
                    name="current_price"
                    value={formData.current_price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Currency and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="ETB">ETB (Ethiopian Birr)</option>
                    <option value="SEK">SEK (Swedish Krona)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Valid Until */}
              <div>
                <label htmlFor="valid_until" className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until
                </label>
                <input
                  type="date"
                  id="valid_until"
                  name="valid_until"
                  value={formData.valid_until}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Create Deal
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-8 h-fit">
              <PreviewDealCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
