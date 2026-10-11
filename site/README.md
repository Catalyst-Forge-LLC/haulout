# haulout.dev

FilePress site for [haulout.dev](https://haulout.dev).

```bash
pnpm install
pnpm dev      # LocalSlip lease haulout-site on 5198
pnpm build    # → build/
```

`/haulout.user.js` and `/example.md` are copied from the repo root at build/dev time (`scripts/sync-static.mjs`). The header Sample link is `/sample/example.md`, a FilePress path mount of that same file, so the site router does not treat it as a missing page.
