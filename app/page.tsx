import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Reviews from "@/components/Reviews";
import Products from "@/components/Products";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Products />
      <Reviews />
      <ContactSection />
    </div>
  );
}