'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tenant } from 'shared';

interface AppContextType {
  user: User | null;
  tenant: Tenant | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  clearContext: () => void;
}

const defaultContext: AppContextType = {
  user: null,
  tenant: null,
  isLoading: true,
  setUser: () => {},
  setTenant: () => {},
  clearContext: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load context from localStorage on initial mount
  useEffect(() => {
    const loadStoredContext = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedTenant = localStorage.getItem('tenant');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedTenant) {
          setTenant(JSON.parse(storedTenant));
        }
      } catch (error) {
        console.error('Failed to load context from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredContext();
  }, []);

  // Save context to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }

      if (tenant) {
        localStorage.setItem('tenant', JSON.stringify(tenant));
      } else {
        localStorage.removeItem('tenant');
      }
    }
  }, [user, tenant, isLoading]);

  const clearContext = () => {
    setUser(null);
    setTenant(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    localStorage.removeItem('accessToken');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        tenant,
        isLoading,
        setUser,
        setTenant,
        clearContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
