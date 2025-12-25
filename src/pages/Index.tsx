import {Header} from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import FeaturedParks from "@/components/layout/FeaturedParks";
import Events from "@/components/layout/Events";
import Amenities from "@/components/layout/Amenities";
import CallToAction from "@/components/layout/CallToAction";
import {Footer} from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedParks />
        <Events />
        <Amenities />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
