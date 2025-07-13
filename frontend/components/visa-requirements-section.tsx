import { Card, CardContent } from "@/components/ui/card"

const requirements = [
  {
    title: "Valid Passport",
    description: "Passport with minimum 6 months validity",
    icon: "📘",
  },
  {
    title: "Professional Qualifications",
    description: "Degree certificates and transcripts",
    icon: "🎓",
  },
  {
    title: "Experience Certificates",
    description: "Proof of relevant work experience",
    icon: "📜",
  },
  {
    title: "Medical License",
    description: "Current professional license/registration",
    icon: "⚕️",
  },
  {
    title: "Medical Reports",
    description: "Recent health examination results",
    icon: "🏥",
  },
  {
    title: "Professional Photos",
    description: "Passport-sized photographs",
    icon: "📸",
  },
  {
    title: "CV/Resume",
    description: "Detailed professional background",
    icon: "📄",
  },
  {
    title: "Police Clearance",
    description: "Criminal record check certificate",
    icon: "🔍",
  },
]

export function VisaRequirementsSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-foreground">Visa Requirements Checklist</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Ensure you have all the necessary documents ready for a smooth visa application process.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {requirements.map((req, index) => (
            <Card key={index} className="h-full w-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 rounded-xl active:scale-95">
              <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{req.icon}</div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-base sm:text-lg text-foreground">{req.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{req.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 