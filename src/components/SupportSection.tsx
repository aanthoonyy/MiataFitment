import React from "react";
import { Button } from "@/components/ui/button";
import { STRINGS } from "@/i18n/strings";

const SupportSection: React.FC = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
            <img
              src="/stickerexample.png"
              alt={STRINGS.landing.supportAlt}
              className="h-auto w-full"
            />
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-3xl font-semibold tracking-tight">
            {STRINGS.landing.supportTitle}
          </h2>

          <p className="mb-6 text-lg text-muted-foreground">
            {STRINGS.landing.supportBlurb}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              disabled
              className="
                h-14 flex-1
                bg-[#0DA5E8] text-white
                transition-colors duration-200
                hover:bg-[#0b94d1]
                active:bg-[#0a84bd]
              "
              onClick={() => {
                window.open(
                  "https://buymeacoffee.com/miatafitment/e/506966",
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            >
              {STRINGS.landing.stickersSoldOut}
            </Button>

            <Button
              size="lg"
              className="
                h-14 flex-1
                bg-[#0DA5E8] text-white
                transition-colors duration-200
                hover:bg-[#0b94d1]
                active:bg-[#0a84bd]
              "
              onClick={() => {
                window.open(
                  "https://buymeacoffee.com/miatafitment",
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            >
              {STRINGS.landing.buyCoffee}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
