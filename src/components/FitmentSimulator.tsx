import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const FitmentSimulator: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterSimulator = () => {
    navigate("/visualizer");
  };

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">
        Fitment Simulator
      </h1>

      <p className="mb-4 text-lg text-muted-foreground">
        Dial in your Miata&apos;s fitment with our simulator. Select your
        Miata&apos;s generation from the header and start customizing wheels,
        suspension, and more.
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
        Enter Simulator
      </Button>
    </div>
  );
};

export default FitmentSimulator;
