"use client"

import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 py-12 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          Choose the plan that's right for your business. Start with a free trial and upgrade anytime.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          <PricingCard
            title="Starter"
            description="Everything you need to get started."
            price={19}
            priceUnit="per month"
            features={[
              "Custom domains",
              "Edge content delivery",
              "Advanced analytics",
              "Quarterly workshops",
              "Single sign-on (SSO)",
              "Priority phone support",
            ]}
            buttonText="Start a free trial"
          />

          <PricingCard
            title="Growth"
            description="All the extras for your growing team."
            price={49}
            priceUnit="per month"
            features={[
              "Custom domains",
              "Edge content delivery",
              "Advanced analytics",
              "Quarterly workshops",
              "Single sign-on (SSO)",
              "Priority phone support",
            ]}
            buttonText="Start a free trial"
            isFeatured
          />

          <PricingCard
            title="Scale"
            description="Added flexibility at scale."
            price={99}
            priceUnit="per month"
            features={[
              "Custom domains",
              "Edge content delivery",
              "Advanced analytics",
              "Quarterly workshops",
              "Single sign-on (SSO)",
              "Priority phone support",
            ]}
            buttonText="Start a free trial"
          />
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Need a Custom Solution?</h2>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-6">
            Contact us for enterprise pricing and tailored features to meet your specific needs.
          </p>
          <Link href="/contact">
            <Button size="lg">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 