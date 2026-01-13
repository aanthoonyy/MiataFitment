export type ChangelogEntry = {
  date: string; // YYYY-MM-DD
  version?: string; // optional
  title: string;
  changes: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-01-13",
    version: "1.0.1",
    title: "UI Overhaul",
    changes: [
      "Fixed various UI Bugs",
      "Adjust how caster was calculated",
      "Added metric/imperial unit toggle",
      "Converted ride height display to hub-to-fender mapping",
      "Added a garage for storing car configurations",
    ],
  },
];
