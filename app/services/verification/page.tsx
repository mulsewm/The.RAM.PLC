import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShieldCheck, UserCheck, FileText, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verification Services - The.RAM.PLC',
  description: 'Learn about our comprehensive verification services.',
};

const VerificationPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      {/* <section className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center text-center">
        <Image
          src="/images/verification-hero.jpg" // You'll need to add a suitable image here
          alt="Verification Services Hero"
          layout="fill"
          objectFit="cover"
          quality={90}
          className="absolute inset-0 z-0 opacity-70"
        />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
            Verification Services
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            Ensuring Accuracy and Building Trust Through Meticulous Verification.
          </p>
        </div>
      </section> */}

      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <article className="prose dark:prose-invert max-w-none">
          {/* Original H1 removed as it's now in Hero */}
          {/* <h1 className="text-4xl font-extrabold text-teal-600 mb-6">Verification Services</h1> */}

          <section className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Our Commitment to Accuracy and Trust</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              At The.RAM.PLC, our Verification Services are designed to provide unparalleled accuracy and build unwavering trust.
              In today's complex world, verifying information is crucial for informed decision-making, whether for employment,
              partnerships, or personal assurances. We employ rigorous methodologies and cutting-edge technology to authenticate
              documents, credentials, and claims, ensuring you have a clear and reliable picture.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4 max-w-3xl mx-auto">
              Our dedicated team of experts meticulously cross-references data from multiple reputable sources, adhering
              to the highest standards of integrity and confidentiality. We understand the sensitive nature of verification,
              and our processes are streamlined to be efficient while maintaining thoroughness. With The.RAM.PLC, you gain
              peace of mind knowing that your decisions are backed by verifiable facts.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Types of Verification We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Background Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Comprehensive verification of employment history, educational qualifications, and criminal records.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Document Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Validating the authenticity of official documents such as passports, licenses, and certificates.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Identity Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Confirming the true identity of individuals through robust digital and traditional methods.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Reference Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Contacting provided references to verify professional conduct and stated abilities.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Business Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Assessing the legitimacy and operational status of businesses for partnerships and investments.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">Why Choose The.RAM.PLC for Verification?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Expert Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Our specialists are highly trained in forensic verification and data analysis.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Advanced Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">We leverage the latest tools to ensure efficient and accurate verification.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Confidentiality</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">All information is handled with the utmost discretion and security.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Global Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">Our capabilities extend internationally, allowing for verification across borders.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Customized Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">We tailor our verification processes to meet your specific needs and industry requirements.</p>
                </CardContent>
              </Card>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
};

export default VerificationPage; 