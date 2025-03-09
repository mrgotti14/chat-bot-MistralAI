'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionNav = motion.nav;

export default function Navbar() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MotionNav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50"
    >
      <div className="absolute inset-0 bg-[#1C1D1F]/50 backdrop-blur-xl"></div>
      <div className="container mx-auto px-4">
        <div className="relative flex justify-between items-center py-4">
          <Link href="/" className="relative group">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A435F0] to-[#8710E0]">
                GOTTI
              </span>
              <span className="text-2xl font-bold text-white">AI</span>
            </div>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A435F0] to-[#8710E0] transition-all duration-300 group-hover:w-full"></div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: "Fonctionnalités", id: "features" },
              { name: "Tarifs", id: "pricing" },
              { name: "FAQ", id: "faq" }
            ].map((item) => (
              <button 
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="relative group"
              >
                <span className="text-sm font-medium text-gray-300 transition-colors group-hover:text-white">
                  {item.name}
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A435F0] to-[#8710E0] transition-all duration-300 group-hover:w-full"></div>
              </button>
            ))}
            <Link 
              href="/auth/login" 
              className="relative px-6 py-2 overflow-hidden group"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#A435F0] to-[#8710E0] transition-all duration-300 ease-out group-hover:w-full"></div>
              <div className="relative flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  Connexion
                </span>
                <svg 
                  className="w-4 h-4 text-white transform transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MotionNav>
  );
} 