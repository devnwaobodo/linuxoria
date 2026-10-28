import distros from "../data/distros.json";
import { questions } from "../data/quiz";
import { optionsFromAnswers, recommend, type Recommendation } from "../lib/recommend";
import type { Distro } from "../types";

const app = document.getElementById("app") as HTMLElement;
const emailAction = app.dataset.emailAction ?? "";
const allDistros = distros as unknown as Distro[];
const N = questions.length;

interface State {
  view: "quiz" | "results";
  step: number;
  answers: (number | null)[];
}
const state: State = { view: "quiz", step: 0, answers: Array(N).fill(null) };

const RELEASE_LABELS: Record<Distro["releaseModel"], string> = {
  fixed: "Fixed releases",
  rolling: "Rolling",
  "image-based": "Image-based",
  declarative: "Declarative",
};

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

/* Answers live in the URL hash (#r=0-1-2-0-1-0) so a result can be shared or revisited. */
function readHash(): number[] | null {
  const m = location.hash.match(/^#r=([0-9-]+)$/);
  if (!m) return null;
  const parts = m[1].split("-").map(Number);
  if (parts.length !== N) return null;
  const valid = parts.every((a, i) => Number.isInteger(a) && a >= 0 && a < questions[i].options.length);
  return valid ? parts : null;
}
const writeHash = () => history.replaceState(null, "", `#r=${state.answers.join("-")}`);
const clearHash = () => history.replaceState(null, "", location.pathname + location.search);

function focusHeading() {
  app.querySelector<HTMLElement>("h1")?.focus();
}

function renderQuiz() {
  const q = questions[state.step];
  const selected = state.answers[state.step];
  const isLast = state.step === N - 1;
  app.className = "wrap-narrow";
  app.innerHTML = `
    <p class="eyebrow">Step ${state.step + 1} of ${N}</p>
    <div class="segments" aria-hidden="true">
      ${questions.map((_, i) => `<span class="${i <= state.step ? "on" : ""}"></span>`).join("")}
    </div>
    <h1 tabindex="-1">${esc(q.question)}</h1>
    <p class="lede">There are no wrong answers. Pick whatever sounds most like you.</p>
    <div class="options" role="group" aria-label="${esc(q.question)}">
      ${q.options
        .map(
          (o, i) => `<button type="button" class="option" data-act="pick" data-i="${i}" aria-pressed="${selected === i}">
            <span class="radio" aria-hidden="true"></span>${esc(o.label)}</button>`
        )
        .join("")}
    </div>
    <div class="quiz-nav">
      <button type="button" class="btn btn-ghost" data-act="back" ${state.step === 0 ? "disabled" : ""}>Back</button>
      <button type="button" class="btn btn-primary" data-act="next" ${selected === null ? "disabled" : ""}>${isLast ? "See my results" : "Next"}</button>
    </div>`;
  focusHeading();
}

function renderResults() {
  const answers = state.answers as number[];
  const chosen = optionsFromAnswers(questions, answers);
  const results = recommend(chosen, allDistros);
  const [best, ...others] = results;
  app.className = "wrap-wide";
  app.innerHTML = `
    <div class="results">
      <div class="hero">
        <div>
          <p class="eyebrow">Your starting point</p>
          <h1 tabindex="-1">${esc(best.distro.name)} looks like your best fit</h1>
          <p class="lede">Here’s what you told us, and the distros that suit it best.</p>
          <div class="chips">${chosen.map((o) => `<span class="chip">${esc(o.chip)}</span>`).join("")}</div>
        </div>
      </div>
      ${bestCard(best)}
      <div class="alts">${others.map(altCard).join("")}</div>
      ${emailAction ? emailBlock() : ""}
      <div class="restart">
        <button type="button" data-act="edit">Change my answers</button>
        <button type="button" data-act="retake">Retake the quiz</button>
      </div>
    </div>`;
  focusHeading();
}

const reasonItem = (r: { chip: string; text: string }) => `<li><strong>${esc(r.chip)}.</strong> ${esc(r.text)}</li>`;

function bestCard({ distro: d, label, reasons }: Recommendation): string {
  return `
    <section class="card card-best">
      <div class="title-row"><h2>${esc(d.name)}</h2><span class="tag tag-best">${label}</span></div>
      <p class="lede" style="margin:0">${esc(d.summary)}</p>
      <div>
        <p style="margin:0 0 10px;font-weight:700;font-size:17px">Why it fits what you told us</p>
        <ul class="reasons">${reasons.map(reasonItem).join("")}</ul>
        <p class="note" style="margin-top:14px"><strong>Worth knowing:</strong> ${esc(d.cons[0])}.</p>
      </div>
      <dl class="facts">
        <div><dt>Base</dt><dd>${esc(d.base)}</dd></div>
        <div><dt>Releases</dt><dd>${RELEASE_LABELS[d.releaseModel]}</dd></div>
        <div><dt>Difficulty</dt><dd>${esc(d.difficulty)}</dd></div>
        <div><dt>Desktops</dt><dd>${esc(d.desktops.join(", "))}</dd></div>
      </dl>
      ${
        d.liveDesktop
          ? `<div class="try">
               <div><strong>Try it before you commit</strong>
               <p>Run ${esc(d.name)} from a USB stick without installing anything. Your current system stays exactly as it is.</p></div>
               <a class="btn btn-primary" href="/distros/${d.slug}/#try-it">See how to try it</a>
             </div>`
          : ""
      }
      <div class="links"><a class="link-accent" href="/distros/${d.slug}/">Read the full ${esc(d.name)} guide</a></div>
    </section>`;
}

function altCard({ distro: d, label, reasons }: Recommendation): string {
  const first = reasons[0];
  return `
    <section class="card">
      <span class="tag">${label}</span>
      <h3>${esc(d.name)}</h3>
      <p>${esc(d.summary)}</p>
      ${first ? `<p style="color:var(--text)"><strong>${esc(first.chip)}.</strong> ${esc(first.text)}</p>` : ""}
      <p class="note"><strong>Worth knowing:</strong> ${esc(d.cons[0])}.</p>
      <div class="links"><a class="link-accent" href="/distros/${d.slug}/">See ${esc(d.name)} details</a></div>
    </section>`;
}

function emailBlock(): string {
  return `
    <section class="card email">
      <div style="flex:1;min-width:280px"><h2 style="font-size:22px;margin-bottom:6px">Want this in your inbox?</h2>
      <p>We’ll send your result and a setup guide for your pick. No spam.</p></div>
      <form action="${esc(emailAction)}" method="post">
        <div><label for="email">Email address</label><input id="email" name="email" type="email" required placeholder="you@example.com" autocomplete="email"></div>
        <button type="submit" class="btn btn-primary">Email me</button>
      </form>
    </section>`;
}

app.addEventListener("click", (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>("[data-act]");
  if (!el) return;
  switch (el.dataset.act) {
    case "pick": {
      state.answers[state.step] = Number(el.dataset.i);
      // Update in place so keyboard focus is not lost.
      app.querySelectorAll<HTMLElement>(".option").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === el))
      );
      app.querySelector<HTMLButtonElement>('[data-act="next"]')!.disabled = false;
      break;
    }
    case "next":
      if (state.step < N - 1) {
        state.step++;
        renderQuiz();
      } else {
        state.view = "results";
        writeHash();
        renderResults();
      }
      break;
    case "back":
      if (state.step > 0) { state.step--; renderQuiz(); }
      break;
    case "edit":
      state.view = "quiz"; state.step = 0; clearHash(); renderQuiz();
      break;
    case "retake":
      state.view = "quiz"; state.step = 0; state.answers = Array(N).fill(null); clearHash(); renderQuiz();
      break;
  }
});

const fromHash = readHash();
if (fromHash) {
  state.answers = fromHash;
  state.view = "results";
  renderResults();
} else {
  renderQuiz();
}
