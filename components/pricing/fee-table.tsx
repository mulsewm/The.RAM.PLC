import { useState } from 'react';
import { FeeItem } from "@/data/pricingData";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface FeeTableProps {
  fees: FeeItem[];
  showCurrencySelector?: boolean;
  defaultCurrency?: 'AED' | 'QAR' | 'ETB';
  className?: string;
  showTotal?: boolean;
  title?: string;
  description?: string;
}

type Currency = 'AED' | 'QAR' | 'ETB';

const currencySymbols = {
  AED: 'د.إ',
  QAR: 'ر.ق',
  ETB: 'Br'
};

export function FeeTable({ 
  fees, 
  showCurrencySelector = true,
  defaultCurrency = 'AED',
  className = "",
  showTotal = false,
  title,
  description
}: FeeTableProps) {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  
  const getAmount = (fee: FeeItem, curr: Currency) => {
    switch (curr) {
      case 'AED': return fee.amountAED;
      case 'QAR': return fee.amountQAR;
      case 'ETB': return fee.amountETB;
      default: return fee.amountAED;
    }
  };

  const totalAmount = showTotal 
    ? fees.reduce((sum, fee) => sum + (getAmount(fee, currency) || 0), 0)
    : null;

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden ${className}`}>
      {(title || description || showCurrencySelector) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>}
            {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
          </div>
          
          {showCurrencySelector && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Currency:</span>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                {(['AED', 'QAR', 'ETB'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      currency === curr
                        ? 'bg-teal-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } ${curr === 'AED' ? 'rounded-r-none' : curr === 'ETB' ? 'rounded-l-none' : 'rounded-none'}`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount ({currency})
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {fees.map((fee, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {fee.name}
                    {fee.note && (
                      <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Info className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span>{fee.note}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900 dark:text-white font-medium">
                    {currencySymbols[currency]} {getAmount(fee, currency)?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </div>
                </td>
              </tr>
            ))}
            
            {/* {showTotal && totalAmount !== null && (
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white" colSpan={2}>
                  <div className="flex justify-between items-center">
                    <span>Total:</span>
                    <span className="text-lg font-semibold">
                      {currencySymbols[currency]} {totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        All amounts exclude 5% VAT. Exchange rates
      </div>
    </div>
  );
}
