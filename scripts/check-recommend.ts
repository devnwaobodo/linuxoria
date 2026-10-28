// Run with: npx tsx scripts/check-recommend.ts
import distros from "../src/data/distros.json";
import { questions } from "../src/data/quiz";
import { optionsFromAnswers, recommend } from "../src/lib/recommend";
import type { Distro } from "../src/types";

const profiles: Record<string, number[]> = {
  "New, stable, not gaming, little tinkering, average hardware": [0, 0, 2, 0, 1, 0],
  "New, gamer, balanced":                                       [0, 1, 0, 0, 2, 1],
  "Expert, newest software, loves customizing":                 [2, 2, 1, 2, 2, 2],
  "Some experience, older hardware, predictable":               [1, 0, 2, 1, 0, 0],
};

for (const [name, answers] of Object.entries(profiles)) {
  const results = recommend(optionsFromAnswers(questions, answers), distros as unknown as Distro[]);
  console.log(`\n${name}`);
  for (const r of results) console.log(`  ${r.label.padEnd(17)} ${r.distro.name}`);
}
