"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, LogIn, Handshake } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PartnershipModal } from "@/components/partnership-modal"

type NavItem = {
  name: string
  href: string
  submenu?: NavItem[]
  isActive?: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  { 
    name: "Home", 
    href: "/",
    isActive: (pathname) => pathname === "/"
  },
  { 
    name: "About", 
    href: "/about",
    isActive: (pathname) => pathname.startsWith("/about"),
    submenu: [
      { 
        name: "Our Story", 
        href: "/about#story",
        isActive: (pathname) => pathname === "/about" || pathname === "/about#story"
      },
      { 
        name: "Team", 
        href: "/about#team",
        isActive: (pathname) => pathname === "/about#team"
      },
      { 
        name: "Values", 
        href: "/about#values",
        isActive: (pathname) => pathname === "/about#values"
      },
    ]
  },
  { 
    name: "Visa Services", 
    href: "/visa-services",
    isActive: (pathname) => pathname.startsWith("/visa-services"),
    submenu: [
      { 
        name: "Overview", 
        href: "/visa-services",
        isActive: (pathname) => pathname === "/visa-services"
      },
      { 
        name: "Requirements", 
        href: "/visa-services/requirements",
        isActive: (pathname) => pathname === "/visa-services/requirements"
      },
      { 
        name: "Success Stories", 
        href: "/visa-services/testimonials",
        isActive: (pathname) => pathname === "/visa-services/testimonials"
      }
    ]
  },
  { 
    name: "Services", 
    href: "/services",
    isActive: (pathname) => pathname.startsWith("/services"),
    submenu: [
      { 
        name: "Verification", 
        href: "/services/verification",
        isActive: (pathname) => pathname === "/services/verification"
      },
      { 
        name: "Risk Assessment", 
        href: "/services/risk-assessment",
        isActive: (pathname) => pathname === "/services/risk-assessment"
      },
      { 
        name: "Data Analytics", 
        href: "/services/data-analytics",
        isActive: (pathname) => pathname === "/services/data-analytics"
      },
    ]
  },
  { 
    name: "Contact", 
    href: "/contact",
    isActive: (pathname) => pathname.startsWith("/contact")
  },
]

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu and submenus when route changes
  useEffect(() => {
    setIsMobileOpen(false)
    setOpenSubmenu(null)
    
    // Handle smooth scrolling for anchor links
    if (pathname) {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        }
      }
    }
  }, [pathname])

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    // Close submenu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null)
      }
    }

    document.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [scrolled])

  // Debug: Log when the hamburger / close icon is clicked and the resulting state
  const toggleMobileMenu = () => {
    console.log("[MainNav] Hamburger icon clicked. Previous isMobileOpen:", isMobileOpen)
    setIsMobileOpen((prev) => {
      const next = !prev
      console.log("[MainNav] Setting isMobileOpen to:", next)
      return next
    })
  };

  // Close mobile menu when clicking outside or navigating
  useEffect(() => {
    console.log("[MainNav] isMobileOpen changed:", isMobileOpen)
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('button[aria-expanded]')) {
        setIsMobileOpen(false);
      }
    };

    // Close menu when route changes
    const handleRouteChange = () => {
      setIsMobileOpen(false);
    };

    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('popstate', handleRouteChange);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleRouteChange);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, pathname]);

  const isItemActive = (item: NavItem) => {
    if (item.isActive) return item.isActive(pathname)
    return pathname === item.href || pathname.startsWith(`${item.href}/`)
  }

  const hasActiveSubmenu = (item: NavItem) => {
    return item.submenu?.some(subItem => isItemActive(subItem)) || false
  }

  return (
    <div
      ref={navRef}
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-background/90 backdrop-blur-md' : 'bg-background/80',
        'border-b border-border/50'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2" aria-label="Home">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              The.RAM
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isItemActive(item) || hasActiveSubmenu(item)
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-haspopup={item.submenu ? 'true' : undefined}
                aria-expanded={item.submenu && openSubmenu === item.name ? 'true' : 'false'}
              >
                {item.name}
                {item.submenu && (
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                )}
              </Link>

              {item.submenu && (
                <div 
                  className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-popover p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby={`${item.name}-button`}
                >
                  <div className="py-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'block px-4 py-2 text-sm rounded-md transition-colors',
                          isItemActive(subItem)
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                        role="menuitem"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/account-creation" className="hidden md:block">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Button 
            onClick={() => {
              const modal = document.getElementById('partnership-modal') as HTMLButtonElement;
              modal?.click();
            }}
            size="sm"
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Handshake className="mr-2 h-4 w-4" />
            Become a Partner
          </Button>
          <PartnershipModal />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden space-x-2">
          <Link href="/account-creation" className="hidden sm:block">
            <Button variant="outline" size="sm" className="text-sm">
              Sign In
            </Button>
          </Link>
          <button
            type="button"
            className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground 
                       hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileOpen}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-navigation"
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="sr-only">{isMobileOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

  
      {/* Mobile Navigation rendered via portal to escape any clipping context */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                key="mobile-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                ref={mobileMenuRef}
                className="md:hidden fixed inset-0 pt-16 bg-background/95 backdrop-blur-sm overflow-y-auto z-[60]"
                onClick={(e) => e.stopPropagation()}
                id="mobile-navigation"
              >
                <nav className="flex flex-col h-full" aria-label="Main navigation">
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                    {/* Navigation Items */}
                    {navItems.map((item) => (
                      <div key={item.name} className="space-y-1">
                        {/* Navigation item markup retained as-is */}
                        <div className="flex items-center justify-between">
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-colors',
                              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                              isItemActive(item) || hasActiveSubmenu(item)
                                ? 'bg-accent text-accent-foreground font-semibold'
                                : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground'
                            )}
                            onClick={(e) => {
                              if (item.submenu) {
                                e.preventDefault();
                                setOpenSubmenu(openSubmenu === item.name ? null : item.name);
                              } else {
                                setIsMobileOpen(false);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (item.submenu) {
                                  setOpenSubmenu(openSubmenu === item.name ? null : item.name);
                                } else {
                                  setIsMobileOpen(false);
                                  router.push(item.href);
                                }
                              }
                            }}
                            aria-expanded={item.submenu ? openSubmenu === item.name : undefined}
                            aria-haspopup={item.submenu ? 'menu' : undefined}
                            aria-current={isItemActive(item) ? 'page' : undefined}
                          >
                            {item.name}
                            {item.submenu && (
                              <ChevronDown
                                className={cn(
                                  'ml-2 h-4 w-4 transition-transform',
                                  openSubmenu === item.name ? 'rotate-180' : ''
                                )}
                                aria-hidden="true"
                              />
                            )}
                          </Link>
                        </div>

                        {/* Submenu Items */}
                        {item.submenu && (
                          <AnimatePresence>
                            {openSubmenu === item.name && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className="pl-4 space-y-1 overflow-hidden"
                              >
                                {item.submenu.map((subItem) => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={cn(
                                      'block px-4 py-2 text-sm rounded-lg transition-colors',
                                      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                                      isItemActive(subItem)
                                        ? 'bg-accent text-accent-foreground font-medium'
                                        : 'text-foreground hover:bg-accent/50 hover:text-accent-foreground'
                                    )}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsMobileOpen(false);
                                    }}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Sign In & Become a Partner Buttons */}
                  <div className="p-4 border-t border-border space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsMobileOpen(false);
                        router.push('/account-creation');
                      }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => {
                        setIsMobileOpen(false);
                        const modal = document.getElementById('partnership-modal') as HTMLButtonElement;
                        modal?.click();
                      }}
                    >
                      <Handshake className="mr-2 h-4 w-4" />
                      Become a Partner
                    </Button>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}
