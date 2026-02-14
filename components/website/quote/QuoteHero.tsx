"use client";

export default function CareerHero() {
  return (
    <section className="py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 relative overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[400px] bg-white">
      {/* Background with curve */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        <svg viewBox="0 0 1440 800" className="w-full h-full" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id="careerCurveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7E03C3" />
              <stop offset="100%" stopColor="#BF03B5" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L1440,0 L1440,650 L0,800 Z"
            fill="url(#careerCurveGradient)"
            stroke="none"
            vectorEffect="non-scaling-stroke"
            className="w-full h-full"
          />
        </svg>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        {/* Main Title - centered on x and y */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" data-aos="fade-up">
          Request a Quote
        </h1>
      </div>
    </section>
  );
}
