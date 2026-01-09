import * as React from "react";
import type { Settings } from "@/types/settings";

export type FitmentConfig = {
  model: string;
  settings: Settings;
};

type FitmentConfigContextValue = {
  config: FitmentConfig;
  setConfig: (next: FitmentConfig) => void;
};

const FitmentConfigContext = React.createContext<FitmentConfigContextValue | null>(
  null
);

export function FitmentConfigProvider({
  value,
  children,
}: {
  value: FitmentConfigContextValue;
  children: React.ReactNode;
}) {
  return (
    <FitmentConfigContext.Provider value={value}>
      {children}
    </FitmentConfigContext.Provider>
  );
}

export function useFitmentConfig() {
  const ctx = React.useContext(FitmentConfigContext);
  if (!ctx) throw new Error("useFitmentConfig must be used within FitmentConfigProvider");
  return ctx;
}
