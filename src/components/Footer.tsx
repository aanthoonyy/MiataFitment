import React from "react";

import { STRINGS, t } from "@/i18n/strings";

export const Footer: React.FC = () => (
  <footer className="mt-8 bg-[#0DA5E8] text-white">
    <div className="mx-auto max-w-6xl px-4 py-8 text-center">
      <h2 className="mb-1 text-lg font-semibold tracking-tight">
        {STRINGS.brand.name}
      </h2>

      <p className="text-sm text-white/90">
        {t(STRINGS.landing.copyright, { year: new Date().getFullYear() })}
      </p>

      <p className="mt-1 text-sm text-white/90">{STRINGS.landing.madeWithLove}</p>
    </div>
  </footer>
);
