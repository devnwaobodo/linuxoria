export type Trait =
  | "beginner"        // easy to install and use for newcomers
  | "stability"       // fewer surprises, slower-changing
  | "freshness"       // newest software and kernels
  | "customization"   // how much you can shape it
  | "gaming"          // out-of-the-box gaming friendliness
  | "lowSpec"         // runs well on older or weaker hardware
  | "lowMaintenance"; // set it and forget it

export type Traits = Record<Trait, number>; // 0-5, editorial scores

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Specialty = "gaming";

export interface Distro {
  slug: string;
  name: string;
  base: string;
  packageManager: string;
  releaseModel: "fixed" | "rolling" | "image-based" | "declarative";
  desktops: string[];
  difficulty: Difficulty;
  specialty?: Specialty;   // set when the distro is built around one use case
  liveDesktop: boolean;    // can you try it from a USB stick with a full desktop?
  summary: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  traits: Traits;
  website: string;
  lastVerified: string | null;
  confidence: "high" | "medium";
  sources: string[];
  verificationNote: string;
}

/** Hard filters an answer can apply to the pool of distros. */
export interface Rules {
  maxDifficulty?: Difficulty;
  exclude?: Specialty[];
}

export interface QuizOption {
  label: string;
  chip: string;                 // short version shown on the results page
  weights: Partial<Traits>;     // added to the user's preference profile
  rules?: Rules;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}
