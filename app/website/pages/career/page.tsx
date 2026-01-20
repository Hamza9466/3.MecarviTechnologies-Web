import Header from "@/components/website/home/Header";
import CareerHero from "@/components/website/career/CareerHero";
import CareerContent from "@/components/website/career/CareerContent";
import CareerCards from "@/components/website/career/CareerCards";
import FeaturedJobs from "@/components/website/career/FeaturedJobs";
import CareerFAQ from "@/components/website/career/CareerFAQ";
import CareerSupport from "@/components/website/career/CareerSupport";
import Footer from "@/components/website/home/Footer";

export default function Career() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CareerHero />
      <CareerContent />
      <CareerCards />
      <FeaturedJobs />
      <CareerFAQ />
      <CareerSupport />
      <Footer />
    </main>
  );
}

