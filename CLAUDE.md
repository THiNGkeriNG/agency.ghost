# agency-cu theme (design 2)

Design 1 (black/gold studio, theme name `agency`) is preserved on branch `v1-studio` and stays installed in Ghost. `main` is design 2: modeled on cudenver.edu — short gold hero with slanted white panel, italic condensed headings (Archivo wdth ~78%), cream "at a glance" stats, black cards with teal corner (#2A8288), gold community band, cream + black footer. Light only.

Custom Ghost theme for The Learning Agency site (agency.cu.studio, Ghost on Cloudron). Forked from Ghost's Source theme 1.7.6.

## Workflow
- Every push to `main` builds and deploys to the site via `.github/workflows/deploy.yml` (TryGhost/action-deploy-theme, secrets GHOST_URL + GHOSTA_KEY). Push = publish.
- Edit source in `assets/css` and `assets/js`; CI runs `pnpm build` to regenerate `assets/built`. Run `pnpm build` locally too and commit the built files so the repo stays in sync.
- Theme name in Ghost is `agency` (from package.json). Don't rename it back to `source` — that collides with Ghost's bundled theme.

## Commands
pnpm install --frozen-lockfile · pnpm build · pnpm dev

## Structure
- `agency.hbs` — layout for the landing pages (CU Denver utility bar, header with clients/students switch, footer). Loads only `assets/agency/agency.css` + `agency.js`, not Source's CSS.
- `home.hbs` — client landing page at `/`. `page-students.hbs` — student page; needs a published Ghost page with slug `students`.
- Posts, tags, authors still use Source's `default.hbs` and styling (not yet restyled).
- Design source of truth: the "The Learning Agency" artifact (claude.ai/artifact/7VoDkWxC77L9F2AyktaQjJ). Brand: CU Denver black/white/gold #CFB87C, Archivo (wide display), Source Sans 3, IBM Plex Mono.
- `.pv` elements are preview annotations; hidden site-wide by the `show_preview_notes` setting.
- `assets/agency/` is deliberately outside `assets/js` so gulp doesn't bundle it into source.js.
- Ghost admin controls (Settings → Design → Theme): compact_logo (white, for the sticky black bar), director_photo, booking_link, cta_label, show_preview_notes, hero headline/intro, students headline/intro (19 of 20 settings). Site logo, title, and Publication cover (hero photo) come from Settings → General.
- Header menu = Settings → Navigation (primary); black-bar quick links = secondary navigation. Both fall back to built-in links when empty (partials/agency-nav.hbs, layout).
- Black top bar is the sticky element; it swaps quick links for compact logo + menu + CTA once the white header scrolls out (IntersectionObserver, `.stuck`).

## Editable sections
- Landing sections render from Ghost pages by slug when published (`{{#get "pages"}}`), else fall back to the hard-coded markup in the template. Slugs: home-services, home-platforms, home-partners, home-clients, home-how, home-faq; students-what-you-get, students-ways-in, students-how, students-alumni, students-faq.
- Page title → section h2, excerpt → intro, body → `.sec-body`. Styling maps editor elements per section (`.ed-<id>`): bullets → cards/chips/client grid, numbered list → step cards, toggle cards → FAQ, gallery → logo grid, `##` heading → column break in Services.
- Section pages redirect to the landing page (page.hbs `{{#has slug=...}}`) — keep that list in sync when adding sections.
- Selected Work = posts with internal tag `#work`.
- `scripts/seed-sections.*` + seed workflow create missing section pages as drafts (idempotent).
