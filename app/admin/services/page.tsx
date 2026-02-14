"use client";

import React, { useState, useEffect } from 'react';
import { apiUrl } from "@/lib/api";
import AdminTabs from "@/components/admin/AdminTabs";
import HeroSectionEditor from '@/components/admin/services/HeroSectionEditor';
import FeaturesSectionEditor from '@/components/admin/services/FeaturesSectionEditor';
import AnalyticsEditor from '@/components/admin/services/AnalyticsEditor';
import ChartSectionEditor from '@/components/admin/services/ChartSectionEditor';
import ChartEditor from '@/components/admin/services/ChartEditor';
import TabSectionEditor from '@/components/admin/services/TabSectionEditor';
import ShowcaseSectionEditor from '@/components/admin/services/ShowcaseSectionEditor';
import TabEditor from '@/components/admin/services/TabEditor';
import ShowcaseEditor from '@/components/admin/services/ShowcaseEditor';
import ComingSoonEditor from "@/components/admin/services/ComingSoonEditor";

export default function ServicesPageEditor() {
  const [activeTab, setActiveTab] = useState('Hero Section');
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Service Hero Section State
  const [heroData, setHeroData] = useState({
    heading: 'Our Services',
    subheading: 'Professional IT Solutions',
    description: 'We provide comprehensive technology solutions to help your business grow',
    is_active: true
  });

  // Hero Section State - Start empty, load from API
  const [heroSectionData, setHeroSectionData] = useState<any[]>([]);

  // Features Sections State
  const [featuresSectionsData, setFeaturesSectionsData] = useState<FeaturesSectionData[]>([]);

  interface FeaturesSectionData {
    id?: number;
    section_title: string;
    subtitle: string;
    title: string;
    description: string;
    features: { title: string; description: string }[];
    main_image?: string;
    small_image?: string;
    main_image_file?: File;
    small_image_file?: File;
    created_at?: string;
    updated_at?: string;
  }

  // Analytics Sections State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSectionData[]>([]);

  interface AnalyticsSectionData {
    id?: number;
    section_title: string;
    subtitle: string;
    title: string;
    description: string;
    features: { title: string; description: string }[];
    button_text?: string;
    button_url?: string;
    main_image?: string;
    small_image?: string;
    main_image_file?: File;
    small_image_file?: File;
    created_at?: string;
    updated_at?: string;
  }

  // Chart Sections State
  const [chartSectionsData, setChartSectionsData] = useState<ChartSectionData[]>([]);

  interface ChartSectionData {
    id?: number;
    section_title: string;
    subtitle: string;
    title: string;
    description: string;
    features: { title: string; description: string }[];
    button_text?: string;
    button_url?: string;
    main_image?: string;
    small_image?: string;
    main_image_file?: File;
    small_image_file?: File;
    created_at?: string;
    updated_at?: string;
  }

  // Chart Section State
  const [chartData, setChartData] = useState({
    sectionTitle: 'Performance Charts',
    title: 'Track your progress with detailed analytics',
    subtitle: 'Performance metrics',
    description: 'Monitor key performance indicators and gain valuable insights into your business operations. Our comprehensive dashboard provides real-time data visualization and reporting tools to help you make informed decisions.',
    features: [
      'Comprehensive data visualization tools',
      'Customizable reports and dashboards',
      'Real-time performance monitoring'
    ],
    buttonText: 'View Charts',
    buttonUrl: '/charts',
    mainImage: '/assets/images/Chart.png',
    smallImage: '/assets/images/12.png'
  });

  // Tab Sections State
  const [tabSectionsData, setTabSectionsData] = useState<TabSectionData[]>([]);

  interface TabSectionData {
    id?: number;
    section_title: string;
    section_description: string;
    tabs: {
      id?: number;
      tab_title: string;
      tab_icon?: string;
      tab_icon_file?: File;
      tab_content?: string;
      tab_image?: string;
      tab_image_file?: File;
      features: string[] | { title: string; description: string }[];
      order: number;
    }[];
    created_at?: string;
    updated_at?: string;
  }

  // Showcase Sections State
  const [showcaseSectionsData, setShowcaseSectionsData] = useState<any[]>([]);

  interface ShowcaseItem {
    id?: number;
    title: string;
    description: string;
    image?: string;
    image_file?: File;
    order: number;
  }

  interface ShowcaseSectionData {
    id?: number;
    section_title: string;
    section_description: string;
    section_image?: string;
    section_image_file?: File;
    background_image?: string;
    background_image_file?: File;
    background_image_mobile?: string;
    background_image_mobile_file?: File;
    showcase_items: ShowcaseItem[];
    created_at?: string;
    updated_at?: string;
  }

  // Tab Section State
  const [tabData, setTabData] = useState({
    sectionDescription: 'We aim to earn your trust and have a long term relationship with you. Our team provides exceptional automotive services to keep your vehicle running smoothly.',
    tabs: [
      {
        title: 'Additional Services',
        icon: '',
        content: 'Our team provides a wide range of automotive services to keep your vehicle running smoothly. From basic maintenance to complex repairs, we ensure reliable and professional service.',
        image: '/assets/images/analytic_small.png',
        features: []
      },
      {
        title: 'Our Advantages',
        icon: '',
        content: 'Our advantages make us stand out from the rest. We combine quality, transparency, and reliability to provide exceptional service for every customer.',
        image: '',
        features: [
          'We Make It Easy',
          'OEM Factory Parts Warranty',
          'Fair And Transparent Pricing',
          'Happiness Guaranteed'
        ]
      },
      {
        title: 'About Company',
        icon: '',
        content: 'Learn more about our company values, mission, and commitment to providing exceptional service to our customers.',
        image: '',
        features: [
          {
            heading: 'We Make It Easy',
            text: 'Our streamlined process ensures getting your vehicle serviced is simple and hassle-free, from booking to completion.'
          },
          {
            heading: 'OEM Factory Parts Warranty',
            text: 'All our repairs come with genuine OEM parts and comprehensive warranty coverage for your peace of mind.'
          },
          {
            heading: 'Fair And Transparent Pricing',
            text: 'We provide detailed quotes with no hidden fees, ensuring you know exactly what you are paying for.'
          },
          {
            heading: 'Happiness Guaranteed',
            text: 'Your satisfaction is our priority. We stand behind our work with a satisfaction guarantee on all services.'
          }
        ]
      }
    ]
  });

  // Showcase Section State
  const [showcaseData, setShowcaseData] = useState({
    sectionTitle: 'Book Appointment',
    badge: '• BOOK APPOINTMENT NOW •',
    title: 'Book a Time That Works for You Easy, and Hassle-Free!',
    description: 'Ready to take your business technology to the next level? Our expert team is here to help you find the right solutions tailored to your needs.',
    backgroundImage: '/assets/images/shape-5.webp',
    mainImage: '/assets/images/gallery-8.webp',
    backgroundShape: '/assets/images/shape-3.webp',
    cards: [
      {
        title: 'Improving Your Business Planning',
        description: 'We envision a future where our clients are at the forefront of their industries, setting new standards of excellence.',
        icon: ''
      },
      {
        title: 'Improving Your Business Planning',
        description: 'We envision a future where our clients are at the forefront of their industries, setting new standards of excellence.',
        icon: ''
      }
    ]
  });

  const tabs = [
    "Hero Section",
    "Features",
    "Analytics",
    "Chart",
    "Tab Section",
    "Showcase"
  ];

  // Load existing data on component mount
  useEffect(() => {
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const loadServicePageData = async () => {
      try {
        console.log('=== Starting to load service page data ===');

        // Load Features Sections
        try {
          const featuresResponse = await fetch(apiUrl('/api/v1/features-sections'));
          if (featuresResponse.ok) {
            const featuresResult = await featuresResponse.json();
            console.log('Features sections loaded:', featuresResult);
            if (featuresResult.success && featuresResult.data?.features_sections) {
              setFeaturesSectionsData(featuresResult.data.features_sections);
            } else if (featuresResult.success && featuresResult.data?.features_section) {
              setFeaturesSectionsData([featuresResult.data.features_section]);
            }
          }
        } catch (error) {
          console.error('Error loading features sections:', error);
        }
        await delay(120);

        // Load Analytics Sections
        try {
          const analyticsResponse = await fetch(apiUrl('/api/v1/analytics-sections'));
          console.log('Analytics API Response Status:', analyticsResponse.status);

          if (analyticsResponse.ok) {
            const analyticsResult = await analyticsResponse.json();
            console.log('=== Full Analytics API Response ===');
            console.log('Success:', analyticsResult.success);
            console.log('Data:', analyticsResult.data);
            console.log('Available keys in result.data:', Object.keys(analyticsResult.data || {}));

            if (analyticsResult.success && analyticsResult.data?.analytics_sections) {
              console.log('Analytics sections found:', analyticsResult.data.analytics_sections);
              setAnalyticsData(analyticsResult.data.analytics_sections);
            } else if (analyticsResult.data?.analytics_section) {
              console.log('Single analytics section found:', analyticsResult.data.analytics_section);
              setAnalyticsData([analyticsResult.data.analytics_section]);
            } else {
              console.log('❌ No analytics sections found in response');
              console.log('Response structure:', analyticsResult);
            }
          } else if (analyticsResponse.status !== 429) {
            console.error('Analytics API failed:', analyticsResponse.status, analyticsResponse.statusText);
          }
        } catch (error) {
          console.error('Error loading analytics sections:', error);
        }
        await delay(120);

        // Load Chart Sections
        try {
          const chartResponse = await fetch(apiUrl('/api/v1/chart-sections'));
          console.log('Chart API Response Status:', chartResponse.status);

          if (chartResponse.ok) {
            const chartResult = await chartResponse.json();
            console.log('=== Full Chart API Response ===');
            console.log('Success:', chartResult.success);
            console.log('Data:', chartResult.data);
            console.log('Available keys in result.data:', Object.keys(chartResult.data || {}));

            if (chartResult.success && chartResult.data?.chart_sections) {
              console.log('Chart sections found:', chartResult.data.chart_sections);
              console.log('Number of chart sections:', chartResult.data.chart_sections.length);
              setChartSectionsData(chartResult.data.chart_sections);
            } else if (chartResult.data?.chart_section) {
              console.log('Single chart section found:', chartResult.data.chart_section);
              setChartSectionsData([chartResult.data.chart_section]);
            } else {
              console.log('❌ No chart sections found in response');
              console.log('Response structure:', chartResult);
              console.log('Checking for alternative keys...');
              // Check for other possible response structures
              if (chartResult.data && typeof chartResult.data === 'object') {
                console.log('All data keys:', Object.keys(chartResult.data));
                // Try to find any array in the response
                Object.keys(chartResult.data).forEach(key => {
                  const value = chartResult.data[key];
                  if (Array.isArray(value)) {
                    console.log(`Found array in key '${key}':`, value);
                  }
                });
              }
            }
          } else if (chartResponse.status === 429) {
            console.warn('Chart API: too many requests (429). Skipping chart sections for now.');
          } else {
            console.error('Chart API failed:', chartResponse.status, chartResponse.statusText);
          }
        } catch (error) {
          console.error('Error loading chart sections:', error);
        }
        await delay(120);

        // Load Tab Sections
        try {
          console.log('=== Loading Tab Sections ===');
          const tabResponse = await fetch(apiUrl('/api/v1/tab-sections'));
          console.log('Tab API Response Status:', tabResponse.status);

          if (tabResponse.ok) {
            const tabResult = await tabResponse.json();
            console.log('=== Full Tab API Response ===');
            console.log('Success:', tabResult.success);
            console.log('Data:', tabResult.data);
            console.log('Available keys in result.data:', Object.keys(tabResult.data || {}));

            if (tabResult.success && tabResult.data?.tab_sections) {
              console.log('Tab sections found:', tabResult.data.tab_sections);
              console.log('Number of tab sections:', tabResult.data.tab_sections.length);

              // Convert API data to component format if needed
              const convertedData = tabResult.data.tab_sections.map((section: any) => {
                console.log('Converting section:', section);

                // Ensure tabs array exists and has the correct structure
                const tabs = section.tabs || [];
                const convertedTabs = tabs.map((tab: any, index: number) => ({
                  tab_title: tab.tab_title || `Tab ${index + 1}`,
                  tab_content: tab.tab_content || '',
                  tab_icon: tab.tab_icon || '',
                  tab_image: tab.tab_image || '',
                  features: tab.features || [],
                  order: tab.order || index,
                  tab_icon_file: null,
                  tab_image_file: null
                }));

                return {
                  id: section.id,
                  section_title: section.section_title || '',
                  section_description: section.section_description || '',
                  tabs: convertedTabs,
                  created_at: section.created_at,
                  updated_at: section.updated_at
                };
              });

              console.log('Converted tab sections data:', convertedData);
              setTabSectionsData(convertedData);
            } else if (tabResult.data?.tab_section) {
              console.log('Single tab section found:', tabResult.data.tab_section);

              // Convert single section
              const section = tabResult.data.tab_section;
              const tabs = section.tabs || [];
              const convertedTabs = tabs.map((tab: any, index: number) => ({
                tab_title: tab.tab_title || `Tab ${index + 1}`,
                tab_content: tab.tab_content || '',
                tab_icon: tab.tab_icon || '',
                tab_image: tab.tab_image || '',
                features: tab.features || [],
                order: tab.order || index,
                tab_icon_file: null,
                tab_image_file: null
              }));

              const convertedSection = {
                id: section.id,
                section_title: section.section_title || '',
                section_description: section.section_description || '',
                tabs: convertedTabs,
                created_at: section.created_at,
                updated_at: section.updated_at
              };

              console.log('Converted single tab section:', convertedSection);
              setTabSectionsData([convertedSection]);
            } else {
              console.log('❌ No tab sections found in response');
              console.log('Response structure:', tabResult);
              console.log('Checking for alternative keys...');
              // Check for other possible response structures
              if (tabResult.data && typeof tabResult.data === 'object') {
                console.log('All data keys:', Object.keys(tabResult.data));
                // Try to find any array in the response
                Object.keys(tabResult.data).forEach(key => {
                  const value = tabResult.data[key];
                  if (Array.isArray(value)) {
                    console.log(`Found array in key '${key}':`, value);
                  }
                });
              }
            }
          } else if (tabResponse.status !== 429) {
            console.error('Tab API failed:', tabResponse.status, tabResponse.statusText);
          }
        } catch (error) {
          console.error('Error loading tab sections:', error);
        }
        await delay(120);

        // Load Showcase Sections
        try {
          console.log('=== Loading Showcase Sections ===');
          const showcaseResponse = await fetch(apiUrl('/api/v1/showcase-sections'));
          console.log('Showcase API Response Status:', showcaseResponse.status);

          if (showcaseResponse.ok) {
            const showcaseResult = await showcaseResponse.json();
            console.log('=== Full Showcase API Response ===');
            console.log('Success:', showcaseResult.success);
            console.log('Data:', showcaseResult.data);

            if (showcaseResult.success && showcaseResult.data?.showcase_sections) {
              console.log('Showcase sections found:', showcaseResult.data.showcase_sections);
              console.log('Number of showcase sections:', showcaseResult.data.showcase_sections.length);

              // Convert API data to component format if needed
              const convertedData = showcaseResult.data.showcase_sections.map((section: any) => {
                console.log('Converting showcase section:', section);

                // Ensure showcase_items array exists and has the correct structure
                const showcase_items = section.showcase_items || [];
                const convertedItems = showcase_items.map((item: any) => ({
                  id: item.id,
                  title: item.title || '',
                  description: item.description || '',
                  image: item.image || '',
                  order: item.order || 0,
                  image_file: null
                }));

                return {
                  id: section.id,
                  section_title: section.section_title || '',
                  section_description: section.section_description || '',
                  section_image: section.section_image || '',
                  section_image_file: null,
                  background_image: section.background_image || '',
                  background_image_file: null,
                  background_image_mobile: section.background_image_mobile || '',
                  background_image_mobile_file: null,
                  showcase_items: convertedItems,
                  created_at: section.created_at,
                  updated_at: section.updated_at
                };
              });

              console.log('Converted showcase sections data:', convertedData);
              setShowcaseSectionsData(convertedData);
            } else if (showcaseResult.data?.showcase_section) {
              console.log('Single showcase section found:', showcaseResult.data.showcase_section);

              // Convert single section
              const section = showcaseResult.data.showcase_section;
              const showcase_items = section.showcase_items || [];
              const convertedItems = showcase_items.map((item: any) => ({
                id: item.id,
                title: item.title || '',
                description: item.description || '',
                image: item.image || '',
                order: item.order || 0,
                image_file: null
              }));

              const convertedSection = {
                id: section.id,
                section_title: section.section_title || '',
                section_description: section.section_description || '',
                section_image: section.section_image || '',
                section_image_file: null,
                background_image: section.background_image || '',
                background_image_file: null,
                background_image_mobile: section.background_image_mobile || '',
                background_image_mobile_file: null,
                showcase_items: convertedItems,
                created_at: section.created_at,
                updated_at: section.updated_at
              };

              console.log('Converted single showcase section:', convertedSection);
              setShowcaseSectionsData([convertedSection]);
            } else {
              console.log('❌ No showcase sections found in response');
              console.log('Response structure:', showcaseResult);
            }
          } else if (showcaseResponse.status !== 429) {
            console.error('Showcase API failed:', showcaseResponse.status, showcaseResponse.statusText);
          }
        } catch (error) {
          console.error('Error loading showcase sections:', error);
        }
        await delay(120);

        const response = await fetch(apiUrl('/api/v1/service-page'));
        console.log('API Response Status:', response.status);
        console.log('API Response Headers:', response.headers);

        if (response.ok) {
          const result = await response.json();
          console.log('=== Full API Response ===');
          console.log('Success:', result.success);
          console.log('Data:', result.data);
          console.log('Full Response Object:', result);

          // Handle both single service page and array of service pages
          let servicePages = [];
          if (result.data && result.data.service_pages) {
            console.log('Service page data found:', result.data.service_pages);
            if (Array.isArray(result.data.service_pages)) {
              servicePages = result.data.service_pages;
              console.log('Found array of service pages:', servicePages.length);
            } else {
              servicePages = [result.data.service_pages];
              console.log('Found single service page, converting to array');
            }
          } else {
            console.log('❌ No service page data found in response');
            console.log('Available keys in result.data:', Object.keys(result.data || {}));
          }

          // Update hero data with the first service page data
          if (servicePages.length > 0) {
            const firstPage = servicePages[0];
            setHeroData({
              heading: firstPage.page_heading?.replace(' - Slide 1', '') || 'Our Services',
              subheading: firstPage.small_text || 'Professional IT Solutions',
              description: firstPage.description || 'We provide comprehensive technology solutions to help your business grow',
              is_active: true
            });

            // Convert service pages back to hero slides
            const heroSlides = servicePages.map((page: any, index: number) => {
              console.log(`Processing slide ${index + 1}:`, {
                id: page.id,
                bg_image: page.bg_image,
                small_text: page.small_text,
                main_heading: page.main_heading
              });

              return {
                id: page.id || index + 1,
                image: page.bg_image ? (page.bg_image.startsWith('http') ? page.bg_image : `http://localhost:8000${page.bg_image}`) : '',
                smallText: page.small_text || '',
                mainHeading: page.main_heading || '',
                outlinedHeading: page.outlined_heading || '',
                description: page.description || '',
                backgroundText: page.background_text || '',
                buttonText: page.button_text || 'Get Started Now',
                buttonUrl: page.button_url || '/contact'
              };
            });

            // Update with API data
            setHeroSectionData(heroSlides);
            console.log('Loaded slides from API:', heroSlides.length);
          }
        }
      } catch (error) {
        console.error('Error loading service page data:', error);
        // Keep default values if API call fails
      }
    };

    loadServicePageData();
  }, []);

  // Debug: Show current slides in state
  useEffect(() => {
    console.log('Current heroSectionData:', heroSectionData);
    console.log('Number of slides:', heroSectionData.length);
    heroSectionData.forEach((slide: any, index: number) => {
      console.log(`Slide ${index + 1}:`, {
        id: slide.id,
        image: slide.image,
        smallText: slide.smallText,
        mainHeading: slide.mainHeading
      });
    });
  }, [heroSectionData]);

  // Debug: Show current tab sections data
  useEffect(() => {
    console.log('Current showcaseSectionsData:', showcaseSectionsData);
    console.log('Number of showcase sections:', showcaseSectionsData.length);
    showcaseSectionsData.forEach((section: any, index: number) => {
      console.log(`Showcase Section ${index + 1}:`, {
        id: section.id,
        section_title: section.section_title,
        items_count: section.showcase_items?.length || 0,
        items: section.showcase_items?.map((item: any, itemIndex: number) => ({
          index: itemIndex,
          title: item.title,
          has_image: !!item.image,
          order: item.order
        }))
      });
    });
  }, [showcaseSectionsData]);
  useEffect(() => {
    console.log('Current chartSectionsData:', chartSectionsData);
    console.log('Number of chart sections:', chartSectionsData.length);
    chartSectionsData.forEach((section: any, index: number) => {
      console.log(`Chart Section ${index + 1}:`, {
        id: section.id,
        section_title: section.section_title,
        title: section.title
      });
    });
  }, [chartSectionsData]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSaveHeroSections = async () => {
    try {
      setSaving(true);
      console.log('Saving hero sections only...');

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      // If no slides exist but user has edited page heading/hero data, create one default slide to save
      const slidesToSave = heroSectionData.length > 0
        ? heroSectionData
        : [{
            id: undefined,
            image: '',
            smallText: heroData.subheading || '',
            mainHeading: heroData.heading || 'Our Services',
            outlinedHeading: '',
            description: heroData.description || '',
            backgroundText: '',
            buttonText: 'Get Started Now',
            buttonUrl: '/contact'
          }];

      if (slidesToSave.length === 0) {
        throw new Error('No hero slide data to save');
      }

      console.log('Saving', slidesToSave.length, 'hero slide(s)...');
      const results: unknown[] = [];

      for (let index = 0; index < slidesToSave.length; index++) {
        const slide = slidesToSave[index];
        console.log(`\n=== Processing Hero Slide ${index + 1} ===`);

        const formData = new FormData();
        formData.append('page_heading', `${heroData.heading} - Slide ${index + 1}`);
        formData.append('small_text', slide.smallText || '');
        formData.append('main_heading', slide.mainHeading || '');
        formData.append('outlined_heading', slide.outlinedHeading || '');
        formData.append('description', slide.description || '');
        formData.append('background_text', slide.backgroundText || '');
        formData.append('button_text', slide.buttonText || 'Get Started Now');
        // API expects a valid full URL; convert relative paths (e.g. /contact) to absolute
        const rawButtonUrl = slide.buttonUrl && slide.buttonUrl.trim() ? slide.buttonUrl : '/contact';
        const buttonUrlForApi = rawButtonUrl.startsWith('http://') || rawButtonUrl.startsWith('https://')
          ? rawButtonUrl
          : `${typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000'}${rawButtonUrl.startsWith('/') ? rawButtonUrl : '/' + rawButtonUrl}`;
        formData.append('button_url', buttonUrlForApi);

        if (slide.image && slide.image.startsWith('blob:')) {
          try {
            const response = await fetch(slide.image);
            const blob = await response.blob();
            const file = new File([blob], `slide-${index + 1}-image.jpg`, { type: 'image/jpeg' });
            formData.append('bg_image', file);
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }

        // New slides get id: Date.now() in UI; only use PUT when id looks like a real DB id (small integer)
        const isExistingSlide = typeof slide.id === 'number' && slide.id < 1e10;
        const url = isExistingSlide
          ? `http://localhost:8000/api/v1/service-page/${slide.id}`
          : 'http://localhost:8000/api/v1/service-page';

        if (isExistingSlide) {
          formData.append('_method', 'PUT');
        }

        const apiResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token || ''}`,
          },
          body: formData
        });

        const result = await apiResponse.json().catch(() => ({}));

        if (!apiResponse.ok) {
          if (apiResponse.status === 429) {
            throw new Error('Too many requests (429). Please wait a moment and try again.');
          }
          // 422 = validation error: show backend message and field errors
          const msg = result.message || result.error || `Failed to save hero slide ${index + 1}`;
          const errors = result.errors;
          const errorDetail = errors && typeof errors === 'object'
            ? Object.entries(errors).map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`).join('; ')
            : '';
          throw new Error(errorDetail ? `${msg} — ${errorDetail}` : msg);
        }

        results.push(result);

        if (index < slidesToSave.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // If we created the first slide from page heading only, update state so UI shows the new slide
      if (heroSectionData.length === 0 && results.length > 0) {
        const newSlides = results.map((r: any) => {
          const page = r.data?.service_page || r.service_page || r;
          return {
            id: page.id,
            image: page.bg_image ? (page.bg_image.startsWith('http') ? page.bg_image : `http://localhost:8000${page.bg_image}`) : '',
            smallText: page.small_text || '',
            mainHeading: page.main_heading || '',
            outlinedHeading: page.outlined_heading || '',
            description: page.description || '',
            backgroundText: page.background_text || '',
            buttonText: page.button_text || 'Get Started Now',
            buttonUrl: page.button_url || '/contact'
          };
        });
        setHeroSectionData(newSlides);
      } else if (results.length === slidesToSave.length) {
        // Replace temp ids (Date.now()) with real API ids so next save uses PUT not POST
        setHeroSectionData((prev) =>
          prev.map((slide, i) => {
            const r = results[i] as { data?: { service_page?: { id?: number } }; service_page?: { id?: number } } | undefined;
            const page = (r?.data?.service_page || r?.service_page || r) as { id?: number } | undefined;
            if (page?.id != null && typeof slide.id === 'number' && slide.id >= 1e10)
              return { ...slide, id: page.id };
            return slide;
          })
        );
      }

      console.log('\n=== Hero sections saved successfully! ===');
      setHasUnsavedChanges(false);
      alert(`Successfully saved ${slidesToSave.length} hero slide(s)!`);
    } catch (error) {
      console.error("Error saving hero sections:", error);
      alert('Error saving hero sections: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFeaturesSections = async () => {
    try {
      setSaving(true);
      console.log('Saving features sections only...');

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      // Test API connection
      const testResponse = await fetch('http://localhost:8000/api/v1/features-sections', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        }
      });

      if (!testResponse.ok) {
        throw new Error(`API Connection failed: ${testResponse.status}`);
      }

      if (featuresSectionsData.length === 0) {
        alert('No features sections to save');
        return;
      }

      console.log('Saving', featuresSectionsData.length, 'features sections...');
      const featuresResults = [];

      for (let index = 0; index < featuresSectionsData.length; index++) {
        const section = featuresSectionsData[index];
        console.log(`\n=== Processing Features Section ${index + 1} ===`);

        const url = section.id
          ? `http://localhost:8000/api/v1/features-sections/${section.id}`
          : 'http://localhost:8000/api/v1/features-sections';

        const hasFiles = section.main_image_file || section.small_image_file;

        let featuresResponse;
        if (hasFiles) {
          const formData = new FormData();
          formData.append('section_title', section.section_title);
          formData.append('subtitle', section.subtitle);
          formData.append('title', section.title);
          formData.append('description', section.description);
          section.features.forEach((feature, featureIndex) => {
            formData.append(`features[${featureIndex}][title]`, feature.title);
            formData.append(`features[${featureIndex}][description]`, feature.description);
          });

          // Always send image fields so backend can clear them when empty
          if (section.main_image_file) {
            formData.append('main_image', section.main_image_file);
          } else {
            formData.append('main_image', section.main_image ?? '');
          }
          if (section.small_image_file) {
            formData.append('small_image', section.small_image_file);
          } else {
            formData.append('small_image', section.small_image ?? '');
          }

          if (section.id) {
            formData.append('_method', 'PUT');
          }

          featuresResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token || ''}`,
            },
            body: formData
          });
        } else {
          const method = section.id ? 'PUT' : 'POST';
          featuresResponse = await fetch(url, {
            method: method,
            headers: {
              'Authorization': `Bearer ${token || ''}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              section_title: section.section_title,
              subtitle: section.subtitle,
              title: section.title,
              description: section.description,
              features: section.features,
              main_image: section.main_image ?? '',
              small_image: section.small_image ?? ''
            })
          });
        }

        if (!featuresResponse.ok) {
          throw new Error(`Failed to save features section ${index + 1}: ${featuresResponse.status}`);
        }

        const featuresResult = await featuresResponse.json();
        featuresResults.push(featuresResult);

        if (!section.id && featuresResult.data?.features_section) {
          const updatedSections = [...featuresSectionsData];
          updatedSections[index] = featuresResult.data.features_section;
          setFeaturesSectionsData(updatedSections);
        }

        if (index < featuresSectionsData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log('\n=== Features sections saved successfully! ===');
      setHasUnsavedChanges(false);
      alert(`Successfully saved ${featuresSectionsData.length} features sections!`);
    } catch (error) {
      console.error("Error saving features sections:", error);
      alert('Error saving features sections: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAnalyticsSections = async () => {
    try {
      setSaving(true);
      console.log('Saving analytics sections only...');

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      // Test API connection
      const testResponse = await fetch('http://localhost:8000/api/v1/analytics-sections', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        }
      });

      if (!testResponse.ok) {
        throw new Error(`API Connection failed: ${testResponse.status}`);
      }

      if (analyticsData.length === 0) {
        // For new sections, get data from the AnalyticsEditor component
        console.log('No existing analytics sections, checking for new section data...');
        // The AnalyticsEditor will handle the new section data through its onChange callback
      }

      console.log('Saving analytics sections...');
      const analyticsResults = [];

      const sectionsToSave = analyticsData;

      for (let index = 0; index < sectionsToSave.length; index++) {
        const section = sectionsToSave[index];
        console.log(`\n=== Processing Analytics Section ${index + 1} ===`);
        console.log('Section data being sent:', section);

        const url = section.id
          ? `http://localhost:8000/api/v1/analytics-sections/${section.id}`
          : 'http://localhost:8000/api/v1/analytics-sections';

        const hasFiles = section.main_image_file || section.small_image_file;
        console.log('Has files:', hasFiles);

        let analyticsResponse;
        if (hasFiles) {
          const formData = new FormData();
          formData.append('section_title', section.section_title);
          formData.append('subtitle', section.subtitle);
          formData.append('title', section.title);
          formData.append('description', section.description);
          section.features.forEach((feature, featureIndex) => {
            formData.append(`features[${featureIndex}][title]`, feature.title);
            formData.append(`features[${featureIndex}][description]`, feature.description);
          });

          // Always send image fields so backend can clear them when empty
          if (section.main_image_file) {
            formData.append('main_image', section.main_image_file);
          } else {
            formData.append('main_image', section.main_image ?? '');
          }
          if (section.small_image_file) {
            formData.append('small_image', section.small_image_file);
          } else {
            formData.append('small_image', section.small_image ?? '');
          }

          if (section.id) {
            formData.append('_method', 'PUT');
          }

          analyticsResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token || ''}`,
            },
            body: formData
          });
        } else {
          const method = section.id ? 'PUT' : 'POST';
          analyticsResponse = await fetch(url, {
            method: method,
            headers: {
              'Authorization': `Bearer ${token || ''}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              section_title: section.section_title,
              subtitle: section.subtitle,
              title: section.title,
              description: section.description,
              features: section.features,
              main_image: section.main_image ?? '',
              small_image: section.small_image ?? ''
            })
          });
        }

        if (!analyticsResponse.ok) {
          const errorText = await analyticsResponse.text();
          console.error(`Failed to save analytics section ${index + 1}: ${analyticsResponse.status}`);
          console.error('Error response:', errorText);

          try {
            const errorJson = JSON.parse(errorText);
            console.error('Parsed error:', errorJson);
            throw new Error(`Failed to save analytics section ${index + 1}: ${analyticsResponse.status} - ${JSON.stringify(errorJson)}`);
          } catch {
            throw new Error(`Failed to save analytics section ${index + 1}: ${analyticsResponse.status} - ${errorText}`);
          }
        }

        const analyticsResult = await analyticsResponse.json();
        analyticsResults.push(analyticsResult);

        if (!section.id && analyticsResult.data?.analytics_section) {
          const updatedSections = [...analyticsData];
          updatedSections[index] = analyticsResult.data.analytics_section;
          setAnalyticsData(updatedSections);
        }

        if (index < analyticsData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log('\n=== Analytics sections saved successfully! ===');
      setHasUnsavedChanges(false);
      alert(`Successfully saved ${sectionsToSave.length} analytics sections!`);
    } catch (error) {
      console.error("Error saving analytics sections:", error);
      alert('Error saving analytics sections: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChartSections = async () => {
    try {
      setSaving(true);
      console.log('Saving chart sections only...');

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      // Test API connection
      const testResponse = await fetch('http://localhost:8000/api/v1/chart-sections', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        }
      });

      if (!testResponse.ok) {
        throw new Error(`API Connection failed: ${testResponse.status}`);
      }

      if (chartSectionsData.length === 0) {
        console.log('No chart sections to save. Please fill in the form first.');
        alert('Please fill in the chart form before saving.');
        return;
      }

      console.log('Saving chart sections...');
      const chartResults = [];
      const sectionsToSave = chartSectionsData;

      for (let index = 0; index < sectionsToSave.length; index++) {
        const section = sectionsToSave[index];
        console.log(`\n=== Processing Chart Section ${index + 1} ===`);
        console.log('Section data being sent:', section);

        const url = section.id
          ? `http://localhost:8000/api/v1/chart-sections/${section.id}`
          : 'http://localhost:8000/api/v1/chart-sections';

        const hasFiles = section.main_image_file || section.small_image_file;
        console.log('Has files:', hasFiles);

        let chartResponse;
        if (hasFiles) {
          const formData = new FormData();
          formData.append('section_title', section.section_title);
          formData.append('subtitle', section.subtitle);
          formData.append('title', section.title);
          formData.append('description', section.description);
          section.features.forEach((feature, featureIndex) => {
            formData.append(`features[${featureIndex}][title]`, feature.title);
            formData.append(`features[${featureIndex}][description]`, feature.description);
          });

          // Always send image fields so backend can clear them when empty
          if (section.main_image_file) {
            formData.append('main_image', section.main_image_file);
          } else {
            formData.append('main_image', section.main_image ?? '');
          }
          if (section.small_image_file) {
            formData.append('small_image', section.small_image_file);
          } else {
            formData.append('small_image', section.small_image ?? '');
          }

          if (section.id) {
            formData.append('_method', 'PUT');
          }

          chartResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token || ''}`,
            },
            body: formData
          });
        } else {
          const method = section.id ? 'PUT' : 'POST';
          chartResponse = await fetch(url, {
            method: method,
            headers: {
              'Authorization': `Bearer ${token || ''}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              section_title: section.section_title,
              subtitle: section.subtitle,
              title: section.title,
              description: section.description,
              features: section.features,
              main_image: section.main_image ?? '',
              small_image: section.small_image ?? ''
            })
          });
        }

        if (!chartResponse.ok) {
          const errorText = await chartResponse.text();
          console.error(`Failed to save chart section ${index + 1}: ${chartResponse.status}`);
          console.error('Error response:', errorText);

          try {
            const errorJson = JSON.parse(errorText);
            console.error('Parsed error:', errorJson);
            throw new Error(`Failed to save chart section ${index + 1}: ${chartResponse.status} - ${JSON.stringify(errorJson)}`);
          } catch {
            throw new Error(`Failed to save chart section ${index + 1}: ${chartResponse.status} - ${errorText}`);
          }
        }

        const chartResult = await chartResponse.json();
        chartResults.push(chartResult);

        if (!section.id && chartResult.data?.chart_section) {
          const updatedSections = [...chartSectionsData];
          updatedSections[index] = chartResult.data.chart_section;
          setChartSectionsData(updatedSections);
        }

        if (index < chartSectionsData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log('\n=== Chart sections saved successfully! ===');
      setHasUnsavedChanges(false);
      alert(`Successfully saved ${sectionsToSave.length} chart sections!`);
    } catch (error) {
      console.error("Error saving chart sections:", error);
      alert('Error saving chart sections: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTabSections = async () => {
    try {
      setSaving(true);
      console.log('Saving tab sections only...');

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      // Test API connection first
      console.log('Testing API connection...');

      // Try without auth first to see if endpoint exists
      const publicTestResponse = await fetch('http://localhost:8000/api/v1/tab-sections', {
        method: 'GET'
      });

      console.log('Public API Test Response Status:', publicTestResponse.status);
      console.log('Public API Test Response OK:', publicTestResponse.ok);

      if (!publicTestResponse.ok) {
        const errorText = await publicTestResponse.text();
        console.error('Public API Test Error Response:', errorText);

        // Try alternative endpoints
        console.log('Trying alternative endpoint: /api/tab-sections');
        const altResponse = await fetch('http://localhost:8000/api/tab-sections', {
          method: 'GET'
        });
        console.log('Alternative API Test Status:', altResponse.status);

        if (!altResponse.ok) {
          throw new Error(`API endpoint not found. Both /api/v1/tab-sections and /api/tab-sections returned ${publicTestResponse.status} and ${altResponse.status}. Please check your Laravel API routes.`);
        }
      }

      console.log('Using token:', token ? 'Token exists' : 'No token found');

      // Now try with auth
      const testResponse = await fetch('http://localhost:8000/api/v1/tab-sections', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        }
      });

      console.log('API Test Response Status:', testResponse.status);
      console.log('API Test Response OK:', testResponse.ok);

      if (!testResponse.ok) {
        console.error('API Test failed. Response:', testResponse.status, testResponse.statusText);
        const errorText = await testResponse.text();
        console.error('API Test Error Response:', errorText);
        throw new Error(`API Connection failed: ${testResponse.status} - ${testResponse.statusText}. Please check if the API endpoint exists.`);
      }

      if (tabSectionsData.length === 0) {
        console.log('No tab sections to save. Please fill in the form first.');
        alert('Please fill in the tab form before saving.');
        return;
      }

      console.log('Saving tab sections...');
      const tabResults = [];
      const sectionsToSave = tabSectionsData;

      for (let index = 0; index < sectionsToSave.length; index++) {
        const section = sectionsToSave[index];
        console.log(`\n=== Processing Tab Section ${index + 1} ===`);
        console.log('Section data being sent:', section);
        console.log('Section ID:', section.id);
        console.log('Section ID type:', typeof section.id);
        console.log('Is valid ID:', section.id && section.id > 0);

        // Always use POST for new sections (no ID or invalid ID)
        // For existing sections, we'll still use POST with _method=PUT
        const isValidId = section.id && section.id > 0 && typeof section.id === 'number';
        const url = isValidId
          ? `http://localhost:8000/api/v1/tab-sections/${section.id}`
          : 'http://localhost:8000/api/v1/tab-sections';

        console.log('Using URL:', url);
        console.log('Is update operation:', isValidId);

        // Check if any tab has files
        const hasFiles = section.tabs && section.tabs.some(tab => {
          const hasIconFile = !!tab.tab_icon_file;
          const hasImageFile = !!tab.tab_image_file;
          console.log(`Tab ${section.tabs.indexOf(tab)} - Files check:`, {
            hasIconFile,
            hasImageFile,
            iconFileName: tab.tab_icon_file?.name,
            imageFileName: tab.tab_image_file?.name
          });
          return hasIconFile || hasImageFile;
        });
        console.log('Has files:', hasFiles);

        let tabResponse;
        if (hasFiles) {
          const formData = new FormData();
          formData.append('section_title', section.section_title);
          formData.append('section_description', section.section_description);

          // Add tab data according to API format - use specific field names
          if (section.tabs && Array.isArray(section.tabs)) {
            section.tabs.forEach((tab, tabIndex) => {
              const tabNum = tabIndex + 1;

              // Use specific field names as per API documentation
              formData.append(`tab${tabNum}_title`, tab.tab_title);

              if (tab.tab_content) {
                formData.append(`tab${tabNum}_content`, tab.tab_content);
              }

              // Add features based on tab type - use specific field names
              if (tabIndex === 2) {
                // Tab 3: Features with title and description - API expects strings, so convert to title only
                if (tab.features && Array.isArray(tab.features)) {
                  tab.features.forEach((feature, featureIndex) => {
                    if (typeof feature === 'object') {
                      formData.append(`tab${tabNum}_features[]`, feature.title || '');
                    } else if (typeof feature === 'string') {
                      formData.append(`tab${tabNum}_features[]`, feature);
                    }
                  });
                }
              } else {
                // Tabs 1 & 2: Simple string features
                if (tab.features && Array.isArray(tab.features)) {
                  tab.features.forEach((feature, featureIndex) => {
                    if (typeof feature === 'string') {
                      formData.append(`tab${tabNum}_features[]`, feature);
                    }
                  });
                }
              }

              // Add files using specific field names
              if (tab.tab_icon_file) {
                formData.append(`tab${tabNum}_icon`, tab.tab_icon_file);
              }
              if (tab.tab_image_file) {
                formData.append(`tab${tabNum}_image`, tab.tab_image_file);
              }
            });
          }

          if (isValidId) {
            formData.append('_method', 'PUT');
          }

          tabResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token || ''}`,
            },
            body: formData
          });
        } else {
          // JSON request without files - use specific field names
          const jsonData: any = {
            section_title: section.section_title,
            section_description: section.section_description
          };

          // Add tab data using specific field names
          if (section.tabs && Array.isArray(section.tabs)) {
            section.tabs.forEach((tab, tabIndex) => {
              const tabNum = tabIndex + 1;
              jsonData[`tab${tabNum}_title`] = tab.tab_title;

              if (tab.tab_content) {
                jsonData[`tab${tabNum}_content`] = tab.tab_content;
              }

              // Add features based on tab type
              if (tabIndex === 2) {
                // Tab 3: Features with title and description - API expects strings, so convert to title only
                if (tab.features && Array.isArray(tab.features)) {
                  const stringFeatures = tab.features.map(feature =>
                    typeof feature === 'object' ? feature.title || '' : feature
                  );
                  jsonData[`tab${tabNum}_features`] = stringFeatures;
                }
              } else {
                // Tabs 1 & 2: Simple string features
                if (tab.features && Array.isArray(tab.features)) {
                  jsonData[`tab${tabNum}_features`] = tab.features;
                }
              }
            });
          }

          const method = isValidId ? 'PUT' : 'POST';
          tabResponse = await fetch(url, {
            method: method,
            headers: {
              'Authorization': `Bearer ${token || ''}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
          });
        }

        if (!tabResponse.ok) {
          const errorText = await tabResponse.text();
          console.error(`Failed to save tab section ${index + 1}: ${tabResponse.status}`);
          console.error('Error response:', errorText);

          try {
            const errorJson = JSON.parse(errorText);
            console.error('Parsed error:', errorJson);
            throw new Error(`Failed to save tab section ${index + 1}: ${tabResponse.status} - ${JSON.stringify(errorJson)}`);
          } catch {
            throw new Error(`Failed to save tab section ${index + 1}: ${tabResponse.status} - ${errorText}`);
          }
        }

        const tabResult = await tabResponse.json();
        tabResults.push(tabResult);

        if (!section.id && tabResult.data?.tab_section) {
          const updatedSections = [...tabSectionsData];
          updatedSections[index] = tabResult.data.tab_section;
          setTabSectionsData(updatedSections);
        }

        if (index < tabSectionsData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log('\n=== Tab sections saved successfully! ===');
      setHasUnsavedChanges(false);
      alert(`Successfully saved ${sectionsToSave.length} tab sections!`);
    } catch (error) {
      console.error("Error saving tab sections:", error);
      alert('Error saving tab sections: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShowcaseSections = async () => {
    try {
      setSaving(true);
      console.log('Saving showcase sections only...');

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      if (showcaseSectionsData.length === 0) {
        console.log('No showcase sections to save. Please fill in the form first.');
        alert('Please fill in the showcase form before saving.');
        return;
      }

      console.log('Saving showcase sections...');
      const showcaseResults = [];
      const sectionsToSave = showcaseSectionsData;

      for (let index = 0; index < sectionsToSave.length; index++) {
        const section = sectionsToSave[index];
        console.log(`\n=== Processing Showcase Section ${index + 1} ===`);
        console.log('Section data being sent:', section);
        console.log('Section ID:', section.id);

        // Always use POST for new sections (no ID or invalid ID)
        // For existing sections, we'll still use POST with _method=PUT
        const isValidId = section.id && section.id > 0 && typeof section.id === 'number';
        const url = isValidId
          ? `http://localhost:8000/api/v1/showcase-sections/${section.id}`
          : 'http://localhost:8000/api/v1/showcase-sections';

        console.log('Using URL:', url);
        console.log('Is update operation:', isValidId);

        // Check if any showcase item has files OR if section has image files
        const hasFiles = (section.showcase_items && section.showcase_items.some((item: any) => !!item.image_file)) ||
          !!section.section_image_file ||
          !!section.background_image_file ||
          !!section.background_image_mobile_file;

        let showcaseResponse;
        if (hasFiles) {
          const formData = new FormData();
          formData.append('section_title', section.section_title);
          formData.append('section_description', section.section_description);

          // Section image: send new file, existing URL, or empty string to clear
          if (section.section_image_file) {
            formData.append('section_image', section.section_image_file);
          } else {
            formData.append('section_image', section.section_image ?? '');
          }

          // Background images: send new file, existing URL, or empty string to clear
          if (section.background_image_file) {
            formData.append('background_image', section.background_image_file);
            console.log(`Adding background image file:`, section.background_image_file.name);
          } else {
            formData.append('background_image', section.background_image ?? '');
          }
          if (section.background_image_mobile_file) {
            formData.append('background_image_mobile', section.background_image_mobile_file);
            console.log(`Adding background image mobile file:`, section.background_image_mobile_file.name);
          } else {
            formData.append('background_image_mobile', section.background_image_mobile ?? '');
          }

          // Add showcase items according to API format
          if (section.showcase_items && Array.isArray(section.showcase_items)) {
            section.showcase_items.forEach((item: any, itemIndex: number) => {
              console.log(`Processing item ${itemIndex}:`, {
                title: item.title,
                hasImageFile: !!item.image_file,
                imageFileName: item.image_file?.name,
                existingImage: item.image,
                itemId: item.id // Check if item has ID
              });

              formData.append(`showcase_items[${itemIndex}][title]`, item.title);
              formData.append(`showcase_items[${itemIndex}][description]`, item.description);
              formData.append(`showcase_items[${itemIndex}][order]`, item.order.toString());

              // CRITICAL: Include item ID if it exists (for updates)
              if (item.id) {
                formData.append(`showcase_items[${itemIndex}][id]`, item.id.toString());
                console.log(`Adding item ID ${item.id} for item ${itemIndex}`);
              }

              // Item image: send new file, or existing URL / empty string to clear
              if (item.image_file) {
                console.log(`Adding file for item ${itemIndex}:`, item.image_file.name);
                formData.append(`showcase_items[${itemIndex}][image]`, item.image_file);
              } else {
                formData.append(`showcase_items[${itemIndex}][image]`, item.image ?? '');
              }
            });
          }

          if (isValidId) {
            formData.append('_method', 'PUT');
          }

          showcaseResponse = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token || ''}`,
            },
            body: formData
          });
        } else {
          // JSON request without files
          const jsonData: any = {
            section_title: section.section_title,
            section_description: section.section_description,
            showcase_items: []
          };

          // Always send image fields so backend can clear them when empty
          jsonData.section_image = section.section_image ?? '';
          jsonData.background_image = section.background_image ?? '';
          jsonData.background_image_mobile = section.background_image_mobile ?? '';

          // Add showcase items according to API format
          if (section.showcase_items && Array.isArray(section.showcase_items)) {
            section.showcase_items.forEach((item: any, itemIndex: number) => {
              console.log(`Processing item ${itemIndex} (JSON):`, {
                title: item.title,
                hasImageFile: !!item.image_file,
                existingImage: item.image,
                itemId: item.id // Check if item has ID
              });

              const itemData: any = {
                title: item.title,
                description: item.description,
                order: item.order,
                image: item.image ?? ''
              };

              // CRITICAL: Include item ID if it exists (for updates)
              if (item.id) {
                itemData.id = item.id;
                console.log(`Adding item ID ${item.id} for item ${itemIndex} (JSON)`);
              }

              jsonData.showcase_items.push(itemData);
            });
          }

          const method = isValidId ? 'PUT' : 'POST';
          showcaseResponse = await fetch(url, {
            method: method,
            headers: {
              'Authorization': `Bearer ${token || ''}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData)
          });
        }

        if (!showcaseResponse.ok) {
          const errorText = await showcaseResponse.text();
          console.error(`Failed to save showcase section ${index + 1}: ${showcaseResponse.status}`);
          console.error('Error response:', errorText);

          try {
            const errorJson = JSON.parse(errorText);
            console.error('Parsed error:', errorJson);
            throw new Error(`Failed to save showcase section ${index + 1}: ${showcaseResponse.status} - ${JSON.stringify(errorJson)}`);
          } catch {
            throw new Error(`Failed to save showcase section ${index + 1}: ${showcaseResponse.status} - ${errorText}`);
          }
        }

        const showcaseResult = await showcaseResponse.json();
        showcaseResults.push(showcaseResult);

        if (!section.id && showcaseResult.data?.showcase_section) {
          const updatedSections = [...showcaseSectionsData];
          updatedSections[index] = showcaseResult.data.showcase_section;
          setShowcaseSectionsData(updatedSections);
        }

        if (index < showcaseSectionsData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log('\n=== Showcase sections saved successfully! ===');
      setHasUnsavedChanges(false);
      alert(`Successfully saved ${sectionsToSave.length} showcase sections!`);
    } catch (error) {
      console.error("Error saving showcase sections:", error);
      alert('Error saving showcase sections: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gray-100 px-6 py-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Services Page</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-4">
        <AdminTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Edit Section */}
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-pink-600 mb-2">
              {activeTab === "Hero Section" ? "Edit Hero Section" :
                activeTab === "Features" ? "Edit Features Section" :
                  activeTab === "Analytics" ? "Edit Analytics Section" :
                    activeTab === "Chart" ? "Edit Chart Section" :
                      activeTab === "Tab Section" ? "Edit Tab Section" :
                        activeTab === "Showcase" ? "Edit Showcase Section" :
                          "Edit Services Page"}
            </h2>
            <div className="h-1 bg-pink-600 w-full"></div>
          </div>

          {/* Content based on active tab */}

          {/* Hero Section Tab */}
          {activeTab === 'Hero Section' && (
            <>
              <HeroSectionEditor
                pageHeading={heroData.heading}
                onPageHeadingChange={(value) => {
                  setHeroData({ ...heroData, heading: value });
                  setHasUnsavedChanges(true);
                }}
                slides={heroSectionData}
                onSlidesChange={(slides) => {
                  setHeroSectionData(slides);
                  setHasUnsavedChanges(true);
                }}
              />
              {/* Hero Section Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveHeroSections}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Hero Sections"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Features Tab */}
          {activeTab === 'Features' && (
            <>
              <FeaturesSectionEditor
                data={featuresSectionsData}
                onChange={(data) => {
                  setFeaturesSectionsData(data);
                  setHasUnsavedChanges(true);
                }}
              />
              {/* Features Section Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveFeaturesSections}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Features Sections"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === 'Analytics' && (
            <>
              <AnalyticsEditor
                data={analyticsData}
                onChange={(data) => {
                  setAnalyticsData(data);
                  setHasUnsavedChanges(true);
                }}
              />
              {/* Analytics Section Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveAnalyticsSections}
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Analytics Section"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Chart Tab */}
          {activeTab === 'Chart' && (
            <>
              <ChartSectionEditor
                data={chartSectionsData}
                onChange={(data) => {
                  setChartSectionsData(data);
                  setHasUnsavedChanges(true);
                }}
              />
              {/* Chart Section Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveChartSections}
                  disabled={saving}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Chart Section"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Tab Section Tab */}
          {activeTab === 'Tab Section' && (
            <>
              <TabSectionEditor
                data={tabSectionsData}
                onChange={(data) => {
                  setTabSectionsData(data);
                  setHasUnsavedChanges(true);
                }}
              />
              {/* Tab Section Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveTabSections}
                  disabled={saving}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Tab Section"
                  )}
                </button>
              </div>
            </>
          )}

          {/* Showcase Tab */}
          {activeTab === 'Showcase' && (
            <>
              <ShowcaseSectionEditor
                data={showcaseSectionsData as any}
                onChange={(data) => {
                  setShowcaseSectionsData(data);
                  setHasUnsavedChanges(true);
                }}
              />
              {/* Showcase Section Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveShowcaseSections}
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Showcase Section"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
