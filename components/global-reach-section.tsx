"use client"

import { motion } from "framer-motion"

type CountryMarker = {
  id: string
  name: string
  top: string
  left: string
  flag: string
  isCore?: boolean
}

export default function GlobalReachSection() {
  // Global coverage areas for the.RAM.plc with focus on Africa and Eastern Europe
  const countries: CountryMarker[] = [
    // Africa (Core Focus)
    { id: 'ethiopia', name: 'Ethiopia', top: '70%', left: '70%', flag: '🇪🇹', isCore: true },
    { id: 'kenya', name: 'Kenya', top: '75%', left: '69%', flag: '🇰🇪' },
    { id: 'nigeria', name: 'Nigeria', top: '68%', left: '52%', flag: '🇳🇬' },
    { id: 'south-africa', name: 'South Africa', top: '85%', left: '62%', flag: '🇿🇦' },
    { id: 'egypt', name: 'Egypt', top: '53%', left: '65%', flag: '🇪🇬' },
    { id: 'ghana', name: 'Ghana', top: '70%', left: '48%', flag: '🇬🇭' },
    { id: 'tanzania', name: 'Tanzania', top: '78%', left: '67%', flag: '🇹🇿' },
    
    // Eastern Europe (Key Focus)
    { id: 'ukraine', name: 'Ukraine', top: '40%', left: '62%', flag: '🇺🇦' },
    { id: 'poland', name: 'Poland', top: '38%', left: '57%', flag: '🇵🇱' },
    { id: 'romania', name: 'Romania', top: '42%', left: '60%', flag: '🇷🇴' },
    { id: 'bulgaria', name: 'Bulgaria', top: '45%', left: '61%', flag: '🇧🇬' },
    { id: 'serbia', name: 'Serbia', top: '43%', left: '59%', flag: '🇷🇸' },
    
    // Middle East
    { id: 'uae', name: 'UAE', top: '58%', left: '72%', flag: '🇦🇪' },
    { id: 'ksa', name: 'Saudi Arabia', top: '60%', left: '68%', flag: '🇸🇦' },
    { id: 'qatar', name: 'Qatar', top: '58%', left: '71%', flag: '🇶🇦' },
    
    // Rest of the World
    { id: 'uk', name: 'United Kingdom', top: '35%', left: '47%', flag: '🇬🇧' },
    { id: 'germany', name: 'Germany', top: '38%', left: '53%', flag: '🇩🇪' },
    { id: 'france', name: 'France', top: '40%', left: '49%', flag: '🇫🇷' },
    { id: 'usa', name: 'USA', top: '45%', left: '20%', flag: '🇺🇸' },
    { id: 'india', name: 'India', top: '60%', left: '80%', flag: '🇮🇳' },
    { id: 'china', name: 'China', top: '50%', left: '85%', flag: '🇨🇳' }
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }
  
  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center mb-12"
        >
          <motion.div className="text-center mb-12">
            <motion.p 
              variants={fadeIn}
              className="text-teal-600 dark:text-teal-400 font-medium mb-2"
            >
              GLOBAL REACH
            </motion.p>
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Our Worldwide Presence
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              With a strong presence across Africa, Eastern Europe, and beyond, we bring global expertise with a focus on emerging markets. Ethiopia serves as our strategic hub for African operations.
            </motion.p>
          </motion.div>
          
          {/* Country List */}
          <motion.div 
            className="flex flex-wrap justify-center gap-2 md:gap-4 text-white/80 text-sm md:text-base mb-12"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            {countries.map((country, index) => (
              <span key={country.id} className="flex items-center">
                {country.flag} {country.name}
                {index < countries.length - 1 && (
                  <span className="mx-2 text-white/30">|</span>
                )}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Map Container */}
        <div className="relative h-[600px] w-full max-w-6xl mx-auto">
          {/* World Map Background */}
          <div className="absolute inset-0 bg-[url('/world-map-detailed.svg')] bg-contain bg-center bg-no-repeat opacity-90 dark:opacity-30"></div>
          
          {/* Country Markers */}
          {countries.map((country) => (
            <motion.div
              key={country.id}
              className="absolute flex flex-col items-center group"
              style={{
                top: country.top,
                left: country.left,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: Math.random() * 0.3 
              }}
            >
              <div className="relative">
                <div className={`absolute -inset-2 ${country.isCore ? 'bg-orange-500/30' : 'bg-teal-400/30'} rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`w-3 h-3 ${country.isCore ? 'bg-orange-500' : 'bg-teal-600 dark:bg-teal-400'} rounded-full relative z-10 border-2 border-white dark:border-gray-800 transition-transform group-hover:scale-125`}></div>
              </div>
              <motion.div 
                className="mt-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: 0.3 + Math.random() * 0.2 }}
              >
                {country.flag} {country.name}
              </motion.div>
            </motion.div>
          ))}
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 650" preserveAspectRatio="none">
            {countries.map((country) => {
              const x1 = 50;
              const y1 = 50;
              const x2 = parseInt(country.left);
              const y2 = parseInt(country.top);
              
              return (
                <line
                  key={`line-${country.id}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  strokeDasharray="4 2"
                />
              );
            })}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}
