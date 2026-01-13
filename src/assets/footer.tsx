import React from "react";

export const Footer: React.FC = () => (
  <footer className="mt-8 bg-[#0DA5E8] text-white">
    <div className="mx-auto max-w-6xl px-4 py-8 text-center">
      <h2 className="mb-1 text-lg font-semibold tracking-tight">
        Miata Fitment
      </h2>

      <p className="text-sm text-white/90">
        &copy; {new Date().getFullYear()} Miata Fitment. All Rights Reserved.
      </p>

      <p className="mt-1 text-sm text-white/90">
        Designed with 💙 for Miata enthusiasts.
      </p>
    </div>
  </footer>
);
