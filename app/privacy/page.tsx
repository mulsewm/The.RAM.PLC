import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy | RAM PLC',
  description: 'How we collect, use, and protect your personal information',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>Last Updated: July 29, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-justify">
          <section>
            <p className="mb-4">
              At the.RAM.plc, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p className="mb-4">
              We may collect the following types of information when you use our services:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Personal Information: Name, email address, phone number, and other contact details.</li>
              <li>Account Information: Username, password, and other authentication details.</li>
              <li>Usage Data: Information about how you interact with our services.</li>
              <li>Device Information: IP address, browser type, operating system, and device identifiers.</li>
              <li>Documents: Any files or documents you upload as part of our verification services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <p className="mb-4">We may use your information to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send technical notices, updates, and security alerts</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission 
              or electronic storage is completely secure, so we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information only for as long as necessary to provide our services, 
              comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify any personal information that is inaccurate</li>
              <li>Request deletion of your personal information</li>
              <li>Restrict or object to processing of your personal information</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Third-Party Services</h2>
            <p className="mb-4">
              We may employ third-party companies and individuals to facilitate our services, provide services on our behalf, 
              perform service-related services, or assist us in analyzing how our services are used. These third parties 
              have access to your personal information only to perform these tasks on our behalf and are obligated not to 
              disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not directed to individuals under the age of 16. We do not knowingly collect personal 
              information from children under 16. If we become aware that we have collected personal information from 
              a child under 16, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy 
              Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: info@theramplc.com
              <br />
              Address: Addis Ababa, Ethiopia
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
