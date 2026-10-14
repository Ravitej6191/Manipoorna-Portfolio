# Mani Poorna: portfolio

A developer portfolio with an engineering-drawing look: drafting paper, ink and blueprint blue, a line-drawn developer's desk on the cover, and a drawing for each project. Built with React and Vite, with hand-drawn SVG instead of WebGL.

```bash
npm install
npm run dev        # http://localhost:5175
npm run build      # static site in dist/
npm run preview    # serve the build
npm test           # content and build checks (run after a build)
npm run og         # regenerate the share images
```

## Sections

| # | Section | What it is |
|---|---|---|
| 01 | Home | Name, intro and the developer's desk drawing |
| 02 | About | Summary and an at-a-glance block |
| 03 | Projects | Each project as a drawing with numbered parts, and its own page at `/work/<id>/` (case study, flow chart, optional screens, prototype and before/after) |
| 04 | Experience | Work history and education, with a rail that fills as you read |
| 05 | Skills | Technologies grouped by area |
| 06 | Code | A git-graph drawing of the workflow, plus a contribution heatmap, languages, latest commits and repositories from GitHub |
| 07 | AI | How AI is used (code review, debugging, dev tools, learning) and the toolbox, from `src/data/ai.js` |
| 08 | Kind words | Testimonials |
| 09 | Contact | A message form, plus email (with a copy icon), LinkedIn and resume links |

A Notes section (`src/data/notes.js`) appears between AI and Kind words once it has entries. The header shows tabs for Home, About, Projects, Experience, Skills and Contact; the other sections are reached by scrolling or from the command palette.

## Look and features

- **Two looks:** **Paper** (ink on drafting paper) and **Blueprint** (light lines on cyanotype blue), switched from the header and remembered. With no saved choice the site uses Blueprint at night (7pm to 6am) or when the system prefers dark.
- **Command palette:** Ctrl+K (Cmd+K on a Mac) or `/`. Jump to a section, open a project, switch the look, copy the email, open GitHub or LinkedIn.
- **Project pages:** real paths (`/work/talus-pay/`), each pre-built with its own title, description and share image. Old `#/work/...` links are forwarded.
- **404:** an unknown address shows a terminal-style page.
- **Motion:** pages, popups and the look switch ease in and out. Everything respects reduced motion.
- **Tests and CI:** `npm test` checks the content and the build output. `.github/workflows/ci.yml` runs it with Lighthouse on every push.

## Where the content lives

| What | File |
|---|---|
| Name, email, links, availability, booking | `src/data/profile.js` |
| Summary, experience, education, skills | `src/data/about.js` |
| Projects (text, parts, flow charts) | `src/data/projects.js` |
| Testimonials | `src/data/proof.js` |
| AI section and tools | `src/data/ai.js` (logos: `src/data/logos.js`, extra SVGs: `src/assets/logos/`) |
| Notes | `src/data/notes.js` |
| Portrait | `public/profile.jpg` (about 4:5); the desk drawing shows until it exists |

Optional project fields, each shown only when present: `links: { live, repo }`, `shots: [{ src, alt, caption }]`, `figma`, `compare`, `reflection` and `quote`. `availability` and `booking` in the profile stay hidden while empty.

## What is drafted, not sourced

Most of the site comes from the résumé and from the descriptions supplied for the projects. Four things are written from role or context and need the real details or approval before the site goes live:

- **Talus Pay (POS):** the text is written from its name and the style of the other two projects.
- **Testimonials:** the quotes are drafted from each person's role; they have not said them.
- **AI section:** the uses and tool list are general. Match them to what is actually used.
- **GitHub:** the Code section reads the profile set in `src/data/profile.js`.

The résumé PDF in `public/` lists a phone number; the site itself never shows it.

## Deploy

The site is static: `npm run build` writes `dist/`. On Vercel or Netlify, import the repository (build command `npm run build`, output folder `dist`) and add these environment variables:

- `VITE_EMAILJS_PUBLIC_KEY`: your EmailJS public key (the contact form).
- `VITE_SITE_URL`: the final address, such as `https://yourname.com`. It fills the canonical link, share images, sitemap and structured data. Without it those are left out.

The build writes a static page for each project, plus `404.html`, `sitemap.xml` and `robots.txt`. Security headers (a Content-Security-Policy and others) are in `vercel.json` and `public/_headers` for Vercel and Netlify. After adding a project, run `npm run og` to make its share image.

## Contact form

Sends through [EmailJS](https://www.emailjs.com) (service `service_081rxbt`, template `template_5z0hq53`). Put your EmailJS **Public Key** in `.env` as `VITE_EMAILJS_PUBLIC_KEY` (and as an environment variable on your host). A ready-made email template is in `docs/emailjs-template.html`. The form sends these variables: `name`, `email`, `message`, `from_name`, `from_email`, `reply_to`, `to_name`, `to_email` and `time`. Without a key, or if the send fails, it opens the visitor's email app and says so, with a "Copy address" button. It never claims success unless the send worked. One message per 30 seconds per browser.
