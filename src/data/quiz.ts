import type { QuizQuestion } from "../types";

export const questions: QuizQuestion[] = [
  {
    id: "experience",
    question: "How much Linux experience do you have?",
    options: [
      { label: "None. I’m coming from Windows or macOS", chip: "New to Linux",
        weights: { beginner: 5, lowMaintenance: 2 }, rules: { maxDifficulty: "beginner" } },
      { label: "Some. I’ve tried it before", chip: "Some Linux experience",
        weights: { beginner: 2 }, rules: { maxDifficulty: "intermediate" } },
      { label: "A lot. I’m comfortable in the terminal", chip: "Comfortable with Linux",
        weights: { customization: 2 } },
    ],
  },
  {
    id: "software",
    question: "What matters more to you?",
    options: [
      { label: "Things that just work and rarely change", chip: "Things should just work",
        weights: { stability: 4, lowMaintenance: 2 } },
      { label: "A bit of both", chip: "A balance of stable and new",
        weights: { stability: 2, freshness: 2 } },
      { label: "The newest software, as soon as it’s out", chip: "Newest software",
        weights: { freshness: 4 } },
    ],
  },
  {
    id: "gaming",
    question: "Will you game on this computer?",
    options: [
      { label: "Yes, it’s a big part of why I’m switching", chip: "Gaming is a priority",
        weights: { gaming: 5 } },
      { label: "Occasionally", chip: "Occasional gaming",
        weights: { gaming: 2 } },
      { label: "No", chip: "Not gaming",
        weights: {}, rules: { exclude: ["gaming"] } },
    ],
  },
  {
    id: "tinkering",
    question: "How do you feel about tinkering with your setup?",
    options: [
      { label: "I want to use my computer, not configure it", chip: "Little tinkering",
        weights: { lowMaintenance: 4, beginner: 1 } },
      { label: "A little is fine", chip: "Happy to tinker a little",
        weights: { customization: 1 } },
      { label: "I love customizing everything", chip: "Love customizing",
        weights: { customization: 5 } },
    ],
  },
  {
    id: "hardware",
    question: "What are you installing it on?",
    options: [
      { label: "Older or low-end hardware (4GB RAM or less)", chip: "Older hardware",
        weights: { lowSpec: 5 } },
      { label: "Average, a few years old", chip: "Average hardware",
        weights: { lowSpec: 1 } },
      { label: "Modern and powerful", chip: "Modern hardware",
        weights: {} },
    ],
  },
  {
    id: "maintenance",
    question: "How do you feel about updates occasionally breaking things?",
    options: [
      { label: "I’d hate that. Keep it predictable", chip: "Predictable updates",
        weights: { stability: 3, lowMaintenance: 3 } },
      { label: "Acceptable if it means newer software", chip: "Newer over predictable",
        weights: { freshness: 2 } },
      { label: "I enjoy fixing things when they break", chip: "Fine with fixing things",
        weights: { customization: 2, freshness: 2 } },
    ],
  },
];
