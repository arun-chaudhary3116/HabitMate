import CallToAction from "@/components/CallToAction";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-gradient-hero">
        <Hero />
        <Marquee />
      </div>
      <Features />
      <Pricing />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
