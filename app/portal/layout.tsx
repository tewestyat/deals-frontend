'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [selectedBusiness, setSelectedBusiness] = useState('');
  const [mounted, setMounted] = useState(false);
  const [businesses] = useState([
    { id: 'BARBER_SHOP_01', name: 'Barber Shop', description: 'Professional grooming and haircut services', category: 'Barber' },
    { id: 'SPA_CENTER_02', name: 'Spa Center', description: 'Wellness and relaxation services', category: 'Spa & Wellness' }
  ]);

  useEffect(() => {
    setMounted(true);
    // Only run on client side
    if (typeof window !== 'undefined') {
      const business = localStorage.getItem('selectedBusiness');
      const selectedMode = localStorage.getItem('selectedMode');
      
      if (!business || selectedMode !== 'business') {
        router.push('/home');
      } else {
        setSelectedBusiness(business);
      }
    }
  }, [router]);

  const currentBusiness = businesses.find(b => b.id === selectedBusiness);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-purple-700 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-purple-600">
          <h1 className="text-2xl font-bold">aspio</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors">
                <span className="mr-3">📊</span>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors">
                <span className="mr-3">📅</span>
                Booking System
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors">
                <span className="mr-3">💼</span>
                Services
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors">
                <span className="mr-3">📆</span>
                Calendar
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors">
                <span className="mr-3">👥</span>
                Staff
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors">
                <span className="mr-3">👤</span>
                Customers
              </a>
            </li>
            <li>
              <a href="/portal/deals" className="flex items-center p-3 rounded-lg bg-purple-600 transition-colors">
                <span className="mr-3">🎯</span>
                Deals
              </a>
            </li>
            
            {/* Go back to portal */}
            <li className="pt-4 border-t border-purple-600">
              <a 
                href="/home" 
                className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <span className="mr-3">←</span>
                Go back to portal
              </a>
            </li>
            
            {/* Business Info as regular nav item */}
            {mounted && currentBusiness && (
              <li>
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors">
                  <span className="mr-3">🏢</span>
                  <div>
                    <div className="font-semibold text-white">{currentBusiness.name}</div>
                    <div className="text-sm text-purple-200">{currentBusiness.category}</div>
                  </div>
                </a>
              </li>
            )}
            
            {/* Language as regular nav item */}
            <li>
              <a href="#" className="flex items-center p-3 rounded-lg hover:bg-purple-600 transition-colors">
                <span className="mr-3">🌐</span>
                <select 
                  className="bg-transparent border-none text-white text-sm outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option>English</option>
                  <option>Swedish</option>
                </select>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
