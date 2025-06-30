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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-primary">Visa Requirements Checklist</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ensure you have all the necessary documents ready for a smooth visa application process.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {requirements.map((req, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{req.icon}</div>
                <h3 className="font-semibold mb-2 text-primary">{req.title}</h3>
                <p className="text-sm text-gray-600">{req.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 