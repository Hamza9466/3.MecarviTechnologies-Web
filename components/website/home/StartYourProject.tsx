import Link from "next/link";
import Image from "next/image";

export default function StartYourProject() {
  return (
    <section className="pt-16 sm:pt-20 md:pt-24 pb-0 px-1 sm:px-2 md:px-4 lg:px-6" style={{ background: 'linear-gradient(to bottom, #1e3a8a, #000000)' }}>
      <div className="max-w-[95%] mx-auto">
        {/* Top Section */}
        <div className="text-center mb-12 md:mb-16">
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-pink-500 mb-4">
            Start Your Project updated
          </h2>
          
          {/* Sub-heading */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white mb-8">
            Get the Signs You Need, at the Right Price
          </p>

          {/* Descriptive Paragraph */}
          <div className="max-w-[95%] mx-auto text-left mb-8">
            <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
              We're here to help. Take the first step by sharing a few details
              about your project, and We'll provide a tailored estimate that's
              that's accurate, fair, and aligned with your budget. Great signage
              begins with clear communication—and that includes pricing. Our
              streamlined process makes it easy to bring your vision to life
              with transparent, upfront estimates. No pressure. No surprises.
              Just honest, expert guidance every step of the way
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href="/quote"
            className="inline-block bg-pink-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-lg font-semibold text-base md:text-lg hover:bg-pink-600 transition-colors"
          >
            Quote Request
          </Link>
        </div>

        {/* Two Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mt-12 md:mt-16">
          {/* Left Card - Dark Green */}
          <div className="bg-[#2d5016] p-8 md:p-10 lg:p-12 text-white">
            {/* Rocket Icon */}
            <div className="flex justify-center mb-6">
              <Image
                src="/assets/images/GiA4NqVyqXzhHKCZ1747744517.png"
                alt="Rocket icon"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>

            {/* Headline */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-6">
              Start Now, Pay Later -
            </h3>

            {/* Body Text */}
            <p className="text-sm md:text-base leading-relaxed text-center">
              Mecarvi Advantage Credit makes it easier to move forward with the signage solutions you need—without the upfront cash flow strain. Our in-house financing is built to align with your budget, offering the flexibility to start your project now and pay over time. With a simplified process and strong approval support, Mecarvi Advantage Credit gives you the confidence to invest in your brand without delay or uncertainty.
            </p>
          </div>

          {/* Right Card - Pink/Magenta */}
          <div className="bg-[#E60F77] p-8 md:p-10 lg:p-12 text-white">
            {/* Rocket Icon */}
            <div className="flex justify-center mb-6">
              <Image
                src="/assets/images/GiA4NqVyqXzhHKCZ1747744517.png"
                alt="Rocket icon"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            </div>

            {/* Headline */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 md:mb-6">
              Start Now, Pay Later -
            </h3>

            {/* Body Text */}
            <p className="text-sm md:text-base leading-relaxed text-center">
              Mecarvi Advantage Credit makes it easier to move forward with the signage solutions you need—without the upfront cash flow strain. Our in-house financing is built to align with your budget, offering the flexibility to start your project now and pay over time. With a simplified process and strong approval support, Mecarvi Advantage Credit gives you the confidence to invest in your brand without delay or uncertainty.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

