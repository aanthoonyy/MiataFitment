import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Goldens } from "./captureFitment";

// Resolved off this module rather than the working directory, so capturing and
// checking agree no matter where npm was run from.
export const GOLDENS_PATH = fileURLToPath(new URL("./goldens.json", import.meta.url));

export function readGoldens(): Goldens {
    return JSON.parse(readFileSync(GOLDENS_PATH, "utf8")) as Goldens;
}

export function writeGoldens(goldens: Goldens): void {
    writeFileSync(GOLDENS_PATH, `${JSON.stringify(goldens, null, 2)}\n`);
}
