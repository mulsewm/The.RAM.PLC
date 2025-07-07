import Link from "next/link"
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Documentation", href: "/docs" },
        { name: "Support", href: "/support" },
      ],
    },
  ]

  const socialLinks = [
    {
      name: 'Facebook', 
      href: 'https://facebook.com',
      icon: Facebook,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      icon: Twitter,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: 'mailto:info@theramplc.com',
      icon: Mail,
    },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 w-full">
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-400">Email: info@theramplc.com</p>
              <p className="text-sm text-gray-400">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12">
        <div className="mx-auto max-w-7xl px-6 py-6 md:flex md:items-center md:justify-between lg:px-8">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} The.RAM.PLC. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
