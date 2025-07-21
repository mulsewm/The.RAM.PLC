'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  AlertCircle, 
  ArrowRight,
  Shield,
  Users,
  BookOpen,
  FileCheck,
  HelpCircle,
  Stethoscope,
  ClipboardCheck,
  FileSearch,
  FileSignature
} from 'lucide-react';

// Import components
import { FeeTable } from '@/components/pricing/fee-table';
import { CurrencySwitcher, CurrencyProvider, useCurrency } from '@/components/pricing/currency-switcher';
import { 
  InfoCallout, 
  WarningCallout, 
  SuccessCallout 
} from '@/components/pricing/callout';
import { Section } from '@/components/pricing/section';

// Import data
import { 
  nursingFees, 
  examFees, 
  dataFlowPackages,
  generalNotes,
  requiredDocuments,
  processSteps,
  serviceCharge
} from '@/data/pricingData';

// UI components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Helper component for process steps
const ProcessStep = ({ step, index }: { step: { title: string; description: string }, index: number }) => (
  <div className="relative pb-8">
    {index !== processSteps.length - 1 && (
      <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
    )}
    <div className="relative flex items-start">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50 ring-8 ring-white dark:ring-gray-900">
        <span className="text-teal-600 dark:text-teal-400 font-medium">{index + 1}</span>
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          {step.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {step.description}
        </p>
      </div>
    </div>
  </div>
);

function PricingContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('nursing');
  const { currency } = useCurrency();

  // Format currency based on selected currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Licensing Application Fees
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-teal-100">
              Transparent pricing for all your licensing needs. All fees are exclusive of 5% VAT.
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 text-base font-medium rounded-md shadow-lg"
                onClick={() => router.push('/contact')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-teal-700 hover:border-teal-700 px-8 py-3 text-base font-medium rounded-md"
                onClick={() => router.push('/faq')}
              >
                Have questions? <HelpCircle className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="text-teal-100 text-sm font-medium mr-2">Currency:</span>
                <CurrencySwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs Navigation */}
        <div className="mb-8">
          <Tabs defaultValue="nursing" onValueChange={setActiveTab} value={activeTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
                <TabsTrigger value="nursing" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Nursing
                </TabsTrigger>
                <TabsTrigger value="doctors" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Doctors
                </TabsTrigger>
                <TabsTrigger value="exams" className="flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Exam Fees
                </TabsTrigger>
                <TabsTrigger value="verification" className="flex items-center gap-2">
                  <FileSearch className="h-4 w-4" />
                  Verification
                </TabsTrigger>
              </TabsList>
              
              <div className="w-full sm:w-auto">
                <InfoCallout>
                  All fees are subject to change without prior notice. Please check with our team for the most current pricing.
                </InfoCallout>
              </div>
            </div>

            {/* Nursing Tab */}
            <TabsContent value="nursing" className="space-y-8">
              <Section title="Nursing Professionals" description="Comprehensive fee structure for nursing professionals seeking licensure.">
                <FeeTable 
                  fees={nursingFees} 
                  title="Nursing Application Fees"
                  description="Fees for nursing professionals applying for DHA, HAAD, and MOH licenses."
                  showTotal={true}
                />

                <div className="mt-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Service Charge</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{serviceCharge.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{serviceCharge.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                            {formatCurrency(serviceCharge[`amount${currency}` as keyof typeof serviceCharge] as number)}
                          </p>
                          {serviceCharge.note && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{serviceCharge.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="Important Notes">
                <WarningCallout>
                  <ul className="list-disc pl-5 space-y-2">
                    {generalNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </WarningCallout>
              </Section>
            </TabsContent>

            {/* Doctors Tab */}
            <TabsContent value="doctors" className="space-y-8">
              <Section title="Medical Professionals" description="Fee structure for doctors and physicians.">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-teal-50 dark:bg-teal-900/30 border-b border-teal-100 dark:border-teal-900">
                      <h3 className="text-lg font-medium text-teal-800 dark:text-teal-200">Physician</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        For medical doctors (MD, MBBS, etc.) applying for licensure.
                      </p>
                      <div className="space-y-4">
                        {dataFlowPackages
                          .filter(pkg => pkg.category === 'physician')
                          .map((pkg, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">{pkg.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                                    {formatCurrency(pkg[`price${currency}` as keyof typeof pkg] as number)}
                                  </p>
                                </div>
                              </div>
                              {pkg.note && (
                                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{pkg.note}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-teal-50 dark:bg-teal-900/30 border-b border-teal-100 dark:border-teal-900">
                      <h3 className="text-lg font-medium text-teal-800 dark:text-teal-200">Non-Physician</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        For other healthcare professionals (dentists, pharmacists, etc.).
                      </p>
                      <div className="space-y-4">
                        {dataFlowPackages
                          .filter(pkg => pkg.category === 'non-physician')
                          .map((pkg, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">{pkg.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                                    {formatCurrency(pkg[`price${currency}` as keyof typeof pkg] as number)}
                                  </p>
                                </div>
                              </div>
                              {pkg.note && (
                                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{pkg.note}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </TabsContent>

            {/* Exam Fees Tab */}
            <TabsContent value="exams" className="space-y-8">
              <Section title="Licensing Exam Fees" description="Fees for various licensing examinations.">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exam Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount ({currency})
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {Object.entries(examFees).map(([authority, exams]) => (
                        <>
                          <tr key={authority} className="bg-gray-50 dark:bg-gray-800">
                            <td colSpan={2} className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white uppercase">
                              {authority} Exams
                            </td>
                          </tr>
                          {Object.entries(exams).map(([examType, fee]) => (
                            <tr key={`${authority}-${examType}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {examType === 'general' ? 'General Exam' : 'Specialist Exam'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {authority} {examType === 'general' ? 'General' : 'Specialist'} Examination
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <span className="text-teal-600 dark:text-teal-400">
                                  {formatCurrency(fee[`amount${currency}` as keyof typeof fee] as number)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="Additional Exam Information">
                <div className="space-y-4">
                  <InfoCallout>
                    <p>Exam fees are non-refundable once scheduled. Please ensure you are fully prepared before booking your exam.</p>
                  </InfoCallout>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Exam Preparation</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Review the exam content outline provided by the licensing authority</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Complete all required training and education</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Take practice tests to assess your readiness</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ensure you have all required identification documents</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Section>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification" className="space-y-8">
              <Section title="Document Verification" description="Fees for document verification and processing.">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-teal-50 dark:bg-teal-900/30 border-b border-teal-100 dark:border-teal-900">
                      <h3 className="text-lg font-medium text-teal-800 dark:text-teal-200">DataFlow Verification</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Primary Source Verification (PSV) for your professional credentials.
                      </p>
                      <div className="space-y-4">
                        {dataFlowPackages
                          .filter(pkg => pkg.category === 'other')
                          .map((pkg, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">{pkg.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                                    {formatCurrency(pkg[`price${currency}` as keyof typeof pkg] as number)}
                                  </p>
                                </div>
                              </div>
                              {pkg.requirements && pkg.requirements.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Includes:</p>
                                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                    {pkg.requirements.map((req, i) => (
                                      <li key={i} className="flex items-start">
                                        <Check className="h-3 w-3 text-teal-500 mr-1 mt-0.5 flex-shrink-0" />
                                        <span>{req}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                      <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900">
                        <h3 className="text-lg font-medium text-amber-800 dark:text-amber-200">Required Documents</h3>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-3">
                          {requiredDocuments.map((doc, index) => (
                            <li key={index} className="flex items-start">
                              <FileSignature className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                      <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900">
                        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Verification Process</h3>
                      </div>
                      <div className="p-6">
                        <div className="flow-root">
                          <ul role="list" className="-mb-8">
                            {processSteps.map((step, index) => (
                              <li key={index}>
                                <ProcessStep step={step} index={index} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20 lg:px-16">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-6 text-teal-100">
                  Contact our team today to discuss your specific requirements and get personalized assistance with your licensing process.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:ml-8">
                <Button
                  size="lg"
                  className="bg-white text-teal-700 hover:bg-gray-100 px-8 py-3 text-base font-medium rounded-md shadow-lg"
                  onClick={() => router.push('/contact')}
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Find answers to common questions about our services and fees.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div>
                <dt className="text-lg font-medium text-gray-900 dark:text-white">
                  What payment methods do you accept?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  We accept all major credit cards, bank transfers, and online payment gateways. Payment plans are available for certain services.
                </dd>
              </div>

              <div>
                <dt className="text-lg font-medium text-gray-900 dark:text-white">
                  Are the fees refundable?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  Application and processing fees are non-refundable. Exam fees may be refundable if canceled within the specified period before the exam date.
                </dd>
              </div>

              <div>
                <dt className="text-lg font-medium text-gray-900 dark:text-white">
                  How long does the verification process take?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  The verification process typically takes 4-6 weeks, but may vary depending on the response time from educational institutions and licensing bodies.
                </dd>
              </div>

              <div>
                <dt className="text-lg font-medium text-gray-900 dark:text-white">
                  Do you offer expedited processing?
                </dt>
                <dd className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  Yes, expedited processing is available for an additional fee. Contact our team for more information.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <CurrencyProvider>
      <PricingContent />
    </CurrencyProvider>
  );
}
