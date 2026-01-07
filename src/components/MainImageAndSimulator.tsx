import React from "react";
import MainImage from "./MainImage";
import FitmentSimulator from "./FitmentSimulator";

const MainImageAndSimulator: React.FC = () => (
  <div className="mx-auto w-full max-w-5xl px-4 pt-10 md:pt-14">
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div>
        <FitmentSimulator />
      </div>

      <div>
        <MainImage />
      </div>
    </div>
  </div>
);

export default MainImageAndSimulator;
