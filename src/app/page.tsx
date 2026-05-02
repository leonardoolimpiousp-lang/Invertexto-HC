import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ForWhom } from "@/components/landing/ForWhom";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Features />
        <HowItWorks />
        <ForWhom />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
