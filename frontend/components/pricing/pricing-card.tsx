import { FeeItem, Currency } from "@/data/pricingData";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, FileText } from "lucide-react";

interface PricingCardProps {
  title: string;
  fees: FeeItem[];
  currency: Currency;
  className?: string;
  tags?: string[];
  icon?: React.ReactNode;
}

export function PricingCard({ 
  title, 
  fees, 
  currency,
  className = '',
  tags = [],
  icon
}: PricingCardProps) {
  const getAmount = (fee: FeeItem) => {
    const amount = currency === 'AED' ? fee.amountAED : 
                 currency === 'QAR' ? fee.amountQAR : 
                 fee.amountETB;
    return amount?.toLocaleString() || 'N/A';
  };

  const currencySymbol = {
    AED: 'AED',
    QAR: 'QAR',
    ETB: 'ETB'
  }[currency];

  const total = fees.reduce((sum, fee) => {
    const amount = currency === 'AED' ? fee.amountAED : 
                 currency === 'QAR' ? fee.amountQAR : 
                 fee.amountETB;
    return sum + (amount || 0);
  }, 0);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md ${className}`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              {icon && <span className="text-teal-500">{icon}</span>}
              {title}
            </h3>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {currencySymbol} {total.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {fees.map((fee, i) => (
            <div key={i} className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {fee.name}
                  </span>
                  {fee.note && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({fee.note})
                    </span>
                  )}
                </div>
                {fee.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {fee.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currencySymbol} {getAmount(fee)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {fees.length} items included
          </div>
          <button className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-md transition-colors">
            Select Plan
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
