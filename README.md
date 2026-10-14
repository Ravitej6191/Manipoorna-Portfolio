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
| 01 | Home | Name, intro and the developer's desk drawing |
| 02 | About | Summary and an at-a-glance block |
| 03 | Projects | Projects as diagrams, each with its own page at `/work/<id>/` (case study, flow chart, optional screens, prototype and before/after) |
| 04 | Experience | Work history and education, with a rail that fills as you read |
| 05 | Skills | Technologies grouped by area |
| 06 | Code | A git-graph drawing of the workflow, plus live public repositories once a GitHub URL is set |
| 07 | AI | How AI is used (code review, debugging, dev tools, learning) and the tools, from `src/data/ai.js` |
| 08 | Kind words | Testimonials |
| 09 | Contact | A message form, plus email (with a copy icon), LinkedIn and resume links |

A Notes section (`src/data/notes.js`) appears between AI and Kind words once it has entries.

## Content to fill in

- **Photo:** `public/profile.jpg`.
- **GitHub:** set `github` in `src/data/profile.js`. The Code section then loads public repositories, stars and top language from the GitHub API.
- **Worth checking:** Talus Pay's text (`src/data/projects.js`) is written from its name and the style of the other two projects, and the testimonial quotes (`src/data/proof.js`) are drafted from each role. Replace them with the real details and words.
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

## Deploy

The site is static: `npm run build` writes `dist/`. On Vercel or Netlify, import the repository (build command `npm run build`, output folder `dist`) and add these environment variables:

- `VITE_EMAILJS_PUBLIC_KEY`: your EmailJS public key (the contact form).
- `VITE_SITE_URL`: the final address, such as `https://yourname.com`. It fills the canonical link, share image and structured data. Without it those tags are left out.

Project pages are real paths (`/work/talus-pay/`). The build writes a static page for each one, with its own title, description and share image, plus `404.html`, `sitemap.xml` and `robots.txt`. Old `#/work/...` links are forwarded to the new paths. Headers (a Content-Security-Policy and friends) are in `vercel.json` and `public/_headers` for Vercel and Netlify. If a project is added, run `npm run og` to make its share image.

## Features worth knowing

- **Command palette:** Ctrl+K (Cmd+K on a Mac) or `/`. Jump to a section, open a project, switch the look, copy the email, open GitHub or LinkedIn.
- **404:** an unknown address shows a terminal-style page.
- **Look:** a saved choice wins; otherwise Blueprint at night (7pm to 6am) or when the system prefers dark.
- **Availability and booking:** set `availability` and `booking` in `src/data/profile.js`; both stay hidden while empty.
- **Project extras (all optional):** `links`, `shots`, `figma`, `compare`, `reflection` and `quote` in `src/data/projects.js`.
- **Tests:** `npm test` (after a build) checks the content and the build output. `.github/workflows/ci.yml` runs it with Lighthouse on every push.

## Contact form

Sends through [EmailJS](https://www.emailjs.com) (service `service_081rxbt`, template `template_5z0hq53`). Put your EmailJS **Public Key** in `.env` as `VITE_EMAILJS_PUBLIC_KEY` (and as an environment variable on your host). The template can use these variables: `name`, `email`, `message`, `from_name`, `from_email`, `reply_to`, `to_name`, `time`. Without a key, or if the send fails, it opens the visitor's email app and says so, with a "Copy address" button. It never claims success unless the send worked.

Regenerate the share image with `node scripts/make-og.mjs`.

The résumé PDF in `public/` lists a phone number; the site itself never shows it.
