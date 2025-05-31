import Link from "next/link"
import { Linkedin, Twitter, Facebook, MessageCircle, Handshake } from "lucide-react"
import { PartnerCTA } from "./partner-cta"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/international-license-opportunity-ilo/about/",
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      name: "Telegram",
      url: "https://t.me/+Aq_kzbRBSJgyOTVk",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      name: "Twitter",
      url: "#",
      icon: <Twitter className="h-5 w-5" />,
    },
    {
      name: "Facebook",
      url: "#",
      icon: <Facebook className="h-5 w-5" />,
    },
  ]

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-white">
                the.<span className="text-teal-400">RAM</span>.plc
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Premier consultancy firm in Africa, providing verification, analytics, and risk assessment services.
            </p>
            <div className="flex space-x-3 mb-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-400">© {currentYear} the.RAM.plc. All rights reserved.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#home" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li className="flex items-center">
                <Handshake className="h-4 w-4 mr-1 text-teal-400" />
                <PartnerCTA variant="link" size="sm" showIcon={false} className="p-0 h-auto text-gray-400 hover:text-teal-400 transition-colors" />
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Primary Source Verification
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Background Screening
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Mystery Shopping
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Data Analytics
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Risk Assessment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">Bole Road, Addis Ababa, Ethiopia</p>
              <p className="mb-2">Phone: +251 93 700 3478</p>
              <p className="mb-2">Email: info@theramplc.com</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            Designed with ❤️ for the.RAM.plc |{" "}
            <Link href="#" className="hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link href="#" className="hover:text-teal-400 transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
