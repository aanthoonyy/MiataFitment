import React from "react";

const MainImage: React.FC = () => (
  <div className="relative overflow-hidden rounded-2xl shadow-lg">
    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />

    <img
      src="/websiteExample1.png"
      alt="MIATA FITMENT"
      className="h-auto w-full"
    />
  </div>
);

export default MainImage;
