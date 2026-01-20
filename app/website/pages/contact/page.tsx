import Header from "@/components/website/home/Header";
import ContactHero from "@/components/website/contact/ContactHero";
import ContactForm from "@/components/website/contact/ContactForm";
import OpeningHours from "@/components/website/contact/OpeningHours";
import ContactCTA from "@/components/website/contact/ContactCTA";
import Footer from "@/components/website/home/Footer";

export default function Contact() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ContactHero />
      <ContactForm />
      <div className="bg-[#F0EFEB] py-8 -mt-20">
        <OpeningHours />
      </div>
      <ContactCTA />
      <Footer />
    </main>
  );
}
