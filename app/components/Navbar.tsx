'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const MotionNav = motion.nav;

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A435F0] to-[#8710E0]">
                GOTTI
              </span>
              <span className="text-xl sm:text-2xl font-bold text-white">AI</span>
            </div>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A435F0] to-[#8710E0] transition-all duration-300 group-hover:w-full"></div>
          </Link>
          
          {/* Menu mobile */}
          <button 
            className="md:hidden relative z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between relative">
              <span className={`w-full h-0.5 bg-white transition-all duration-300 origin-top-right ${isMobileMenuOpen ? 'rotate-45 translate-y-[0.5px] translate-x-[-1px]' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 translate-x-3' : ''}`}></span>
              <span className={`w-full h-0.5 bg-white transition-all duration-300 origin-bottom-right ${isMobileMenuOpen ? '-rotate-45 translate-y-[-0.5px] translate-x-[-1px]' : ''}`}></span>
            </div>
          </button>
          
          {/* Menu mobile overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-[#1C1D1F]/95 z-40 md:hidden">
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                {[
                  { name: "Fonctionnalités", id: "features" },
                  { name: "Tarifs", id: "pricing" },
                  { name: "FAQ", id: "faq" }
                ].map((item) => (
                  <button 
                    key={item.name}
                    onClick={() => {
                      scrollToSection(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="relative group"
                  >
                    <span className="text-lg font-medium text-gray-300 transition-colors group-hover:text-white">
                      {item.name}
                    </span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A435F0] to-[#8710E0] transition-all duration-300 group-hover:w-full"></div>
                  </button>
                ))}
                {session?.user ? (
                  <button
                    onClick={() => {
                      router.push('/chat');
                      setIsMobileMenuOpen(false);
                    }}
                    className="relative group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#A435F0] group-hover:ring-[#8710E0] transition-all">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#A435F0] flex items-center justify-center text-white font-semibold">
                            {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors">
                        Chat
                      </span>
                    </div>
                  </button>
                ) : (
                  <Link 
                    href="/auth/login" 
                    className="relative px-6 py-2 overflow-hidden group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#A435F0] to-[#8710E0] transition-all duration-300 ease-out group-hover:w-full"></div>
                    <div className="relative flex items-center gap-2">
                      <span className="text-lg font-medium text-white">
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
                )}
              </div>
            </div>
          )}

          {/* Menu desktop */}
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
            {session?.user ? (
              <button
                onClick={() => router.push('/chat')}
                className="relative group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#A435F0] group-hover:ring-[#8710E0] transition-all">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#A435F0] flex items-center justify-center text-white font-semibold">
                        {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    Chat
                  </span>
                  <svg 
                    className="w-4 h-4 text-gray-300 group-hover:text-white transform transition-all duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </MotionNav>
  );
} 