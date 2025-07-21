import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from "@/data/pricingData";
import { Check } from "lucide-react";

interface DataFlowPackagesProps {
  packages: Package[];
  defaultCurrency?: 'AED' | 'QAR' | 'ETB';
  className?: string;
}

export function DataFlowPackages({ 
  packages, 
  defaultCurrency = 'AED',
  className = '' 
}: DataFlowPackagesProps) {
  const router = useRouter();
  const [currency, setCurrency] = useState<'AED' | 'QAR' | 'ETB'>(defaultCurrency);
  
  const getPrice = (pkg: Package, curr: 'AED' | 'QAR' | 'ETB') => {
    switch (curr) {
      case 'AED': return pkg.priceAED;
      case 'QAR': return pkg.priceQAR || pkg.priceAED; // Fallback to AED if QAR not available
      case 'ETB': return pkg.priceETB || (pkg.priceAED * 45); // Convert if not available
      default: return pkg.priceAED;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white"></h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'AED' | 'QAR' | 'ETB')}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-1 pl-2 pr-8 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
          >
            <option value="AED">AED</option>
            <option value="QAR">QAR</option>
            <option value="ETB">ETB</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.title} className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{pkg.description}</p>
              
              <div className="mt-4">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {currency === 'AED' && 'AED '}
                  {currency === 'QAR' ? 'QAR ' : ''}
                  {currency === 'ETB' ? 'ETB ' : ''}
                  {getPrice(pkg, currency)?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                {pkg.note && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {pkg.note}
                  </p>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-teal-900 dark:text-teal-200 mb-2">Requirements:</h4>
                <ul className="space-y-2">
                  {pkg.requirements.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-4 w-4 text-teal-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-teal-600 dark:text-teal-300">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                onClick={() => router.push('/account-creation')}
              >
                Select Package
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-teal-50 dark:bg-teal-900/20 border-l-4 border-teal-500 p-4 rounded-r">
        <div className="flex">
          <div className="flex-shrink-0">
            <Check className="h-5 w-5 text-teal-500" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-teal-800 dark:text-teal-200">Important Notes</h3>
            <div className="mt-2 text-sm text-teal-700 dark:text-teal-300 space-y-1">
              <p>• All prices are exclusive of 5% VAT</p>
              <p>• Cross-checking fees are not included in the package prices</p>
              <p>• Additional document verification may be required based on your specific case</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
