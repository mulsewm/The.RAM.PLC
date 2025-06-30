import { Card, CardContent } from "@/components/ui/card"

const processSteps = [
  {
    step: 1,
    title: "Online Application",
    description: "Complete our comprehensive online application form with your professional details.",
  },
  {
    step: 2,
    title: "Document Submission",
    description: "Upload all required documents through our secure portal.",
  },
  {
    step: 3,
    title: "Application Review",
    description: "Our team reviews your application and verifies all documentation.",
  },
  {
    step: 4,
    title: "Initial Assessment",
    description: "Preliminary evaluation of your qualifications and eligibility.",
  },
  {
    step: 5,
    title: "Authority Processing",
    description: "Submission to relevant health authorities for official processing.",
  },
  {
    step: 6,
    title: "Visa Issuance",
    description: "Upon approval, visa is issued and sent to you electronically.",
  },
]

export function VisaProcessSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-primary">Visa Application Process</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes obtaining your healthcare visa simple and efficient.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <h3 className="font-semibold text-xl mb-3 pr-8 text-primary">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 