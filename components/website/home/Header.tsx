"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Thin dark gray line at top - hide when scrolled */}
      {!isScrolled && <div className="h-0.5 bg-gray-900"></div>}
      
      {/* Gradient background */}
      <div 
        className={`${isScrolled ? "bg-white shadow-md" : ""} py-3 px-1 md:px-2 lg:px-4 overflow-visible transition-all duration-1000`}
        style={!isScrolled ? { background: "linear-gradient(to right, #7E03C3, #C503B4)" } : {}}
      >
        <div className="max-w-[95%] mx-auto flex items-center justify-between relative min-h-[63px]">
          {/* Logo on Left */}
          <Link href="/" className="flex items-center z-10">
            <Image
              src="/assets/images/logo.webp"
              alt="Mecarvi Technologies Logo"
              width={130}
              height={120}
              className="max-h-10 sm:max-h-12 w-auto object-contain"
            />
          </Link>

          {/* Centered Navigation Panel - Hidden on mobile/tablet */}
          <nav 
            className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 top-1/3 -translate-y-1/2 rounded-none rounded-bl-2xl rounded-br-2xl px-4 xl:px-8 py-6 xl:py-10 items-center gap-3 xl:gap-6 z-20 whitespace-nowrap transition-all duration-1000`} 
            style={{ 
              borderTopLeftRadius: 0, 
              borderTopRightRadius: 0,
              backgroundImage: 'url(/assets/images/Rectangle-28.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '755px',              marginTop: '10px',
            }}
          >
            <Link 
              href="/" 
              className={`text-xs lg:ps-3 xl:text-sm font-medium pt-1 transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname === "/" ? "font-semibold" : ""
              }`}
            >
              Home
            </Link>

            <Link 
              href="/website/pages/about" 
              className={`text-xs xl:text-sm font-medium pt-1 transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname === "/website/pages/about" ? "font-semibold" : ""
              }`}
            >
              About us
            </Link>

            <Link 
              href="/website/pages/faq" 
              className={`text-xs xl:text-sm font-medium pt-1 transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname === "/website/pages/faq" ? "font-semibold" : ""
              }`}
            >
              FAQ
            </Link>

            <Link 
              href="/website/pages/quote" 
              className={`text-xs xl:text-sm font-medium pt-1 transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname === "/website/pages/quote" ? "font-semibold" : ""
              }`}
            >
              Quote
            </Link>

            <Link 
              href="/products" 
              className={`flex items-center pt-1 gap-1 xl:gap-1.5 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname?.startsWith("/products") ? "font-semibold" : ""
              }`}
            >
              Products
              <svg className="w-3 h-3 xl:w-4 xl:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            <Link 
              href="/service" 
              className={`flex items-center pt-1 gap-1 xl:gap-1.5 text-xs xl:text-sm font-medium transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname === "/service" ? "font-semibold" : ""
              }`}
            >
              Service
              <svg className="w-3 h-3 xl:w-4 xl:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          
            <Link 
              href="/technologies" 
              className={`text-xs xl:text-sm font-medium pt-1 transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname === "/technologies" ? "font-semibold" : ""
              }`}
            >
              Technologies
            </Link>

            <Link 
              href="/website/pages/career" 
              className={`text-xs xl:text-sm font-medium pt-1 transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname === "/website/pages/career" ? "font-semibold" : ""
              }`}
            >
              Career
            </Link>
         
            <Link 
              href="/website/pages/contact" 
              className={`text-xs xl:text-sm font-medium pt-1 transition-colors whitespace-nowrap text-black hover:text-gray-700 ${
                pathname === "/website/pages/contact" ? "font-semibold" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Backdrop */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-[63px]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 py-4 px-2 border-t">
              <div className="flex flex-col gap-2 max-h-[80vh] overflow-y-auto">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/" ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  Home
                </Link>
                <Link 
                  href="/website/pages/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/website/pages/about" ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  About us
                </Link>
                <Link 
                  href="/website/pages/faq" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/website/pages/faq" ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  FAQ
                </Link>
                <Link 
                  href="/website/pages/quote" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/website/pages/quote" ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  Quote
                </Link>
                <Link 
                  href="/products" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname?.startsWith("/products") ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  Products
                </Link>
                <Link 
                  href="/service" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/service" ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  Service
                </Link>
                <Link 
                  href="/technologies" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/technologies" ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  Technologies
                </Link>
                <Link 
                  href="/website/pages/career" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/website/pages/career" ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  Career
                </Link>
                <Link 
                  href="/website/pages/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === "/website/pages/contact" ? "text-orange-600 bg-orange-50 font-semibold" : "text-black hover:bg-gray-100"
                  }`}
                >
                  Contact
                </Link>
              </div>
            </nav>
          )}

          {/* Right Side - CTA Button and Menu Icon */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 z-10">
            {/* Try For Free Button - Hidden on mobile, visible on tablet+ */}
            <button 
              className="hidden sm:flex items-center gap-1.5 md:gap-2 text-white px-3 sm:px-4 md:px-6 py-2 md:py-2.5 rounded-full hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium"
              style={{ background: 'linear-gradient(to right, #FD02A9, #7E03C3)' }}
            >
              <span className="hidden md:inline">Try For Free</span>
              <span className="md:hidden">Try Free</span>
              <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Login Button */}
            <button 
              onClick={() => router.push("/login")}
              className="px-5 sm:px-4 py-2.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity min-w-[70px] sm:min-w-auto"
              style={{ background: 'linear-gradient(to right, #FD02A9, #7E03C3)' }}
            >
              <span className="hidden sm:inline">Login</span>
              <span className="sm:hidden">Log</span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-6 h-6 flex flex-col justify-center gap-1.5 relative z-30"
              aria-label="Toggle mobile menu"
            >
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ color: isScrolled || isMobileMenuOpen ? '#000' : '#fff' }}></span>
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} style={{ color: isScrolled || isMobileMenuOpen ? '#000' : '#fff' }}></span>
              <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ color: isScrolled || isMobileMenuOpen ? '#000' : '#fff' }}></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}