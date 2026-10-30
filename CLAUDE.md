# agency theme

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
- Ghost admin controls (Settings → Design → Theme): `cu_logo`, `show_preview_notes`, homepage hero text (eyebrow, headline, accent, intro), students hero text. Site logo and title come from Settings → General. Ghost caps themes at 20 custom settings; 19 are used — Source's homepage settings were retired to make room.
