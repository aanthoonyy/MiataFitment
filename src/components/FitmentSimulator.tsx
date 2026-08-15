import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { STRINGS } from "@/i18n/strings";

const FitmentSimulator: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterSimulator = () => {
    navigate("/visualizer");
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">
        {STRINGS.landing.simulatorTitle}
      </h1>

      <p className="mb-4 text-lg text-muted-foreground">
        {STRINGS.landing.simulatorBlurb}
      </p>

      <Button
        size="lg"
        onClick={handleEnterSimulator}
        className="
    mt-2 h-14 w-[200px]
    bg-[#0DA5E8] text-white
    transition-colors duration-200
    hover:bg-[#0b94d1]
    active:bg-[#0a84bd]
  "
      >
        {STRINGS.landing.enterSimulator}
      </Button>
    </div>
  );
};

export default FitmentSimulator;
