import React from 'react';
import Header from '@/components/website/home/Header';
import Footer from '@/components/website/home/Footer';
import ServiceHero from '@/components/website/service/ServiceHero';
import HeroSection from '@/components/website/service/HeroSection';
import FeaturesSection from '@/components/website/service/FeaturesSection';
import AnalyticsSection from '@/components/website/service/AnalyticsSection';
import ChartSection from '@/components/website/service/ChartSection';
import TabSection from '@/components/website/service/TabSection';
import StatsSection from '@/components/website/service/StatsSection';
import ShowcaseSection from '@/components/website/service/ShowcaseSection';
import CallToAction from '@/components/website/service/CallToAction';

export default function ServicePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <ServiceHero />
            <div className="bg-white p-8 mt-0 rounded-2xl shadow-xl">
                <HeroSection />
            </div>
            <div className="mb-8"><FeaturesSection /></div>
            <div className="mt-8 mb-8"><AnalyticsSection /></div>
            <div className="mt-8"><ChartSection /></div>
            <TabSection />
            <ShowcaseSection />
            <Footer />
        </div>
    );
}
