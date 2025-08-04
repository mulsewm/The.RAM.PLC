import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Terms and Conditions | RAM PLC',
  description: 'Terms and conditions for using our services',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
          <CardDescription>Last Updated: July 29, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-justify">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using the services provided by the.RAM.plc, you agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Services Description</h2>
            <p className="mb-4">
              the.RAM.plc provides data analytics, risk assessment, verification, and visa-related services. 
              We reserve the right to modify or discontinue any service at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
            <p className="mb-4">
              To access certain features, you may be required to create an account. You are responsible for maintaining 
              the confidentiality of your account information and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Data Protection</h2>
            <p className="mb-4">
              We are committed to protecting your personal information in accordance with our Privacy Policy. 
              By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
            <p className="mb-4">
              All content, including text, graphics, logos, and software, is the property of RAM PLC or its licensors 
              and is protected by intellectual property laws. Unauthorized use may violate copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
            <p className="mb-4">
              RAM PLC shall not be liable for any indirect, incidental, special, or consequential damages resulting from 
              the use or inability to use our services, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">7. Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], 
              without regard to its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will provide notice of significant changes 
              through our website or via email. Continued use of our services after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
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
