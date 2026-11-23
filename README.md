# J.J.'s Number Theory Sketchbook

Fifteen interactive training modules (Numbers → Olympiad Toolbox) for J.J., themed as a
Titanic-era engineering academy. Every module follows the same five stages:
Visual Model → Mental Strategy → General Rule → Why It Works → Boss Level (Competition Challenge).

- **Entry point:** `index.html` (the Ship's Bridge dashboard — links and live progress for all modules)
- **Modules:** `module1_numbers.html` … `module15_olympiad.html` (each fully standalone)
- **Continuing the project:** read `HANDOFF.md`, then run `node source/verify.js`

## Deploy
Upload the whole folder (all 16 HTML files together — links are relative) to Vercel, Netlify Drop
or GitHub Pages. Progress is saved per device in localStorage; each module has its own key.

## Tooling
- `source/verify.js` — syntax, structure and math regression suite (no dependencies; needs Node)
- `source/MODULE_TEMPLATE.html` — locked skeleton + shared CSS for new or rebuilt modules


## Save & Restore (added Nov 2026)
The Ship's Bridge (index.html) has a **Ship's Log** card at the bottom: copy a Restore Code, paste one back, or save/load a full backup file. Deploy as before (all 16 HTML files in one folder). After deploying, open the index on the iPad, confirm the badges are unchanged, then tap **Copy My Code** and keep it in Notes.
