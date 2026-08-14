import { captureGoldens } from "./captureFitment";
import { GOLDENS_PATH, writeGoldens } from "./goldensFile";

const goldens = captureGoldens();
writeGoldens(goldens);

const cornerCount = Object.keys(goldens.corners).length;
const bounceCount = Object.keys(goldens.bounce).length;
const suspensionCount = Object.keys(goldens.suspension).length;

console.log(
    `captured ${cornerCount} corners, ${bounceCount} bounce traces and ` +
        `${suspensionCount} suspension sweeps to ${GOLDENS_PATH}`,
);
