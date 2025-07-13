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
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-primary">Visa Application Process</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes obtaining your healthcare visa simple and efficient.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {processSteps.map((step, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow rounded-xl active:scale-95 w-full">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
                <div className="absolute top-4 right-4 w-7 h-7 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                  {step.step}
                </div>
                <h3 className="font-semibold text-base sm:text-xl mb-2 sm:mb-3 pr-0 text-primary w-full text-center">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 w-full text-center">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 