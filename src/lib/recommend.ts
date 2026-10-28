import type { Distro, Difficulty, QuizOption, QuizQuestion, Specialty, Trait } from "../types";

export type Label = "Best match" | "Also a great fit" | "Worth a look";

export interface Reason {
  chip: string; // the answer the reason responds to
  text: string; // why this distro fits it
}

export interface Recommendation {
  distro: Distro;
  label: Label;
  reasons: Reason[];
}

const TRAITS: Trait[] = [
  "beginner", "stability", "freshness", "customization", "gaming", "lowSpec", "lowMaintenance",
];

const DIFFICULTY_RANK: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };

const PHRASES: Record<Trait, string> = {
  beginner: "is approachable if you’re new to Linux.",
  stability: "keeps updates slow and predictable.",
  freshness: "keeps you on recent software.",
  customization: "gives you deep control over how it looks and works.",
  gaming: "works well for gaming.",
  lowSpec: "runs well on older or lower-end hardware.",
  lowMaintenance: "needs very little upkeep once it’s set up.",
};

/** Turn a list of chosen answers into recommendations. Pure and easy to test. */
export function recommend(
  chosen: QuizOption[],
  distros: Distro[],
  topN = 3
): Recommendation[] {
  // 1. Preference profile: add up the weights of every chosen answer.
  const profile = Object.fromEntries(TRAITS.map((t) => [t, 0])) as Record<Trait, number>;
  for (const option of chosen) {
    for (const t of TRAITS) profile[t] += option.weights[t] ?? 0;
  }

  // 2. Hard rules: answers can rule distros out entirely.
  let maxRank = DIFFICULTY_RANK.advanced;
  const excluded = new Set<Specialty>();
  for (const option of chosen) {
    if (option.rules?.maxDifficulty) {
      maxRank = Math.min(maxRank, DIFFICULTY_RANK[option.rules.maxDifficulty]);
    }
    option.rules?.exclude?.forEach((s) => excluded.add(s));
  }
  let pool = distros.filter(
    (d) =>
      DIFFICULTY_RANK[d.difficulty] <= maxRank &&
      !(d.specialty && excluded.has(d.specialty))
  );
  if (pool.length < topN) pool = distros; // never return fewer than topN

  // 3. Score: how well each distro's traits line up with what the user asked for.
  const maxPossible = TRAITS.reduce((sum, t) => sum + profile[t] * 5, 0) || 1;
  const scored = pool
    .map((distro) => ({
      distro,
      score: TRAITS.reduce((sum, t) => sum + profile[t] * distro.traits[t], 0) / maxPossible,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  // 4. Labels and reasons. No numbers are ever shown to the user.
  const top = scored[0]?.score ?? 0;
  return scored.map(({ distro, score }, i) => ({
    distro,
    label: i === 0 ? "Best match" : score >= top * 0.8 ? "Also a great fit" : "Worth a look",
    reasons: buildReasons(chosen, distro),
  }));
}

/** Up to three reasons, each tied to an answer the user actually gave. */
function buildReasons(chosen: QuizOption[], distro: Distro): Reason[] {
  const seen = new Set<Trait>();
  const candidates: Array<{ value: number; trait: Trait; chip: string }> = [];

  for (const option of chosen) {
    for (const t of TRAITS) {
      const weight = option.weights[t] ?? 0;
      if (weight > 0 && distro.traits[t] >= 4) {
        candidates.push({ value: weight * distro.traits[t], trait: t, chip: option.chip });
      }
    }
  }

  return candidates
    .sort((a, b) => b.value - a.value)
    .filter((c) => (seen.has(c.trait) ? false : (seen.add(c.trait), true)))
    .slice(0, 3)
    .map((c) => ({ chip: c.chip, text: `${distro.name} ${PHRASES[c.trait]}` }));
}

export function optionsFromAnswers(questions: QuizQuestion[], answers: number[]): QuizOption[] {
  return answers.map((a, i) => questions[i].options[a]);
}
