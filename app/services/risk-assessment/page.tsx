import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Lock, TrendingUp, FlaskConical, Gavel, CheckCircle, ShieldCheck, FileText, Briefcase, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Risk Assessment Services - The.RAM.PLC',
  description: 'Understand and mitigate risks with our advanced risk assessment services.',
};

const RiskAssessmentPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      {/* <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center text-center">
        <Image
          src="/images/risk-assessment-hero.jpg" // You'll need to add a suitable image here
          alt="Risk Assessment Services Hero"
          layout="fill"
          objectFit="cover"
          quality={90}
          className="absolute inset-0 z-0 opacity-70"
        />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
            Risk Assessment Services
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            Proactively Identifying and Mitigating Risks to Safeguard Your Future.
          </p>
        </div>
      </section> */}

      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <article className="prose dark:prose-invert max-w-none">
          {/* Original H1 removed as it's now in Hero */}
          {/* <h1 className="text-4xl font-extrabold text-teal-600 mb-6">Risk Assessment Services</h1> */}

          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Proactive Risk Identification and Mitigation</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              In an unpredictable business landscape, identifying and mitigating risks before they escalate is paramount.
              The.RAM.PLC's Risk Assessment Services provide a comprehensive framework to evaluate potential threats,
              analyze their impact, and develop robust strategies to safeguard your assets and operations.
              We help you understand your vulnerabilities and build resilience.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4 max-w-3xl mx-auto">
              Our approach combines sophisticated analytical tools with expert human insight. We delve into various facets
              of your organization, from operational processes and financial exposure to cyber security and compliance,
              to offer a holistic view of your risk profile. Our goal is to empower you with the knowledge and tools needed
              to make informed decisions and maintain stability.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Key Areas of Our Risk Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Operational Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Identifying inefficiencies, process failures, and human errors that could disrupt operations.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Financial Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Assessing market volatility, credit risks, liquidity issues, and investment exposures.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <Lock className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Cybersecurity Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Evaluating vulnerabilities in IT infrastructure, data breaches, and digital threats.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <Gavel className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Compliance & Regulatory Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Ensuring adherence to industry regulations and legal requirements to avoid penalties.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <FlaskConical className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Strategic Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Analyzing potential threats to business objectives, competitive landscape, and long-term growth.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Benefits of Partnering with The.RAM.PLC</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Expert Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Benefit from our team's deep expertise in various risk domains.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Customized Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Receive tailored risk assessment plans specific to your industry and business needs.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Actionable Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Get clear, practical recommendations for risk mitigation.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Enhanced Resilience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Strengthen your organization's ability to withstand unforeseen challenges.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Reputation Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Safeguard your brand and maintain stakeholder trust through proactive risk management.</p>
                </CardContent>
              </Card>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};

export default RiskAssessmentPage; 