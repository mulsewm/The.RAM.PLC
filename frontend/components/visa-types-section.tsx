import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, Users, Heart, ArrowRight } from "lucide-react"

const visaTypes = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "Employment Visa",
    subtitle: "UAE | KSA | Qatar | Oman",
    features: [
      "Work Permit & Residency Processing",
      "Medical Fitness Test & Emirates ID (UAE)",
      "Labor Contract & Ministry Approval",
      "Visa Stamping & Activation"
    ]
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Private Sector Visa (PSV)",
    subtitle: "Fast Hiring Solution",
    features: [
      "Direct Sponsorship by Private Hospitals",
      "No Long Waits – Priority Processing",
      "Ideal for Nurses, Doctors & Technicians",
      "Streamlined Approval Process"
    ]
  },
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Family Sponsorship Visa",
    subtitle: "Bring Your Loved Ones",
    features: [
      "Spouse & Children Visa Assistance",
      "Medical Insurance & Schooling Support",
      "Complete Family Relocation Support",
      "Housing & Settlement Guidance"
    ]
  },
  {
    icon: <ArrowRight className="h-8 w-8 text-primary" />,
    title: "Visit Visa Conversion",
    subtitle: "Switch to Work Visa",
    features: [
      "Tourist/Visit Visa to Employment Visa",
      "Avoid Exit Requirements",
      "UAE Flexi Permit Option Available",
      "Fast Track Processing"
    ]
  }
]

export function VisaTypesSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Healthcare Visa Types</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose from our range of specialized visa options designed for healthcare professionals seeking opportunities in the GCC region.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visaTypes.map((visa, index) => (
            <Card key={index} className="h-full hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  {visa.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{visa.title}</h3>
                <p className="text-sm text-primary mb-4 font-medium">{visa.subtitle}</p>
                <ul className="space-y-3 mt-2">
                  {visa.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-sm text-muted-foreground">
                      <svg
                        className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 