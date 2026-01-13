import type { SavedConfigPayload } from "@/types/garage";

function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function fmtDeg(n?: number) {
  return isNum(n) ? `${n.toFixed(1)}°` : null;
}

function fmtIn(n?: number) {
  return isNum(n) ? `${n.toFixed(1)}"` : null;
}

function fmtMm(n?: number) {
  return isNum(n) ? `${Math.round(n)}mm` : null;
}

function up(s?: string) {
  return typeof s === "string" && s.length ? s.toUpperCase() : null;
}

// Produces one nice single-line summary for your card
export function payloadToPreview(payload?: SavedConfigPayload): string | null {
  if (!payload || typeof payload !== "object") return null;

  const model = up(payload.model);
  const s = (payload as any).settings ?? {};

  // Wheels
  const fw = fmtIn(s.frontWheelWidth);
  const fd = fmtIn(s.frontWheelDiameter);
  const rw = fmtIn(s.rearWheelWidth);
  const rd = fmtIn(s.rearWheelDiameter);

  const frontWheel = fw && fd ? `${fd}x${fw}F` : null;
  const rearWheel = rw && rd ? `${rd}x${rw}R` : null;

  // Alignment
  const fc = fmtDeg(s.frontCamber);
  const rc = fmtDeg(s.rearCamber);
  const ft = fmtDeg(s.frontToe);
  const rt = fmtDeg(s.rearToe);

  // Offset/spacer (mm)
  const fOff = fmtMm(s.frontWheelOffset);
  const rOff = fmtMm(s.rearWheelOffset);
  const fSp = fmtMm(s.frontWheelSpacer);
  const rSp = fmtMm(s.rearWheelSpacer);

  const parts: string[] = [];

  if (model) parts.push(model);
  if (frontWheel || rearWheel) parts.push([frontWheel, rearWheel].filter(Boolean).join(" • "));

  const camberPart = [fc ? `F ${fc}` : null, rc ? `R ${rc}` : null].filter(Boolean).join(" • ");
  if (camberPart) parts.push(`Camber: ${camberPart}`);

  const toePart = [ft ? `F ${ft}` : null, rt ? `R ${rt}` : null].filter(Boolean).join(" • ");
  if (toePart) parts.push(`Toe: ${toePart}`);

  const offPart = [fOff ? `F ${fOff}` : null, rOff ? `R ${rOff}` : null].filter(Boolean).join(" • ");
  if (offPart) parts.push(`Offset: ${offPart}`);

  const spPart = [fSp ? `F ${fSp}` : null, rSp ? `R ${rSp}` : null].filter(Boolean).join(" • ");
  if (spPart) parts.push(`Spacer: ${spPart}`);

  return parts.length ? parts.join(" — ") : null;
}
