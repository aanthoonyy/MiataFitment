import { Button } from "@/components/ui/button";
import { useFitmentStore, useUIStore } from "@/stores";
import { BuyPartsButton } from "@/components/BuyWheelButton";
import { STRINGS } from "@/i18n/strings";
import SuspensionSettings from "./SuspensionSettings";

// The ND's suspension is not modelled well enough to bounce yet.
const BOUNCE_UNSUPPORTED_MODEL = "nd";

const AlignmentSettings = () => {
  const model = useFitmentStore((state) => state.model);
  const bounceRequested = useUIStore((state) => state.bounceRequested);
  const requestBounce = useUIStore((state) => state.requestBounce);

  return (
    <>
      <SuspensionSettings title={STRINGS.alignment.frontTitle} axle="front" />
      <SuspensionSettings title={STRINGS.alignment.rearTitle} axle="rear" />

      <Button
        className="w-full"
        variant="outline"
        onClick={() => requestBounce()}
        disabled={bounceRequested || model === BOUNCE_UNSUPPORTED_MODEL}
      >
        {STRINGS.alignment.simulateBounce}
      </Button>

      <p className="-mt-3 text-xs text-muted-foreground text-left">
        {STRINGS.alignment.moreUnderCarTab}
      </p>

      <BuyPartsButton type="suspension" />
    </>
  );
};

export default AlignmentSettings;
