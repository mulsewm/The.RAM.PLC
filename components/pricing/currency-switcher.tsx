'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Currency = 'AED' | 'QAR' | 'ETB';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CURRENCY_STORAGE_KEY = 'selected-currency';
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ 
  children,
  defaultCurrency = 'AED' 
}: { 
  children: ReactNode; 
  defaultCurrency?: Currency;
}) {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);

  // Load saved currency from localStorage on mount
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency | null;
      if (savedCurrency) {
        setCurrencyState(savedCurrency);
      }
    } catch (error) {
      console.error('Failed to load currency from localStorage', error);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
      setCurrencyState(newCurrency);
    } catch (error) {
      console.error('Failed to save currency to localStorage', error);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(defaultCurrency?: Currency) {
  const context = useContext(CurrencyContext);
  
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  
  return context;
}

interface CurrencySwitcherProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CurrencySwitcher({ 
  className, 
  variant = 'outline', 
  size = 'default' 
}: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();
  
  const currencies: { value: Currency; label: string }[] = [
    { value: 'AED', label: 'AED' },
    { value: 'QAR', label: 'QAR' },
    { value: 'ETB', label: 'ETB' },
  ];

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {currencies.map(({ value, label }) => (
        <Button
          key={value}
          type="button"
          variant={currency === value ? 'default' : variant}
          size={size}
          onClick={() => setCurrency(value)}
          className={cn(
            'min-w-[60px] transition-colors',
            currency === value ? 'pointer-events-none' : 'hover:bg-muted/50'
          )}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
