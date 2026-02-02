'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  mode: 'business' | 'client' | null;
  businessId: string | null;
  clientId: string | null;
  businessName: string | null;
  clientName: string | null;
  setMode: (mode: 'business' | 'client' | null) => void;
  setBusinessId: (id: string | null) => void;
  setClientId: (id: string | null) => void;
  setBusinessName: (name: string | null) => void;
  setClientName: (name: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'business' | 'client' | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('selectedMode') as 'business' | 'client' | null;
    const savedBusinessId = localStorage.getItem('selectedBusiness');
    const savedClientId = localStorage.getItem('selectedClient');
    
    if (savedMode) setMode(savedMode);
    if (savedBusinessId) setBusinessId(savedBusinessId);
    if (savedClientId) setClientId(savedClientId);
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (mode) localStorage.setItem('selectedMode', mode);
    else localStorage.removeItem('selectedMode');
  }, [mode]);

  useEffect(() => {
    if (businessId) localStorage.setItem('selectedBusiness', businessId);
    else localStorage.removeItem('selectedBusiness');
  }, [businessId]);

  useEffect(() => {
    if (clientId) localStorage.setItem('selectedClient', clientId);
    else localStorage.removeItem('selectedClient');
  }, [clientId]);

  const contextValue: AppContextType = {
    mode,
    businessId,
    clientId,
    businessName,
    clientName,
    setMode,
    setBusinessId,
    setClientId,
    setBusinessName,
    setClientName,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
