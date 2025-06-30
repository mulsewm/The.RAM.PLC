import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    location: "Dubai, UAE",
    image: "/placeholder-user.jpg",
    quote: "THE RAM PLC made my transition to Dubai seamless. Their expertise in healthcare visas was invaluable.",
  },
  {
    name: "Nurse Michael Chen",
    role: "ICU Specialist",
    location: "Abu Dhabi, UAE",
    image: "/placeholder-user.jpg",
    quote: "From application to approval, the process was smooth and professional. I'm grateful for their support.",
  },
  {
    name: "Dr. Aisha Patel",
    role: "Pediatrician",
    location: "Riyadh, KSA",
    image: "/placeholder-user.jpg",
    quote: "Their knowledge of GCC healthcare requirements made the visa process straightforward and efficient.",
  },
  {
    name: "Dr. James Wilson",
    role: "Surgeon",
    location: "Doha, Qatar",
    image: "/placeholder-user.jpg",
    quote: "The team's attention to detail and constant communication made me feel confident throughout the process.",
  },
]

export function SuccessStoriesSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-primary">Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from healthcare professionals who successfully obtained their visas through our services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <blockquote className="mb-4 text-gray-600">"{testimonial.quote}"</blockquote>
                  <div className="mt-auto">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 