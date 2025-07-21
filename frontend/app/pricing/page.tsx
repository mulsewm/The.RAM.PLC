'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Syringe, 
  FileText, 
  Award, 
  Check, 
  AlertCircle, 
  ArrowRight,
  Shield,
  Users,
  BookOpen,
  FileCheck,
  Globe,
  Clock,
  HelpCircle
} from 'lucide-react';

// Import our new components
import { PricingCard } from '@/components/pricing/pricing-card';
import { PricingGrid, PricingSection } from '@/components/pricing/pricing-grid';
import { FeeTable } from '@/components/pricing/fee-table';
import { CurrencySwitcher, CurrencyProvider } from '@/components/pricing/currency-switcher';
import { 
  InfoCallout, 
  WarningCallout, 
  SuccessCallout 
} from '@/components/pricing/callout';
import { Section, Subsection } from '@/components/pricing/section';

// Import data
import { 
  nursingFees, 
  examFees, 
  dataFlowPackages,
  generalNotes,
  requiredDocuments,
  processSteps
} from '@/data/pricingData';

// Import UI components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PricingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('nursing');

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <Section 
          variant="highlighted"
          title="Transparent Pricing for Healthcare Professionals"
          description="Choose the right package for your career advancement. All fees are clearly listed with no hidden costs."
          action={<CurrencySwitcher />}
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200 mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Secure and Transparent Pricing
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We believe in complete transparency. No hidden fees, no surprises.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg shadow-teal-500/20"
                  onClick={() => router.push('/contact')}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-gray-300 dark:border-gray-600"
                  onClick={() => router.push('/faq')}
                >
                  Have Questions?
                  <HelpCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Main Pricing Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Currency Switcher */}
          <div className="flex justify-end mb-8">
            <CurrencySwitcher />
          </div>

          {/* Navigation Tabs */}
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mb-12"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="nursing" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Nursing
              </TabsTrigger>
              <TabsTrigger value="exams" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Exams
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Verification
              </TabsTrigger>
            </TabsList>

            {/* Nursing Tab */}
            <TabsContent value="nursing">
              <Section title="Nursing Professionals" description="Comprehensive fee structure for nursing professionals across all authorities">
                <div className="space-y-8">
                  <InfoCallout>
                    <p>Fees are subject to change based on regulatory authority requirements. Contact us for the most up-to-date information.</p>
                  </InfoCallout>
                  
                  <Subsection title="DHA Nursing Fees" columns={3}>
                    {nursingFees
                      .filter(fee => fee.authority === 'DHA')
                      .map((fee, index) => (
                        <PricingCard
                          key={index}
                          title={fee.name}
                          description={fee.description}
                          fees={fee.items}
                          tags={[fee.authority]}
                          variant={fee.popular ? 'primary' : 'default'}
                          icon={<Syringe className="h-5 w-5" />}
                        />
                      ))}
                  </Subsection>

                  <Subsection title="DOH Nursing Fees" columns={3}>
                    {nursingFees
                      .filter(fee => fee.authority === 'DOH')
                      .map((fee, index) => (
                        <PricingCard
                          key={index}
                          title={fee.name}
                          description={fee.description}
                          fees={fee.items}
                          tags={[fee.authority]}
                          variant={fee.popular ? 'primary' : 'default'}
                          icon={<Syringe className="h-5 w-5" />}
                        />
                      ))}
                  </Subsection>
                </div>
              </Section>
            </TabsContent>

            {/* Exams Tab */}
            <TabsContent value="exams">
              <Section title="Exam Preparation" description="Comprehensive exam preparation materials and practice tests">
                <div className="space-y-8">
                  <WarningCallout>
                    <p>Exam fees are non-refundable. Please ensure you meet all eligibility criteria before registering.</p>
                  </WarningCallout>
                  
                  <Subsection columns={2}>
                    {Object.entries(examFees).map(([examType, fees], index) => (
                      <FeeTable
                        key={index}
                        title={examType}
                        fees={fees}
                        showTotal
                        className="h-full"
                      />
                    ))}
                  </Subsection>
                </div>
              </Section>
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification">
              <Section title="Document Verification" description="Primary Source Verification (PSV) for your credentials">
                <div className="space-y-8">
                  <SuccessCallout>
                    <p>Our verification process is 100% secure and recognized by all major healthcare authorities.</p>
                  </SuccessCallout>
                  
                  <Subsection columns={3}>
                    {dataFlowPackages.map((pkg, index) => (
                      <PricingCard
                        key={index}
                        title={pkg.title}
                        description={pkg.description}
                        fees={[
                          {
                            name: 'Verification Fee',
                            amountAED: pkg.priceAED,
                            amountQAR: pkg.priceQAR,
                            amountETB: pkg.priceETB,
                            note: pkg.note
                          }
                        ]}
                        tags={pkg.tags}
                        variant={pkg.popular ? 'primary' : 'default'}
                        icon={<Award className="h-5 w-5" />}
                      />
                    ))}
                  </Subsection>
                </div>
              </Section>
            </TabsContent>
          </Tabs>

          {/* Additional Information */}
          <Section title="Important Information" variant="muted">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Required Documents
                </h3>
                <ul className="space-y-3">
                  {requiredDocuments.map((doc, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Process Timeline
                </h3>
                <ol className="space-y-4">
                  {processSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-teal-600 dark:text-teal-400 font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{step.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Section>
          
          {/* CTA Section */}
          <Section className="text-center">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/30 dark:to-blue-900/20 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Our team is here to guide you through every step of the process.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg shadow-teal-500/20"
                  onClick={() => router.push('/contact')}
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-gray-300 dark:border-gray-600"
                  onClick={() => router.push('/faq')}
                >
                  View FAQs
                  <HelpCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </CurrencyProvider>
  );
}
