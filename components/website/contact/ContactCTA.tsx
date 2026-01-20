"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContactCTA() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const socialCards = [
    { id: 'facebook', name: 'Facebook', image: '/assets/images/image-50.png', color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', image: '/assets/images/image-51.png', color: '#E4405F' },
    { id: 'tiktok', name: 'TikTok', image: '/assets/images/image-52.png', color: '#000000' },
    { id: 'youtube', name: 'YouTube', image: '/assets/images/image-54.png', color: '#FF0000' },
    { id: 'linkedin', name: 'LinkedIn', image: '/assets/images/image-53.png', color: '#0077B5' },
    { id: 'twitter', name: 'Twitter', image: '/assets/images/image-55.png', color: '#1DA1F2' }
  ];

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 lg:mt-[-150px]">
      <div className="max-w-[95%] mx-auto">
        <div className="bg-gradient-to-r from-[#FBE8F4] to-[#DFF2F7] rounded-lg p-8 md:p-10 lg:p-12">
          <div className="text-left w-full">
            <h2 className="text-3xl sm:text-4xl md:text-3xl font-bold text-black mb-6">
              We're Social, Connect with us!
            </h2>
            <p className="text-black text-sm md:text-base leading-relaxed mb-8" style={{ width: '45%' }}>
              Join the Mecarvi Prints family - we'd love to connect with you! Follow us on social media to share your feedback, engage with our community, stay in the loop with important updates, giveaways, special offers and so much more.
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-start space-x-4 mb-8">
              {socialCards.map((card) => (
                <div
                  key={card.id}
                  className="relative w-full h-[107px] cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: hoveredCard === card.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
                    }}
                  >
                    {/* Front of card */}
                    <div
                      className="absolute inset-0 w-full h-full bg-white rounded-[10px] flex flex-col items-center justify-center backface-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden'
                      }}
                    >
                      <Image src={card.image} alt={card.name} width={40} height={40} />
                      <span className="text-black text-xs mt-2 font-medium">
                        {card.name}
                      </span>
                    </div>

                    {/* Back of card */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-[10px] flex flex-col items-center justify-center backface-hidden"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        backgroundColor: card.color
                      }}
                    >
                      <Image src={card.image} alt={card.name} width={40} height={40} />
                      <span className="text-white text-xs mt-2 font-medium">Follow</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
