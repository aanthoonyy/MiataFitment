import { captureGoldens } from "./captureFitment";
import { GOLDENS_PATH, writeGoldens } from "./goldensFile";

const goldens = captureGoldens();
writeGoldens(goldens);

const counts = [
    `${Object.keys(goldens.corners).length} corners`,
    `${Object.keys(goldens.bounce).length} bounce traces`,
    `${Object.keys(goldens.suspension).length} suspension sweeps`,
    `${Object.keys(goldens.bounceRotations).length} bounce rotations`,
];

console.log(`captured ${counts.join(", ")} to ${GOLDENS_PATH}`);
