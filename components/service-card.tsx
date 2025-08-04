"use client"

interface ServiceCardProps {
  title: string
  desc: string
}

export default function ServiceCard({ title, desc }: ServiceCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded shadow p-6 flex flex-col h-full">
      <h3 className="font-bold text-teal-600 dark:text-teal-300 mb-2 text-lg">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm flex-1">{desc}</p>
      <a href="#contact" className="mt-4 inline-block text-teal-700 dark:text-teal-300 font-semibold hover:underline">Learn More</a>
    </div>
  )
}
