# HANDOFF — J.J.'s Number Theory Sketchbook

**Last updated:** 2026-11-21
**Status:** All 15 modules + Ship's Bridge index built and delivered. **Phase 1 (safety net) is built — awaiting redeploy + iPad check.** Story Hooks + Name Tags are now in all 15 modules. The app's own cargo ship is built too. Send-to-hub is built (Sketchbook + hub). `node source/verify.js` → **181 passed, 0 failed, 0 warnings.**
**Live:** https://numbertheorysketchbook.vercel.app/ — also listed on the Engineering Academy hub, https://jj-engineer-port.vercel.app/
**In use:** J.J. practices on his iPad (alongside the hub's other apps). His progress is saved only on that iPad, so it can **never be inspected in a conversation** — treat every change as something that must not disturb saved progress.
**Confirmed by Jitiya:** deployment is fine; the reading level of the Stage 4 proofs/FAQs is right — keep that density.
**Format:** 16 standalone single-file HTML pages (vanilla JS, no build step, no dependencies except Google Fonts).

---

## 1. Start the next conversation with this

Upload this whole folder (or the zip) and paste:

```
Continue J.J.'s Number Theory Sketchbook. Read HANDOFF.md first, then run
`node source/verify.js` to confirm the package is healthy before touching anything.

Today I want to do Phase [N] from section 9 (the finish plan). J.J.'s progress lives only on his
iPad, so never rename a storage key or change the saved-state shape without the safe merge.

Working agreement: pilot one module first and wait for my OK before doing the batch;
explain the plan before any large change; verify every number with a live algorithm;
deliver the updated GitHub-style package (html files + source/ folder) at the end.
```

A plain "continue" or "go ahead" is enough to move to the next batch once a plan is agreed.

---

## 2. Package layout

```
number-theory-sketchbook/
├── index.html                  Ship's Bridge dashboard (links + live progress for all 15 modules)
├── module1_numbers.html        … module15_olympiad.html   (one file per module, fully self-contained)
├── HANDOFF.md                  this file
├── README.md                   deploy notes
└── source/
    ├── verify.js               regression suite (structure + 89 math checks) — run after EVERY change
    └── MODULE_TEMPLATE.html    locked skeleton + shared CSS for building a new/rebuilt module
```

There is no build pipeline: the HTML files **are** the source. (Unlike Number Sense Sketchbook, which is React + esbuild.)

---

## 3. Learner and house rules (non-negotiable)

**Learner:** J.J., 12, ADHD. Loves ocean liners/Titanic, chemistry labs, Super Mario. Preparing for scholarship exams (ASEAN/SBS, KVIS, GAT). Familiar with Singapore Math. Singapore CPA method applied to Cambridge curriculum.

**Every module has the same 5 stages, in this order:**
1. 📖 **Visual Model** — opens with something concrete he builds **one click at a time**. Never a bare text box + answer field.
2. 🔍 **Mental Strategy** — the shortcut/pattern, also built or revealed one step per click.
3. ⚙️ **General Rule** — rule card + a few worked examples + a "memory hook".
4. 💡 **Why It Works** — an easy proof (algebra-lite or picture), plus 1–2 FAQ cards.
5. 🚀 **Boss Level** — 3 cases (Titanic / Ship's Lab chemistry / Warp Pipe Mario) + **one** optional ⭐ bonus.

**Rules that apply everywhere:**
- **Step 1 beats perfection.** Every module has a motto banner phrased as one tiny action. Engineering language for encouragement ("Chief Engineer", "blueprint", "logbook").
- **Anti-freeze:** every problem has an escape hatch. Here it is "🔓 Show me the next step" — reveals ONE step at a time, never the whole answer at once, and the last step always states the answer outright.
- **Max one bonus per module.** Never stack optional stages. No timers, no streaks, nothing to lose.
- **Theme hierarchy (decided with Jitiya):** Titanic/ocean-liner is dominant in Stages 1–4. Chemistry and Mario appear **only** in the Boss Level.
- **Boss steps need real pictures** (requested twice). Any step describing a process gets a visual reusing the module's own Stage 1/2 renderer. Plain one-line arithmetic may stay a text row.
- **Wrong answers use amber, not red.** Success is sea-glass green. Less exam-anxiety.
- **iPad:** 44px minimum touch targets, `viewport-fit=cover`, `env(safe-area-inset-*)`, Apple web-app meta tags, `touch-action:manipulation`.
- **Reading level is confirmed right** (Jitiya, Nov 2026): keep the current wording density in Stage 4 proofs and FAQ cards. Don't make them longer or more formal.
- **Cambridge/Singapore convention:** Natural numbers start at **1**; 0 is the first Whole number (disclosed in Module 1's FAQ).

---

## 4. Module map

| # | File | Title / theme | localStorage key | Boss visual types |
|---|------|---------------|------------------|-------------------|
| 1 | `module1_numbers.html` | Numbers — Ship's Manifest | `nts_m1_numbers` | list ⚠️ |
| 2 | `module2_primes.html` | Prime Numbers — Watertight Compartments | `nts_m2_titanic` (legacy name, keep) | grid, strip |
| 3 | `module3_factors.html` | Factors — Cargo Container Manifest | `nts_m3_factors` | grid, pairs |
| 4 | `module4_multiples.html` | Multiples/LCM — Convoy Bell Schedule | `nts_m4_multiples` | list ⚠️ |
| 5 | `module5_divisibility.html` | Divisibility — Rapid Cargo Inspection | `nts_m5_divisibility` | digits, lasttwo |
| 6 | `module6_primefactor.html` | Prime Factorisation — Engine Room Towers | `nts_m6_primefactor` | towerstep |
| 7 | `module7_gcflcm.html` | GCF & LCM — Dry Dock Rectangles | `nts_m7_gcflcm` | cutbar, cutbarseries, tilegrid, countgrid |
| 8 | `module8_powers.html` | Powers — Ship Scaling Blueprints | `nts_m8_powers` | list ⚠️ |
| 9 | `module9_modular.html` | Modular Arithmetic — Ship's Clock | `nts_m9_modular` | dial, dialWithList |
| 10 | `module10_evenodd.html` | Even & Odd — Lifeboat Pairing | `nts_m10_evenodd` | boats, loneCrew, mismatch |
| 11 | `module11_patterns.html` | Number Patterns — Deck Stacking Sequences | `nts_m11_patterns` | cratepair, chipsum, fibchips |
| 12 | `module12_digitalroot.html` | Digital Root — Fuel Gauge Check | `nts_m12_digitalroot` | list, verdict ⚠️ |
| 13 | `module13_diophantine.html` | Diophantine — Cargo Balancing | `nts_m13_diophantine` | table (crate icons + leftover bars), list |
| 14 | `module14_proof.html` | Proof — Inspector's Logbook | `nts_m14_proof` | list, verdict ⚠️ |
| 15 | `module15_olympiad.html` | Olympiad Toolbox — Captain's Strategy Manual | `nts_m15_toolbox` | lights, list, verdict |

⚠️ = boss level still uses text rows / verdict boxes only — see Phase 2 in section 9.

Changing a storage key resets that module's saved progress. `index.html` reads each module's key to show its badge and progress dots, so **key names must match in both places** (verify.js checks this).

---

## 5. Architecture and conventions

**Every module file has the same skeleton** (see `source/MODULE_TEMPLATE.html`):
`MATH HELPERS → STATE (loadState/saveState with in-memory fallback) → NAV → renderStage1..5 → BOSS_DATA / renderVisual / renderBossCard → BONUS_STEPS → render()`.

- **State object** is saved whole: `{stage, completed[5], …stage fields…, boss_reveal:{1,2,3}, bonus_reveal}`. `index.html` only reads `state.completed` (array of 5 booleans).
- **Storage fallback:** if `localStorage` throws (file:// from AirDrop, Private Browsing) the module keeps state in memory and shows an amber "progress-saving is off" banner. Never remove this.
- **Rendering** is string templates into `#main` via `innerHTML`. Text uses HTML entities (`&times; &divide; &radic;`). There is no user-typed text anywhere, so no escaping issue today — if you ever add a text input, escape it.
- **Boss data shape:** `BOSS_DATA[id] = {tag, title, text, steps:[{text, visual?}]}`. `renderVisual(v)` is **per-module** — a visual `type` must be implemented inside that same file.
- **Shared CSS is duplicated in all 16 files** (needed so each file works alone via AirDrop/offline). A global style change means editing every file — see Phase 5 in section 9.
- **Design tokens:** paper `#E9EDF0`, blueprint navy `#0F3652`, brass `#B8834D`/`#E8C89A`, sea-glass `#4C9A8B`, amber `#E0A458`. Fonts: Space Mono (headings, numbers) + Quicksand (body) from Google Fonts with system fallbacks.

---

## 6. Reusable visual helpers (copy from the module that owns it)

| Helper | Lives in | What it draws |
|--------|----------|---------------|
| `renderDial(n, pos, size)` | M9 | SVG clock/wheel with N positions, needle at `pos` (null = no needle) |
| `renderFactorRainbowSVG(n)` | M3 | Nested factor-pair arcs with a "keel line" at √n |
| `renderCutBar(W,H,count,rem)` | M7 | Proportional bar: squares cut from a rectangle + remainder |
| `renderBoats(pairs, leftover)` | M10 | Lifeboat pairs + one lone amber crew member |
| `renderCrateIcons(n)` / `renderLeftoverBar(x,total,valid)` | M13 | Tiny crate squares / proportional green-amber bar |
| `.tower` / `.brick` | M6 | Stack of prime "bricks" dropping in |
| `.digitchip` / `.numstrip` | M5, M12 | Digit chips, highlighted as added |
| `.nestbox` (`buildNested`) | M1 | Nested containers for number-set hierarchy |
| `.stackrow` / `.crate` / `.fibchain` / `.fibterm` | M11 | Crate rows, mirrored pair, Fibonacci chips |
| `.lightgrid` / `.lightbulb` | M15 | Red/blue signal lights |
| `.sqgrid` / `.tile` / `.layerstack` | M8 | Square grids and stacked cube layers |
| `.multgrid` `.cell.markA/.markB/.markBoth` | M4 | 1–30 chart with two highlighted multiple lists |
| `.sievegrid` / `.stripgrid` | M2 | Sieve 2–50 and a short number strip |
| `.logentry` | M14 | Test-log rows (✅ / ⚠️ broken) |

---

## 7. Gotchas already hit (don't repeat them)

1. **Apostrophes in single-quoted JS strings.** `'Mario\'s'` double-escaped itself during generation and broke the file (hit in M2 and M13). Use `\u2019`, or switch that string to double quotes. verify.js warns on any `\'`.
2. **Mixed array/object data.** A table row written as `['0','0','x','valid':false]` is a syntax error. Rows are objects: `{cells:[…], valid:true}` or `{count, leftover, valid, yLabel}`.
3. **A visual type used but not implemented** in that file's `renderVisual` silently renders nothing. After adding a type, open the boss step and look.
4. **New state fields vs old saves.** `loadState()` returns the saved object as-is. If you add a field later, a child with old progress will get `undefined`. Fix by merging: `Object.assign({}, defaults, saved)`. Not needed today; **required before any state-shape change** — and since J.J.'s real progress lives on his iPad where it can't be inspected or repaired, this is Phase 1 of the plan.
5. **Do the arithmetic in code, not in your head.** An early hand-calculation of the M7 example (48&18) was wrong; the live algorithm caught it. Every new number goes into `verify.js`.
6. **Don't change a storage key** casually — it wipes progress and breaks the index badge.
7. **Google Fonts** need one online load; offline afterwards falls back to monospace/sans-serif (layout still fine).

---

## 8. Verification workflow (run after every change)

```
node source/verify.js
```
- **Part A:** every page compiles, brackets balance, storage keys unique and matching `index.html`, links resolve, house-rule scaffolding present (viewport-fit, safe-area, storage fallback, bonus, escape hatch, 44px targets).
- **Part B:** 40 checks re-deriving every hardcoded answer (primes, factor pairs, LCMs, digit sums, factorizations, Euclid steps, mods, parity, Fibonacci/triangular, digital roots, Diophantine solutions, Euler polynomial, working-backwards, invariants).
- Add a Part B check for every new number you hardcode. Exit code 1 on any failure.

---

## 9. Finish plan — phases for the next conversations

The app is **live and in daily use**, so everything below is *completion*, not repair. Already resolved: the iPad playtest (J.J. is using it), the reading-level check (confirmed right), and hub integration (it is listed on the hub).

**Hard constraint for every phase:** J.J.'s saved progress exists only on his iPad, under the 15 `nts_m*` keys (the hub's backup file does **not** cover this app — it lives on a different web address; the app's own Ship's Log now covers it). Never rename a key, never change the shape of `completed`, never ship a state-shape change without the Phase 1 safe merge. A bad deploy could silently orphan his progress and nobody could see it to fix it.

**How each phase runs** (your working agreement): plan first → pilot one module → you approve → batch the rest → `node source/verify.js` → deliver the updated package → you redeploy the same way as before → short check on the iPad.

### 9-NEW. Plan agreed 21 Nov 2026 (supersedes the order of Phases 2–6 below; those stay as the backlog)

Jitiya's feedback: J.J. keeps going but **forgets, and doesn't fully grasp explanations that arrive bluntly** (e.g. rational numbers). He likes Titanic, Super Mario, Frozen, VW Beetles, UFOs, cooking-as-chemistry, haunted houses. He also needs a backup, and the app needs its own ship on the hub.
**Decision:** Titanic stays the main frame. The other stories live inside a new **Story Hook** (3-tap picture story + one-line "Engineer's Note") placed before the blunt explanation. Draw with SVG/emoji, never official artwork. Reading level of Stage 4 stays as is.

| Phase | What | Status |
|-------|------|--------|
| 1 | Safe merge in all 15 modules + Ship's Log (Restore Code + backup file) on the Ship's Bridge | **BUILT 21 Nov — redeploy & check on iPad** |
| 2 | Story Hook pilot on Module 1 (rational numbers: ice-palace beam, √2 sliver) + Name Tags for the 5 number families | **DONE, approved by Jitiya 21 Nov** |
| 3 | The app's own cargo ship on the Ship's Bridge (15 parts, one per module; starting a module already lights its part) | **BUILT 21 Nov** |
| 4 | "Send to hub" button: opens the hub with progress attached (hub lights the cargo ship in its Fleet). Do NOT move the app to the hub's address — it would orphan his saved progress | **BUILT 22 Nov — deploy hub + Sketchbook together** |
| 5 | Story Hooks + Name Tags for modules 2–15 | **BUILT 21 Nov** (all 14 in one go, not 3 batches). Original plan:  (e.g. primes: haunted-house locked rooms; modular: UFO orbit; divisibility: cooking/chemistry; powers: Beetle scaling) | planned |

**Phase 1 details (what was built):**
- `mergeState(DEFAULT_STATE, loadState())` in every module. Saved values always win; new fields get defaults; `completed` is always 5 booleans. Storage keys and the saved shape are unchanged.
- Ship's Log on `index.html` (bottom card): **Restore Code** `NTS-XXXXX-XXXXX-XXXXX-XXXXX` (5 version bits + 75 progress bits + CRC16, Crockford base32, tolerant of case/spaces/O-0/I-1). It stores only the stages finished (`completed`), and restoring it **only adds** stages (OR), never erases. Plus a **full backup file** (`nts-progress-YYYY-MM-DD.json`, all 15 raw saves, share sheet on iPad, preview before restore, warns if the iPad has more progress than the file).
- The pure code lives between `// ==BACKUP-CORE-START==` and `// ==BACKUP-CORE-END==` in `index.html`; `verify.js` Part C evaluates that block directly. Don't move or rename those markers.
- A code-only restore creates a minimal save `{completed:[…]}`; the modules' safe merge fills the rest.
- verify.js Part C: merge test per module, 302 code round-trips, all 620 one-character typos refused, backup byte-for-byte round-trip, junk files refused. Also checked in jsdom: all 15 modules load from fresh / code-only / all-done saves with no errors.


### Phase 0 — Your prep (about 10 minutes, no code)
- **You:** watch J.J. use it once, or just ask him. Jot 3–5 notes: which modules he finishes, which he skips, where he freezes, which topics he asks to repeat, whether he uses "Show me the next step".
- **You:** bring the zip, paste the section 1 prompt, and tell Claude the notes. They decide the order of Phases 2–4.
- **You:** have your redeploy steps ready (how you pushed to Vercel last time).

### Phase 1 — Safety net (one short session) — DONE 21 Nov, see 9-NEW
- **1a. Safe state merge** in all 15 modules: `defaults + saved`, so a field added later never becomes `undefined` for a child with old progress.
- **1b. Backup & Restore on the Ship's Bridge:** Export/Import of all 15 `nts_m*` keys, copying the hub's "Ship's Log" pattern (share sheet → Save to Files on iPad, preview before restore). This protects the progress if iPad Safari data is ever cleared.
- **verify.js** gets checks for both (merge present in every module; export/import round-trips).
- **You:** redeploy, then open the index on the iPad and confirm J.J.'s badges and dots are unchanged. Do one Export and keep the file.
- *Done when:* verify passes and the iPad badges are identical before and after.

### Phase 2 — Finish the Boss Level pictures (one session)
- Pilot **Module 4** (bell chart cells), you approve, then batch **1, 8, 12, 14** and **15 case 2**. Reuse mapping: M1 nested holds · M4 `.multgrid` markA/markB/markBoth · M8 tile grid + stacked layers · M12 digit-chip rounds · M14 test-log rows · M15 value chain.
- verify.js gets a check that flags any module whose Boss visuals are only `list`/`verdict`.
- *Done when:* every Boss step that describes a process has a real picture in all 15 modules.

### Phase 3 — Practice Bay pilot (the biggest piece; 1–2 sessions)
The original goal was a **practice book**; today each module is lesson + 3 worked cases + 1 bonus. This phase adds repetition.
- **Design first, no code until you approve:** 5–8 generated problems per module; three tiers (Warm-up / Engineer / Competition); default view shows 3 problems and a clear stopping point; the same hint ladder as the Boss Level (strategy hint → first step → answer, always reachable); amber for wrong, no streaks or timers; answers computed by live algorithms, never typed in.
- **Pilot on one module** (suggest **Module 5 Divisibility** — fast to verify). You and J.J. try it once and report back.
- Needs Phase 1 (new state fields).
- *Done when:* you approve the pilot's feel and difficulty.

### Phase 4 — Roll Practice Bay out to the other 14 modules (3–4 sessions)
- Suggested batches, most exam-relevant first: **(2, 3, 6, 7)** → **(4, 8, 9, 12, 13)** → **(1, 10, 11, 14, 15)**.
- Each batch: build → verify (every generator checked against brute force) → you redeploy → J.J. tries.
- *Done when:* all 15 modules have a Practice Bay.

### Phase 5 — Ship's Bridge polish and final deploy (one session)
- Captain's Nudge on the index (suggests the next unfinished module or practice — no streaks, nothing to lose), practice dots on each card, overall completion banner.
- Cosmetics: Module 11's 🍄 header icon; optional pictures for the bonus steps.
- Optional: a small build script that injects one shared stylesheet into all 16 files (single-file output unchanged), so future style changes are one edit instead of sixteen.
- Final `verify.js`, refresh this HANDOFF, final deploy.

### Phase 6 — Optional: Mixed Review Arena
Interleaved questions drawn from all 15 modules for exam practice. Only worth building if J.J. wants it and it doesn't duplicate the Mock Exam Arena already in the KVIS app — decide after Phase 4.

### What "finished" means
All Boss pictures real · every module has a Practice Bay · progress protected (safe merge + backup) · Ship's Bridge nudge · `verify.js` green · deployed · this file updated.
Rough size: about 8–10 working sessions in total, front-loaded with the small safety work.

---

## 10. Module-by-module notes

1. **Numbers** — Stage 1: nested cargo holds opened one at a time (Natural→Whole→Integers→Rational→Real). Stage 2: "smallest hold" sorting of −4, 0, 0.75, 7, √2, 2.5. Why: n = n/1; √2 irrational; 0-is-Natural convention disclosed. Boss: −12/0/45; 3.5 & π; 1500 & √2. Bonus: history of √2.
2. **Primes** — Stage 1: row-arrangement tester (7–15 rivets). Stage 2: sieve 2–50 via flood tests 2,3,5,7. Why: 13 vs 12 attempts; why 1 isn't prime; why 2 is the only even prime. Boss: primes 20–30; 17 drops; 24 vs 23 blocks. Bonus: twin primes.
3. **Factors** — Stage 1: row tester → factor pairs. Stage 2: divisor-by-divisor to √N on 36, pair rows build a rainbow. Stage 3: `renderFactorRainbowSVG(36)`. Why: partners beyond √N repeat. Boss: 48, 36, 60. Bonus: 24.
4. **Multiples** — Stage 1: bell every d miles on a 1–30 chart. Stage 2: engine ×4 vs escort ×6, first shared mile = LCM. Why: start from the larger number. Boss: bells 4&6, dosing 5&8, blocks 3&4. Bonus: 9&12.
5. **Divisibility** — Stage 1: last digit → ÷2/5/10. Stage 2: digit-sum build → ÷3/9. Rule table incl. 4, 6, 8. Why: place value (399+27+digit-sum). Boss: 432/275/918 ÷9, 1,236 ÷4, 4,563 ÷3/9. Bonus: ÷11.
6. **Prime Factorisation** — Stage 1: live ladder division stacking prime bricks. Stage 2: two engineers split 72 differently, same tower. Why: process stops + order doesn't matter. Boss: 84, 90, 48 as tower states. Bonus: 100 vs 128 (more bricks, one prime).
7. **GCF & LCM** — Stage 1: live Euclid rectangle cutting (6 pairs). Stage 2: GCF×LCM = a×b shortcut. Why: area/tile-grid reasoning. Boss: dry dock 60×84, vial kits 36/24, blocks 8&12. Bonus: GCF(252,105) in 3 cuts.
8. **Powers** — Stage 1: square deck row by row. Stage 2: cube = n stacked squares (same n). Why: border adds 2n+1 (dynamic n); 2⁰=1 by pattern. Boss: 12→13 refit, 4³, 3³→6³ is ×8 not ×2. Bonus: power of zero.
9. **Modular** — Stage 1: SVG dial, step forward (5/6/7/8/12). Stage 2: divide, remainder = position. Why: complete laps vs leftover. Boss: 53 mod 8, 47 mod 6, 100 mod 9. Bonus: weekday in 100 days.
10. **Even & Odd** — Stage 1: pair crew into lifeboats. Stage 2: combine two crews (7&5, 8&5, 8&6). Why: 2k / 2k+1 algebra. Boss: 7 odd boats can't total 50; 15 tubes; odd+odd=even. Bonus: chessboard minus two corners.
11. **Patterns** — Stage 1: triangular crate stack. Stage 2: Fibonacci chain. Why: Gauss pairing (two stacks → rectangle). Boss: T(12)=78, F(10)=55, T(15)=120. Bonus: pentagonal numbers.
12. **Digital Root** — Stage 1: recursive digit-sum rounds. Stage 2: casting out nines (384×27 ✓, 47×86=4052 ✗). Why: digital root = mod 9 (9 not 0); honest limit — catches errors, can't prove correctness. Boss: rivet count, dilution error, bonus-round 6273. Bonus: 9×n.
13. **Diophantine** — Stage 1: 3x+5y=31 table with crate icons + leftover bars. Stage 2: trade +5/−3 finds more solutions. Why: 3·5 = 5·3 cancels. Boss: second combination, 4x+3y=23, 4x+7y=29. Bonus: 6x+9y=20 impossible (GCF).
14. **Proof** — Stage 1: test odd+odd four times (all pass). Stage 2: "all primes odd" survives 3,5,7,11 then 2 breaks it. Why: callbacks to M10 and M13 proofs. Boss: ALWAYS (6k multiple of 3), SOMETIMES (prime sums), NEVER (even prime > 2). Bonus: n²+n+41 fails at n=40.
15. **Olympiad Toolbox** — Stage 1: invariant signal lights (5 red of 8, flip 2). Stage 2: working backwards (tank 10 → 38). Stage 3: six-tool manual (two practiced). Boss: impossible lights, reverse dilution = 28, Mario possible in one move. Bonus: Handshake Lemma + finale banner.

---

## 11. Deployment

- **Live:** https://numbertheorysketchbook.vercel.app/ · **Hub entry:** https://jj-engineer-port.vercel.app/ (opens this app in its own tab). Already deployed and working — nothing in this package needs changing for the hub card.
- Put **all 16 HTML files in one folder** (links are relative — `index.html` alone will 404). `index.html` is the entry point.
- **Progress is per device and per web address.** J.J.'s lives in iPad Safari under `numbertheorysketchbook.vercel.app`. The hub is a different address, so its Voyage bar and backup file do not include this app (Phase 1b fixes the backup half).
- Files opened from Files/AirDrop (`file://`) may not save progress; the amber banner says so. The hosted site is the right way to use it.

---

## 12. Decision log

- **Standalone app, not a 13th World** in the Math Decoder — keeps its tool-usage tracking and stage-injection logic untouched.
- **Vanilla single-file HTML, no React/esbuild** — fastest iteration, no build dependency, matches the AirDrop/offline requirement. Trade-off: duplicated CSS (see Phase 5).
- **Pilot first:** Module 2 was built and approved before the template was locked, then iPad-hardened before scaling to the other 14.
- **Theme balance:** Titanic-dominant chosen over rotating primary themes, for consistency.
- **Filenames** `module{N}_{slug}.html` were fixed when `index.html` was built; renaming requires editing the index.
- **Boss visuals rule** added after screenshot feedback on M2 (text steps → real pictures), then retrofitted to M6, 7, 9, 10, 11, 13.
- **Nov 2026:** Deployed to Vercel and added to the hub; J.J. uses it on his iPad. Reading level confirmed right by Jitiya. Remaining work is the phased finish plan in section 9.


## Story Hooks & Name Tags (Nov 2026)
- **Module 1:** the hook sits in Stage 1 under the Rational and Real holds; each hold also gets a Name Tag (`NAMETAGS`, `renderNameTag`, `HOOKS`, `renderHook`).
- **Modules 2–15:** one shared engine (`shkVis`, `renderShk`, `shkGo`, CSS `.shk*`/`.ntag*`) plus per-module data `const SHK_DATA = {hook:{title,steps:[3]}, tags:[…]}`. It is shown at the **top of Stage 3 (Rule)**: `let html = (state.stage === 2 ? renderShk() : '') + renderers[state.stage]();`. Steps: 2 picture steps + a final 🔧 Engineer's Note. Hook step is not saved (resets on reload). "Skip the story" is always visible.
- Visual types: grids, strip, dial, pairs, stairs, double, chips, log, lights. To add a hook to a new module, add `SHK_DATA` only.
- Themes by module: M2 haunted-house wings · M3 Beetle parking · M4 Mario & Luigi jumps · M5 cookie sharing · M6 chemistry atoms · M7 ice-floor tiles · M8 UFO cloning · M9 UFO orbit clock · M10 Mario coin pairs · M11 Mario block stairs · M12 kitchen/chemist scale check · M13 egg boxes · M14 ghost detective · M15 Mario light switches.
- verify.js Part D checks the data shape and re-derives every number used in the stories.


## Cargo ship "S.S. Number Cruncher" (Nov 2026)
- Card sits under the Voyage bar on `index.html`. 15 parts, part *i* = module *i*: Keel · Hull & Watertight Walls · Container Stack A · Ship's Bell · Chemical Tanks · Engine Room · Rudder · Tall Container Stack · Bridge Tower & Clock · Lifeboats · Cargo Crane · Funnel · Ballast Tanks · Signal Mast · Captain's Flag. Each part's drawing is in `SHIP_SHAPES` (closed `path/rect/circle` shapes only, no `<g>`).
- Brightness of a part = stages finished ÷ 5. **Step 1 rule:** any finished stage shows at ≥ 50% opacity; merely opening a module (a save exists) draws a faint 30% sketch. Progress maths is the pure function `shipStats()` between `// ==SHIP-CORE-START==` and `// ==SHIP-CORE-END==` (tested by verify.js Part E).
- "Next" button: first module in progress, else first not started, else the "ALL SYSTEMS GO" launch message. Tapping a part chip glows that part and explains which module builds it.
- **Parent preview** link (in memory only, never saved): pretends 5 / 10 / 15 modules are done so the ship can be seen filling in. A banner says it is not real progress.
- Phase 4 (next): "Send to hub" so the hub's Fleet shows this ship lit. The hub's `EXTERNAL_APPS` entry for Number Theory already has `ship:"cargo"` (dry dock). The hub silhouette (`FLEET_ART.cargo`) would be replaced by a mini-render of these same shapes.


## Phase 4: Send to hub (Nov 2026)
**Two deploys:** (1) the Sketchbook (all 16 HTML files, as before) to `numbertheorysketchbook.vercel.app`; (2) `hub-index.html` from this package, saved as `index.html`, to the hub site `jj-engineer-port.vercel.app`. `source/` is NOT deployed. `source/hub-index.html` is only a copy kept so verify.js can test both sides together; if the hub changes, copy the new hub file there before running verify.js.
- **Sketchbook side:** ship card shows **📡 Send my ship to the Hub** once one stage is done. It opens `HUB_URL + '#nts=' + encodeURIComponent(RestoreCode)` in a new tab (`HUB_URL` const near the ship code). The code holds only which stages are done.
- **Hub side** (`index.html` of the hub; base file was the 22 Nov upload, 326 on-site fixes): reads `#nts=` on load, clears the hash, decodes (same format as the Sketchbook), and keeps a snapshot in `jj-hub-nts-v1` (`{v:1, completed:[15x5], savedAt}`). A newer code **only adds** stages (OR-merge), never removes. The snapshot:
  - adds 75 to the Voyage bar (now `/ 401` = 326 + 75),
  - fills the Number Theory mission card (stages, ship parts, "sent N days ago") and its paste box,
  - lights **S.S. Number Cruncher** in the Fleet (same 15 shapes as the Sketchbook; `NTS_SHAPES` must stay identical to `SHIP_SHAPES`, verify.js checks it),
  - is in the hub backup (`EXTRA_KEYS`) and shown in the import preview.
- **Why a paste box too:** if the hub is installed on the iPad home screen, links from the Sketchbook open in Safari, which has separate storage from the home-screen app. Pasting the Restore Code inside the home-screen app avoids that.
- The hub snapshot is only as fresh as the last send/paste. The hub says "sent N days ago". The Combinatorics Sketchbook is still not included.
- verify.js Part F: 200 codes decode identically on both sides, ship drawings identical, older code can't remove stages, bad codes change nothing, link format matches, voyage total matches.
