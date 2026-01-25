import React from 'react';
import Header from '@/components/website/home/Header';
import Footer from '@/components/website/home/Footer';
import HeroSection from '@/components/website/service/HeroSection';
import ServicesGrid from '@/components/website/service/ServicesGrid';
import CallToAction from '@/components/website/service/CallToAction';

export default function ServicePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <HeroSection />
        
            <Footer />
        </div>
    );
}
