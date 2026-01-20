import Header from "@/components/website/home/Header";
import Hero from "@/components/website/home/Hero";
import Portfolio from "@/components/website/home/Portfolio";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      <Portfolio />
    </main>
  );
}

