// Run with: npx tsx scripts/test-quiz-ui.ts   (simulates a person taking the quiz in a fake browser)
import { JSDOM } from "jsdom";

const dom = new JSDOM(`<!doctype html><body><main id="app"></main></body>`, { url: "http://localhost/quiz/" });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, location: dom.window.location, history: dom.window.history });

await import("../src/scripts/quiz");

const doc = dom.window.document;
const click = (sel: string) => (doc.querySelector(sel) as HTMLElement).click();
const text = () => doc.querySelector("#app")!.textContent!.replace(/\s+/g, " ");

const picks = [0, 0, 2, 0, 1, 0]; // new, stable, not gaming, little tinkering, average hardware, predictable
console.log("Start:", doc.querySelector("h1")!.textContent);
for (let i = 0; i < picks.length; i++) {
  const next = doc.querySelector('[data-act="next"]') as HTMLButtonElement;
  console.log(`  step ${i + 1}: next disabled before picking = ${next.disabled}`);
  click(`[data-act="pick"][data-i="${picks[i]}"]`);
  click('[data-act="next"]');
}
console.log("Heading:", doc.querySelector("h1")!.textContent);
console.log("Hash:", dom.window.location.hash);
console.log("Cards:", [...doc.querySelectorAll(".card h2, .card h3")].map((e) => e.textContent).join(" | "));
console.log("Tags:", [...doc.querySelectorAll(".tag")].map((e) => e.textContent).join(" | "));
console.log("Has % sign:", /\d%/.test(text()));
click('[data-act="retake"]');
console.log("After retake:", doc.querySelector("h1")!.textContent, "| hash:", JSON.stringify(dom.window.location.hash));
