import { describe, expect, it } from "vitest";
import { captureGoldens } from "./captureFitment";
import { readGoldens } from "./goldensFile";

// Captured once for the whole file: building every corner is the expensive part
// and none of these tests mutate the result.
const expected = readGoldens();
const actual = captureGoldens();

describe("goldens", () => {
    it("covers the same cases as when they were captured", () => {
        expect(Object.keys(actual.corners).sort()).toEqual(
            Object.keys(expected.corners).sort(),
        );
        expect(Object.keys(actual.bounce).sort()).toEqual(
            Object.keys(expected.bounce).sort(),
        );
        expect(Object.keys(actual.suspension).sort()).toEqual(
            Object.keys(expected.suspension).sort(),
        );
        expect(Object.keys(actual.bounceRotations).sort()).toEqual(
            Object.keys(expected.bounceRotations).sort(),
        );
    });
});

// One test per case rather than one deep comparison of everything, so a failure
// names the corner that moved instead of printing every corner that did not.
describe("corner geometry", () => {
    for (const key of Object.keys(expected.corners)) {
        it(key, () => {
            expect(actual.corners[key]).toEqual(expected.corners[key]);
        });
    }
});

describe("bounce simulation", () => {
    for (const key of Object.keys(expected.bounce)) {
        it(key, () => {
            expect(actual.bounce[key]).toEqual(expected.bounce[key]);
        });
    }
});

describe("suspension geometry", () => {
    for (const key of Object.keys(expected.suspension)) {
        it(key, () => {
            expect(actual.suspension[key]).toEqual(expected.suspension[key]);
        });
    }
});

describe("bounce rotation", () => {
    for (const key of Object.keys(expected.bounceRotations)) {
        it(key, () => {
            expect(actual.bounceRotations[key]).toEqual(
                expected.bounceRotations[key],
            );
        });
    }
});
