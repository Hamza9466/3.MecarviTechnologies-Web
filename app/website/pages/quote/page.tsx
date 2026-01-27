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
        {/* Description Section */}
        <section className="bg-white pt-8 sm:pt-10 md:pt-12 pb-0 px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed text-center" data-aos="fade-up">
              Entrust with high professionalism, we are capable of offering pixel perfect web & mobile application development, third party integrations and solutions to our clients.
            </p>
          </div>
        </section>
        <QuoteForm />
      </div>
      <Footer />
    </main>
  );
}

