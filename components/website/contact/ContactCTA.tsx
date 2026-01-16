"use client";

import Image from "next/image";

export default function ContactCTA() {
  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6 lg:mt-[-150px]">
      <div className="max-w-[95%] mx-auto">
        <div className="bg-gradient-to-r from-[#FBE8F4] to-[#DFF2F7] rounded-lg p-8 md:p-10 lg:p-12">
          <div className="text-left w-full">
            <h2 className="text-3xl sm:text-4xl md:text-3xl font-bold text-black mb-6">
              We're Social, Connect with us!
            </h2>
            <p className="text-black text-sm md:text-base leading-relaxed mb-8" style={{width: '45%'}}>
Join the Mecarvi Prints family - we'd love to connect with you! Follow us on social media to share your feedback, engage with our community, stay in the loop with important updates, giveaways, special offers and so much more.            </p>
            
            {/* Social Media Icons */}
            <div className="flex justify-start space-x-4 mb-8">
              <div className="w-full h-[107px] bg-white rounded-[10px] flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                <Image src="/assets/images/image-50.png" alt="Facebook" width={40} height={40} />
                <span className="text-black text-xs mt-2">Facebook</span>
              </div>
              
              <div className="w-full h-[107px] bg-white rounded-[10px] flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                <Image src="/assets/images/image-51.png" alt="Instagram" width={40} height={40} />
                <span className="text-black text-xs mt-2">Instagram</span>
              </div>
              <div className="w-full h-[107px] bg-white rounded-[10px] flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                <Image src="/assets/images/image-52.png" alt="TikTok" width={40} height={40} />
                <span className="text-black text-xs mt-2">TikTok</span>
              </div>
              <div className="w-full h-[107px] bg-white rounded-[10px] flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                <Image src="/assets/images/image-54.png" alt="YouTube" width={40} height={40} />
                <span className="text-black text-xs mt-2">YouTube</span>
              </div>
                 <div className="w-full h-[107px] bg-white rounded-[10px] flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                <Image src="/assets/images/image-53.png" alt="LinkedIn" width={40} height={40} />
                <span className="text-black text-xs mt-2">LinkedIn</span>
              </div>
              <div className="w-full h-[107px] bg-white rounded-[10px] flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                <Image src="/assets/images/image-55.png" alt="Twitter" width={40} height={40} />
                <span className="text-black text-xs mt-2">Twitter</span>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
    </section>
  );
}
