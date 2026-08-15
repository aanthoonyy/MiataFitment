import { ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { trackButtonClick } from "@/services/analyticsAPI";
import { STRINGS } from "@/i18n/strings";

type WheelSettings = {
  width: number;
  offset: number;
  diameter: number;
};

type TireSettings = {
  frontWidth: number;
  frontRatio: number;
  frontDiameter: number;
  rearWidth: number;
  rearRatio: number;
  rearDiameter: number;
  zipCode?: string;
  performance?: string;
};

type BuyButtonProps =
  | { type: "wheel"; wheel: WheelSettings; label?: string }
  | { type: "tire"; tire: TireSettings; label?: string }
  | { type: "suspension"; label?: string };

function formatWheelWidth(width: number) {
  return width.toFixed(1).replace(".", "_");
}

function buildShopUrl(props: BuyButtonProps): string {
  if (props.type === "wheel") {
    const { width, offset, diameter } = props.wheel;
    const widthFormatted = formatWheelWidth(width);
    const offsetMin = Math.max(0, offset - 10);
    const offsetMax = offset + 10;

    return `https://www.driftworks.com/row/wheels-and-accessories/alloy-wheels/filter/filter_wheel_offset/${offsetMin}-${offsetMax}/filter_width/${widthFormatted}/wheel_diameter/${diameter}`;
  }

  if (props.type === "tire") {
    const {
      frontWidth,
      frontRatio,
      frontDiameter,
      rearWidth,
      rearRatio,
      rearDiameter,
      zipCode = "98104",
      performance = "ALL",
    } = props.tire;

    const url = new URL("https://www.tirerack.com/tires/TireSearchResults.jsp");
    url.searchParams.set("zip-code", zipCode);
    url.searchParams.set("width", `${frontWidth}/`);
    url.searchParams.set("ratio", String(frontRatio));
    url.searchParams.set("diameter", String(frontDiameter));
    url.searchParams.set("rearWidth", `${rearWidth}/`);
    url.searchParams.set("rearRatio", String(rearRatio));
    url.searchParams.set("rearDiameter", String(rearDiameter));
    url.searchParams.set("performance", performance);

    return url.toString();
  }

  // props.type === "suspension"
  return "https://www.driftworks.com/row/catalogsearch/result/?q=miata+coilovers";
}

const SHOP_LABELS: Record<BuyButtonProps["type"], string> = {
  wheel: STRINGS.shop.wheels,
  tire: STRINGS.shop.tires,
  suspension: STRINGS.shop.suspension,
};

export function BuyPartsButton(props: BuyButtonProps) {
  const label = props.label ?? SHOP_LABELS[props.type];

  return (
    <Button
      className="w-full bg-[#0DA5E8] text-white hover:bg-[#0b94d1] active:bg-[#0a84bd] transition-colors"
      onClick={() => {
        trackButtonClick();
        const url = buildShopUrl(props);
        window.open(url, "_blank", "noopener,noreferrer");
      }}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {label}
      <ExternalLink className="w-3 h-3 ml-1" />
    </Button>
  );
}
