import React from "react";
import { Footer } from "@/components/Footer";
import MainImageAndSimulator from "@/components/MainImageAndSimulator";
import SupportSection from "@/components/SupportSection";
import { LandingHeader } from "@/components/LandingHeader";

const LandingPage: React.FC = () => {
  return (
    <div className="flex min-h-screen w-screen flex-col overflow-x-hidden bg-white m-0 p-0 box-border">
      <LandingHeader />

      <main className="flex-1">
        <MainImageAndSimulator />
        <SupportSection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
