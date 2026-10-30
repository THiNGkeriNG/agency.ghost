// Creates the editable section pages in Ghost as DRAFTS, pre-filled with the theme's current copy.
// Idempotent: any slug that already exists (draft or published) is left alone.
import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';

const base = process.env.GHOST_URL.replace(/\/+$/, '');
const [id, secret] = process.env.GHOSTA_KEY.split(':');
const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
function token() {
  const now = Math.floor(Date.now() / 1000);
  const h = b64({ alg: 'HS256', typ: 'JWT', kid: id }), p = b64({ iat: now, exp: now + 300, aud: '/admin/' });
  const sig = createHmac('sha256', Buffer.from(secret, 'hex')).update(`${h}.${p}`).digest('base64url');
  return `${h}.${p}.${sig}`;
}
async function api(path, opts = {}) {
  const r = await fetch(`${base}/ghost/api/admin/${path}`, {
    ...opts, headers: { Authorization: `Ghost ${token()}`, 'Accept-Version': 'v5.0', 'Content-Type': 'application/json' }
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${r.status} ${path}: ${JSON.stringify(body.errors || body)}`);
  return body;
}

const sections = JSON.parse(readFileSync(new URL('./seed-sections.json', import.meta.url)));
for (const s of sections) {
  const { pages } = await api(`pages/?filter=slug:${s.slug}&limit=1&fields=id,slug,status`);
  if (pages.length) { console.log(`skip   ${s.slug} (exists, ${pages[0].status})`); continue; }
  await api('pages/?source=html', { method: 'POST', body: JSON.stringify({ pages: [{ ...s, custom_excerpt: s.custom_excerpt || null, status: 'draft' }] }) });
  console.log(`draft  ${s.slug}`);
}
