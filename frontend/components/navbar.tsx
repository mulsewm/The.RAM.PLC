"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { PartnerCTA } from "./partner-cta"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const pathname = usePathname()
  const isVisaRoute = pathname.startsWith('/visa-services')

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { 
      name: "Visa", 
      href: "/visa-services",
      submenu: [
        { name: "Overview", href: "/visa-services" },
        { name: "Requirements", href: "/visa-services/requirements" },
        { name: "Success Stories", href: "/visa-services/testimonials" }
      ]
    },
    { name: "Services", href: "#services" },
    { name: "Clients", href: "#our-clients" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            the.<span className="text-teal-600">RAM</span>.plc
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => link.submenu ? (
            <div key={link.name} className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-teal-400 transition-colors">
                <span>{link.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {link.submenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={link.name}
              href={link.href}
              className="text-gray-700 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <PartnerCTA variant="primary" />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              {navLinks.map((link) => link.submenu ? (
                <div key={link.name} className="space-y-2">
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  <div className="ml-4 space-y-2">
                    {link.submenu.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block py-1 text-gray-600 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-700 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="pt-4 space-y-2">
              <PartnerCTA variant="primary" />
              <Button className="bg-teal-600 hover:bg-teal-700 text-white w-full">Get in Touch</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
