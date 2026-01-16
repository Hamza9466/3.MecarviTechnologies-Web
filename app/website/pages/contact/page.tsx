import Header from "@/components/website/home/Header";
import ContactHero from "@/components/website/contact/ContactHero";
import ContactInfo from "@/components/website/contact/ContactInfoNew";
import ContactForm from "@/components/website/contact/ContactForm";
import ContactCTA from "@/components/website/contact/ContactCTA";
import Footer from "@/components/website/home/Footer";

export default function Contact() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactCTA />
      <Footer />
    </main>
  );
}
