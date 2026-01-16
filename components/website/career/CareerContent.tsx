import Image from "next/image";

export default function CareerContent() {
  return (
    <section className="bg-white pt-16 sm:pt-20 md:pt-24 pb-0 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="max-w-[95%] mx-auto">
        {/* Text Content */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Start Your Career At Mecarvi Prints
            <span className="block w-32 h-1 bg-pink-500 mx-auto mt-2"></span>
          </h2>
          
          <div className="w-full text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
            <p>
              Strategies, products and systems are all very important, but success comes from bringing the right people together. At Mecarvi our culture of growth starts with our people. We look for employees who are smart, creative, empathetic, and fun. Once they're part of our team, we support them by giving them opportunities to grow. At Mecarvi, we recognize that employment is a two-way street and that jobs only work when they are mutually beneficial. Our core values articulate what we care about most. They guide how we work with each other, with our clients, and our partners. And most importantly, they help us become a better organization as a whole which serves its community. As an employer, Mecarvi understands its responsibility of treating its team with respect, empathy, care and consideration. We offer a wide range of benefits to our employees including market competitive salaries, health care, retirement funds, paid leaves, bonuses, employee discounts and much more. When we find the right people, we empower them to implement decisions on their own. If you want to work for a company that gives you the autonomy to explore and implement new ideas in a highly collaborative environment, you will succeed here. Join us!
            </p>
          </div>
        </div>

        {/* Mask-group Image */}
        <div className="relative w-full">
          <Image
            src="/assets/images/Mask-group.png"
            alt="Career Content"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}

