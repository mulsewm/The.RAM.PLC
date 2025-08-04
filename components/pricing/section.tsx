import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

interface SubsectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export function Subsection({ title, children, className = '', id }: SubsectionProps) {
  return (
    <div id={id} className={`mb-12 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

export function PricingSection({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`mb-12 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2">
        {title}
      </h2>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {children}
        </div>
      </div>
    </section>
  );
}
