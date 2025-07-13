import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, TrendingUp, Users, Workflow, BarChart2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Analytics Services - The.RAM.PLC',
  description: 'Unlock insights from your data with our advanced data analytics services.',
};

const DataAnalyticsPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      {/* <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center text-center">
        <Image
          src="/images/data-analytics-hero.jpg" // You'll need to add a suitable image here
          alt="Data Analytics Services Hero"
          layout="fill"
          objectFit="cover"
          quality={90}
          className="absolute inset-0 z-0 opacity-70"
        />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
            Data Analytics Services
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            Transforming Raw Data into Actionable Intelligence.
          </p>
        </div>
      </section> */}

      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <article className="prose dark:prose-invert max-w-none">
          {/* Original H1 removed as it's now in Hero */}
          {/* <h1 className="text-4xl font-extrabold text-teal-600 mb-6">Data Analytics Services</h1> */}

          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Transforming Data into Actionable Intelligence</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              In the era of big data, the ability to extract meaningful insights is a powerful competitive advantage.
              The.RAM.PLC's Data Analytics Services empower your organization to transform raw data into actionable
              intelligence, driving smarter decisions and fostering innovation.
              We help you uncover hidden patterns, trends, and correlations within your data.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4 max-w-3xl mx-auto">
              Our data analytics solutions range from descriptive analytics (what happened?) to predictive analytics
              (what will happen?) and prescriptive analytics (what should you do?). We utilize state-of-the-art tools and
              techniques, including machine learning and artificial intelligence, to deliver comprehensive analysis and
              clear visualizations. Let us help you harness the full potential of your data.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Our Data Analytics Offerings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Business Intelligence (BI)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Creating interactive dashboards and reports for performance monitoring and strategic planning.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Predictive Modeling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Forecasting future trends and outcomes to enable proactive decision-making.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Customer Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Understanding customer behavior, preferences, and segmentation for targeted marketing.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <Workflow className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Operational Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Optimizing operational efficiency, supply chain, and resource allocation.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Data Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Presenting complex data in intuitive and easy-to-understand visual formats.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Why Choose The.RAM.PLC for Data Analytics?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Data Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Our team comprises seasoned data scientists and analysts.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Cutting-Edge Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">We employ the latest analytics platforms and technologies.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Customized Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Solutions are tailored to your unique business challenges and goals.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                    <Workflow className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Actionable Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">We provide clear, practical steps based on data-driven insights.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                    <BarChart2 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Scalable Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Our services are designed to grow with your data needs.</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default DataAnalyticsPage; 