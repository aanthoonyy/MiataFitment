import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Goldens } from "./captureFitment";

// Resolved off this module rather than the working directory, so capturing and
// checking agree no matter where npm was run from.
export const GOLDENS_PATH = fileURLToPath(new URL("./goldens.json", import.meta.url));

export function readGoldens(): Goldens {
    return JSON.parse(readFileSync(GOLDENS_PATH, "utf8")) as Goldens;
}

// Written in key order rather than capture order, so reordering a loop upstream
// produces no diff at all and a real change is the only thing a reviewer sees.
const sortByKey = <T>(record: Record<string, T>): Record<string, T> =>
    Object.fromEntries(
        Object.entries(record).sort(([left], [right]) =>
            left < right ? -1 : left > right ? 1 : 0,
        ),
    );

export function writeGoldens(goldens: Goldens): void {
    const sorted: Goldens = {
        corners: sortByKey(goldens.corners),
        bounce: sortByKey(goldens.bounce),
        suspension: sortByKey(goldens.suspension),
        bounceRotations: sortByKey(goldens.bounceRotations),
    };
    writeFileSync(GOLDENS_PATH, `${JSON.stringify(sorted, null, 2)}\n`);
}
