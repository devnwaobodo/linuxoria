# Linuxoria

Find the Linux distro that feels like yours. Astro static site, no backend.

## Run it
    npm install
    npm run dev            # http://localhost:4321
    npm run build          # outputs to dist/

Needs Node 22.23.4 or newer (Astro 7).

See DEPLOY.md for free hosting steps.

## Where things live
- `src/data/distros.json`  distro facts, trait scores, sources and verification dates
- `src/data/quiz.ts`       questions, the traits each answer adds, and hard rules
- `src/lib/recommend.ts`   scoring, rules, labels and the "why it fits" reasons
- `src/scripts/quiz.ts`    the quiz UI (answers are kept in the URL hash so results can be shared)
- `scripts/check-recommend.ts`  prints top picks for sample profiles: `npx tsx scripts/check-recommend.ts`
- `scripts/test-quiz-ui.ts`     simulates a full quiz run in a fake browser

## Rules for data
Trait scores (0-5) are editorial opinions. Facts are re-checked when a release changes (Linux Mint 23 is planned for December 2026).
