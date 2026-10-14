# Mani Poorna — portfolio

A developer portfolio with an engineering-drawing look: drafting paper, ink and blueprint blue, a title block, and an exploded view of the stack. Built with React and Vite, with hand-drawn SVG instead of WebGL.

```bash
npm install
npm run dev        # http://localhost:5175
npm run build      # static site in dist/
npm run preview
```

## Look

Two looks, switched from the header and remembered: **Paper** (ink on drafting paper) and **Blueprint**
(white lines on cyanotype blue). It follows the visitor's light or dark preference the first time. Extras:
construction lines that draw in behind the cover, an exploded view of the stack with a request falling through it,
ruler ticks in the margins, a faint paper grain, and an exploded view of the stack. On
the Work sheet, hovering a layer lights up its legend entry and the other way round. Reduced motion is respected.

## Sections

| # | Section | What it is |
|---|---|---|
| 01 | Home | Name and the exploded stack drawing |
| 02 | About | Summary and an at-a-glance block |
| 03 | Projects | Projects as isometric diagrams, each with its own page (`#/work/pos`, `#/work/audit`, `#/work/insight`) |
| 04 | Code | A git-graph drawing of the workflow, plus live public repositories once a GitHub URL is set |
| 05 | Experience | Work history and education |
| 06 | Skills | Technologies grouped by area |
| 07 | Kind words | Testimonials |
| 08 | Contact | A message form, plus email, LinkedIn and résumé links |

## Content to fill in

- **Photo:** `public/profile.jpg`.
- **GitHub:** set `github` in `src/data/profile.js`. The Code section then loads public repositories, stars and top language from the GitHub API.
- **Sample content:** project 03 (`sample: true` in `src/data/projects.js`) and the testimonials (`src/data/proof.js`) are placeholders, labelled on the page. Replace or delete them.
- **Project pages:** add `links: { live, repo }` and `shots: [{ src, alt, caption }]` to a project, and the buttons and a Screens section appear.

## What still needs real input

Anything not on the résumé is left empty and hidden, never invented.

| What | Where |
|---|---|
| Portrait | put `profile.jpg` in `public/` (about 4:5); a drafted placeholder shows until then |
| GitHub URL | `github` in `src/data/profile.js` |
| Project links | add `links: { live, repo }` to a project in `src/data/projects.js` |
| Metrics and dates | `outcomes` and `meta` in `src/data/projects.js` (currently qualitative, from the résumé) |
| Site address | `VITE_SITE_URL`, for the canonical link and share image |

## Contact form

Sends through [EmailJS](https://www.emailjs.com) (service `service_081rxbt`, template `template_5z0hq53`). Put your EmailJS **Public Key** in `.env` as `VITE_EMAILJS_PUBLIC_KEY` (and as an environment variable on your host). The template can use these variables: `name`, `email`, `message`, `from_name`, `from_email`, `reply_to`, `to_name`, `time`. Without a key, or if the send fails, it opens the visitor's email app and says so, with a "Copy address" button. It never claims success unless the send worked.

Regenerate the share image with `node scripts/make-og.mjs`.

The résumé PDF in `public/` lists a phone number; the site itself never shows it.
