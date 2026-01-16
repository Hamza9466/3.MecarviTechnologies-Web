export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Step 1 Heading",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium hic consectetur provident, saepe eaque reprehenderit possimus unde porro, doloremque optio odit et rem id quos sunt enim! Dolore, a possimus.",
    },
    {
      id: 2,
      title: "Step 2 Heading",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium hic consectetur provident, saepe eaque reprehenderit possimus unde porro, doloremque optio odit et rem id quos sunt enim! Dolore, a possimus.",
    },
    {
      id: 3,
      title: "Step 3 Heading",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium hic consectetur provident, saepe eaque reprehenderit possimus unde porro, doloremque optio odit et rem id quos sunt enim! Dolore, a possimus.",
    },
    {
      id: 4,
      title: "Step 4 Heading",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium hic consectetur provident, saepe eaque reprehenderit possimus unde porro, doloremque optio odit et rem id quos sunt enim! Dolore, a possimus.",
    },
  ];

  return (
    <section className="bg-white px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Title */}
        <h2 className="text-gray-900 text-center text-3xl sm:text-4xl md:text-5xl font-bold">
          How It Works
        </h2>

        {/* Timeline and Cards Container */}
        <div className="relative">
          {/* Steps Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className={`relative ${step.id === 2 || step.id === 4 ? 'mt-16' : ''}`}>
                {/* Step Card */}
                <div className={`${step.id === 1 ? 'bg-[#F3F5FF]' : 'bg-white'} rounded-lg p-6 md:p-8 shadow-lg ${step.id === 1 ? 'h-90' : step.id === 3 ? 'h-90' : 'h-full'}`}>
                  {/* Number Badge */}
                  <div className={`inline-block rounded px-3 py-1 text-sm font-semibold mb-4 ${step.id === 1 ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'}`}>
                    0{step.id}
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl md:text-2xl font-bold mb-4 ${step.id === 1 ? 'text-black' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm md:text-base leading-relaxed ${step.id === 1 ? 'text-black' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
                
                {/* Dotted Lines */}
                {step.id === 1 && (
                  <>
                    <div className="absolute top-6 left-[calc(100%+2rem)] w-16 border-t-2 border-dotted border-black"></div>
                    <div className="absolute top-6 left-[calc(100%+2rem+4rem)] h-20 border-l-2 border-dotted border-black"></div>
                  </>
                )}
                {step.id === 2 && (
                  <>
                    <div className="absolute bottom-6 left-[calc(100%+2rem)] w-16 border-t-2 border-dotted border-black"></div>
                    <div className="absolute bottom-6 left-[calc(100%+2rem+4rem)] h-20 border-l-2 border-dotted border-black"></div>
                  </>
                )}
                {step.id === 3 && (
                  <>
                    <div className="absolute top-6 left-[calc(100%+2rem)] w-16 border-t-2 border-dotted border-black"></div>
                    <div className="absolute top-6 left-[calc(100%+2rem+4rem)] h-20 border-l-2 border-dotted border-black"></div>
                  </>
                )}
              </div>
            ))}
          </div>

          </div>
      </div>
    </section>
  );
}

