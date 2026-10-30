# agency theme

Custom Ghost theme for The Learning Agency site (agency.cu.studio, Ghost on Cloudron). Forked from Ghost's Source theme 1.7.6.

## Workflow
- Every push to `main` builds and deploys to the site via `.github/workflows/deploy.yml` (TryGhost/action-deploy-theme, secrets GHOST_URL + GHOSTA_KEY). Push = publish.
- Edit source in `assets/css` and `assets/js`; CI runs `pnpm build` to regenerate `assets/built`. Run `pnpm build` locally too and commit the built files so the repo stays in sync.
- Theme name in Ghost is `agency` (from package.json). Don't rename it back to `source` — that collides with Ghost's bundled theme.

## Commands
pnpm install --frozen-lockfile · pnpm build · pnpm dev
