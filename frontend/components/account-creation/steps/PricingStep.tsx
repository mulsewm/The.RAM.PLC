"use client"

import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const PricingStep = () => {
  return (
    <div className="py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-16 max-w-3xl mx-auto">
          Choose the plan that's right for your business. Start with a free trial and upgrade anytime.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-12">
          <PricingCard
            title="Starter"
            description="Everything you need to get started with essential features for your healthcare professional journey."
            price={19}
            priceUnit="per month"
            features={[
              "Basic profile management",
              "Access to visa requirements guide",
              "Standard email support",
              "Community forum access",
              "Basic document upload (5 documents)",
              "Monthly newsletter updates",
            ]}
            buttonText="Start your journey"
          />

          <PricingCard
            title="Growth"
            description="All the extras for your growing needs, perfect for professionals seeking broader support."
            price={49}
            priceUnit="per month"
            features={[
              "Enhanced profile management",
              "Priority access to visa requirements",
              "Personalized email support",
              "Live chat support (during business hours)",
              "Advanced document management (20 documents)",
              "Quarterly career webinars",
              "Express visa application tips",
            ]}
            buttonText="Upgrade to Growth"
            isFeatured
          />

          <PricingCard
            title="Scale"
            description="Added flexibility and premium support at scale, designed for comprehensive career advancement."
            price={99}
            priceUnit="per month"
            features={[
              "Premium profile and networking features",
              "Dedicated visa processing specialist",
              "24/7 priority phone & email support",
              "Access to exclusive workshops & resources",
              "Unlimited document storage",
              "Personalized career coaching sessions",
              "Expedited application review",
            ]}
            buttonText="Go Premium"
          />
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Need a Custom Solution?</h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Contact us for enterprise pricing and tailored features to meet your specific needs and large-scale requirements.
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingStep; 