"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface ClientLogosProps {
  className?: string
}

export default function ClientLogos({ className }: ClientLogosProps) {
  const clients = [
    {
      name: "Client 1",
      logo: "/logos/aafda_logo.jpg", 
      alt: "Client  logo"
    },
    {
      name: "Client 1",
      logo: "/logos/moh_black.png", 
      alt: "Client 1 logo"
    },
    {
      name: "Client 1",
      logo: "/logos/MLSD-logo.jpg", 
      alt: "Client 1 logo"
    },
    {
      name: "Client 1",
      logo: "/logos/oromia_health_bureau.png", 
      alt: "Client 1 logo"
    },
    {
      name: "Client 1",
      logo: "/logos/tikur_anbessa_logo.webp", 
      alt: "Client 1 logo"
    },
    {
      name: "Client 1",
      logo: "/logos/moe_logo.png", 
      alt: "Client 1 logo"
    },
    {
      name: "Client 1",
      logo: "/logos/ansr_health_bureao_logo.jpg",
      alt: "logo for ansr health"
    },
    {
      name: "Client 1",
      logo: "/logos/dubai-health-authority-logo-vector.png", 
      alt: "Client 1 logo"
    },
    {
      name: "Client 2",
      logo: "/logos/DataFlowGroup.png",
      alt: "Client 2 logo"
    },
    {
      name: "Client 3",
      logo: "/logos/UAE Minister Of health and prevention.png",
      alt: "Client 3 logo"
    },
    {
      name: "Client 4",
      logo: "/logos/nhra-logo-orginal-250.png",
      alt: "Client 4 logo"
    },
    {
      name: "Client 5",
      logo: "/logos/state-of-qatar-ministry-of-public-health-logo-vector-xs.png",
      alt: "Client 5 logo"
    },
    {
      name: "Client 6",
      logo: "/logos/UAE Minister Of health and prevention.png",
      alt: "Client 6 logo"
    },
  ]

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Hide default arrows, screenshot doesn't show them
    responsive: [
      {
        breakpoint: 1280, // Corresponds to Tailwind's 'xl' breakpoint
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024, // Corresponds to Tailwind's 'lg' breakpoint
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768, // Corresponds to Tailwind's 'md' breakpoint
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640, // Corresponds to Tailwind's 'sm' breakpoint
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <section id="our-clients" className={`py-16 bg-white dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Clients
          </h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-24 h-1 bg-teal-600 mx-auto mb-6" 
          ></motion.div>
          {/* Paragraph removed to match screenshot */}
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            We're proud to partner with these organizations to deliver exceptional services and solutions.
          </p>
        </motion.div>

        <div className="mt-8 relative pb-10"> {/* Added pb-10 to ensure space for dots below */}
          <Slider {...settings}>
            {clients.map((client, index) => (
              <div
                key={index}
                className="px-3" // Padding for spacing between slides
              >
                <div className="relative h-24 w-full flex items-center justify-center"> {/* Increased height */}
                  <Image
                    src={client.logo}
                    alt={client.alt}
                    fill
                    className="object-contain" 
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <style jsx global>{`
        .slick-slider {
          /* No specific margin-bottom here, parent div has padding-bottom */
        }
        .slick-dots {
          bottom: -15px; /* Adjust position of dots to be closer if parent has padding */
        }
        .slick-dots li button {
          padding: 5px; /* Increase clickable area for better UX */
        }
        .slick-dots li button:before {
          font-family: inherit; /* Attempt to inherit font, can be removed if default slick font is preferred */
          font-size: 0; /* Hide the default dot character (•) */
          display: inline-block;
          vertical-align: middle;
          height: 5px; /* Height of the custom dash */
          width: 20px; /* Width of inactive dashes */
          background-color: #99F6E4; /* Light Teal (Tailwind teal-200) */
          border-radius: 2.5px; /* Rounded ends for the dash */
          content: ''; /* Necessary for pseudo-elements with background */
          opacity: 0.75;
          transition: all 0.3s ease-in-out;
        }
        .slick-dots li.slick-active button:before {
          width: 35px; /* Width of the active dash (longer) */
          background-color: #0D9488; /* Darker Teal (Tailwind teal-600) */
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
