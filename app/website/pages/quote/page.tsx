import Header from "@/components/website/home/Header";
import QuoteHero from "@/components/website/quote/QuoteHero";
import QuoteForm from "@/components/website/quote/QuoteForm";
import Footer from "@/components/website/home/Footer";

export default function Quote() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="relative">
        <QuoteHero />
        <QuoteForm />
      </div>
      <Footer />
    </main>
  );
}

