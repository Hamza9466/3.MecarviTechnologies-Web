"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CompanySectionData {
  company_title: string;
  company_description: string;
  company_image: string | null;
}

export default function AboutCompany() {
  const [data, setData] = useState<CompanySectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const getImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("/storage")) return `http://localhost:8000${url}`;
    return `http://localhost:8000/storage/${url}`;
  };

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/v1/about-company-section", {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.about_company_section) {
          const section = result.data.about_company_section;
          setData({
            company_title: section.company_title || "",
            company_description: section.company_description || "",
            company_image: getImageUrl(section.company_image),
          });
        }
      }
    } catch (err) {
      console.error("Error fetching company section:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
        <div className="text-gray-600 text-center">Loading...</div>
      </section>
    );
  }

  const displayData = data || {
    company_title: "About our Company",
    company_description: "Mecarvi Prints is an industry leading printing company that offers a comprehensive range of integrated advertising and marketing solutions. Started our journey of excellence a decade ago as R&G Multimedia Enterprise. Later in 2019, the founders saw an opportunity in the field and embarked on the path of innovation while rebranding R&G Multimedia Enterprise as Mecarvi Holding Corporation. Mecarvi brings concepts to life with its expertise, execution, and scale — all designed to enhance your brand's quality, elevate its engagement, save your time, and secure your money until complete satisfaction. Interpreting ideas is the core of what we do, and we're proud to say that we're true to our name. We design, print, and deliver over a million products to customers nationally, making us one of the industrie's leading printing companies. With a team of experts and state-of-the-art technology, we make sure that you get uncompromised quality without breaking your pocket. From the creatively independent small business to the multi-national companies that need high-end printing and advertising solutions, we are your own personal shop that's always open. We stand by the quality and timely delivery of our work and treat all your projects as if they were our own. Residing in the heart of Forest Park, Georgia, we are currently serving the entire USA, Canada, and the Caribbean. Also, our warehouses are located in Texas, California & Georgia with 323 skilled, professional, and dedicated employees worldwide. The technical capacity and experience of the team have allowed us to cater to 275,000 satisfied customers to date, while giving us the confidence to spread our wings across the globe as we love creating clever solutions, from print and promotional ideas to tailored marketing campaigns. Our progressive approach ensures that we are consistently delivering relevant and innovative products and services to our customers.",
    company_image: null,
  };

  return (
    <section className="bg-white py-16 sm:py-20 md:py-24 px-1 sm:px-2 md:px-4 lg:px-6">
      <div className="relative grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-0 min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
        {/* Left Panel - Dark Blue Background with Logo on Mobile */}
        <div className="bg-blue-900 p-8 md:p-12 lg:p-16 relative min-h-[300px] lg:min-h-0 flex items-center justify-center lg:block">
          {/* White Panel with Logo - Visible on mobile, positioned on desktop */}
          <div className="lg:absolute lg:top-1/2 lg:left-[calc(30%-4rem)] lg:-translate-y-1/2 lg:z-20 bg-white rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl max-w-lg w-full max-w-[90%] sm:max-w-[85%] md:max-w-[450px] lg:w-[500px] lg:max-w-none">
            <div className="relative w-full aspect-[4/2]">
              <div className="absolute inset-0 flex items-center justify-center">
                {displayData.company_image ? (
                  <img
                    src={displayData.company_image}
                    alt="Company Logo"
                    className="object-contain max-w-full max-h-full w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/yqMS5qrWhHsVPL5l1747744517.jpg";
                    }}
                  />
                ) : (
                  <Image
                    src="/assets/images/yqMS5qrWhHsVPL5l1747744517.jpg"
                    alt="Company Logo"
                    width={400}
                    height={400}
                    className="object-contain max-w-full max-h-full w-full h-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Light Blue Background with Text */}
        <div className="bg-blue-100 p-8 md:p-12 lg:p-16 flex items-start pt-8 lg:pt-12 w-full">
          <div className="w-full max-w-2xl ml-4 md:ml-8 lg:ml-22">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-4 sm:mb-6 md:mb-8">
              {displayData.company_title}
            </h2>
            <div className="text-blue-900 text-xs sm:text-sm md:text-base leading-relaxed space-y-0">
              {displayData.company_description.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className={index === 0 ? "mb-0" : ""}>
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
