"use client";

import { useState, useEffect } from "react";

interface SocialMediaSection {
  id: number;
  heading: string | null;
  description: string | null;
  is_active: boolean;
}

interface SocialLink {
  id: number;
  platform_name: string;
  platform_url: string;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
}

// Default colors for social platforms
const getPlatformColor = (platformName: string): string => {
  const name = platformName.toLowerCase();
  if (name.includes('facebook')) return '#1877F2';
  if (name.includes('instagram')) return '#E4405F';
  if (name.includes('tiktok')) return '#000000';
  if (name.includes('youtube')) return '#FF0000';
  if (name.includes('linkedin')) return '#0077B5';
  if (name.includes('twitter') || name.includes('x')) return '#1DA1F2';
  return '#6366F1'; // Default color
};

// Helper function to get image URL
const getImageUrl = (iconPath: string | null | undefined): string | null => {
  if (!iconPath) return null;
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath;
  }
  // Remove leading '/storage/' or 'storage/' if present
  let cleanPath = iconPath;
  if (cleanPath.startsWith('/storage/')) {
    cleanPath = cleanPath.substring(9);
  } else if (cleanPath.startsWith('storage/')) {
    cleanPath = cleanPath.substring(8);
  }
  // Remove leading slash if present
  cleanPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
  return `http://localhost:8000/storage/${cleanPath}`;
};

export default function ContactCTA() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [section, setSection] = useState<SocialMediaSection | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/v1/social-media", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            if (data.data.social_media_section) {
              setSection(data.data.social_media_section);
            }
            if (data.data.social_links) {
              const activeLinks = data.data.social_links
                .filter((link: SocialLink) => link.is_active)
                .sort((a: SocialLink, b: SocialLink) => a.sort_order - b.sort_order);
              setLinks(activeLinks);
            } else {
              setLinks([]);
            }
          } else {
            setSection(null);
            setLinks([]);
          }
        } else if (response.status === 401) {
          // Handle 401 gracefully - show default content
          console.warn("Unauthorized access to social media API (401). Showing default content.");
          setSection(null);
          setLinks([]);
        } else {
          console.error("Failed to fetch social media:", response.status);
          setSection(null);
          setLinks([]);
        }
      } catch (err) {
        console.error("Error fetching social media:", err);
        setSection(null);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  // Default content if API data is not available
  const heading = section?.heading || "We're Social, Connect with us!";
  const description = section?.description || "Join the Mecarvi Prints family - we'd love to connect with you! Follow us on social media to share your feedback, engage with our community, stay in the loop with important updates, giveaways, special offers and so much more.";

  return (
    <section className="bg-white pt-15 pb-4 sm:pb-6 md:pb-8 px-1   sm:px-2 md:px-4 lg:px-6" data-aos="fade-up">
      <div className="max-w-[95%] mx-auto ">
        <div className="bg-gradient-to-r from-[#FBE8F4] to-[#DFF2F7] rounded-lg pt-4 pb-4 px-8 md:pt-6 md:pb-6 md:px-10 lg:pt-8 lg:pb-8 lg:px-12">
          <div className="text-left w-full">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                <p className="mt-4 text-gray-600">Loading social media...</p>
              </div>
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl md:text-3xl font-bold text-black mb-6">
                  {heading}
                </h2>
                <p className="text-black text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
                  {description}
                </p>

                {/* Social Media Icons */}
                {links.length > 0 ? (
                  <div className="flex justify-start mb-8 flex-wrap gap-6 sm:gap-8">
                    {links.map((link) => {
                      const iconUrl = getImageUrl(link.icon);
                      const platformColor = getPlatformColor(link.platform_name);
                      const cardId = `link-${link.id}`;

                      return (
                        <a
                          key={link.id}
                          href={link.platform_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-full h-[107px] cursor-pointer block mx-auto sm:mx-0"
                          style={{ perspective: '1000px', maxWidth: '190px', width: '100%' }}
                          onMouseEnter={() => setHoveredCard(cardId)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <div
                            className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out"
                            style={{
                              transformStyle: 'preserve-3d',
                              transform: hoveredCard === cardId ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}
                          >
                            {/* Front of card */}
                            <div
                              className="absolute inset-0 w-full h-full bg-white rounded-[10px] flex flex-col items-center justify-center backface-hidden shadow-lg"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden'
                              }}
                            >
                              {iconUrl ? (
                                <img src={iconUrl} alt={link.platform_name} width={40} height={40} className="object-contain" />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">{link.platform_name.charAt(0)}</span>
                                </div>
                              )}
                              <span className="text-black text-xs mt-2 font-medium">
                                {link.platform_name}
                              </span>
                            </div>

                            {/* Back of card */}
                            <div
                              className="absolute inset-0 w-full h-full rounded-[10px] flex flex-col items-center justify-center backface-hidden shadow-xl"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                backgroundColor: platformColor
                              }}
                            >
                              {iconUrl ? (
                                <img src={iconUrl} alt={link.platform_name} width={40} height={40} className="object-contain" />
                              ) : (
                                <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                                  <span className="text-white text-xs">{link.platform_name.charAt(0)}</span>
                                </div>
                              )}
                              <span className="text-white text-xs mt-2 font-medium">Follow</span>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No social media links available.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
