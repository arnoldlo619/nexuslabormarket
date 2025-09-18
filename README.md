# Nexus Labor Market — Hero + Dashboard Demo

Next.js (App Router) starter featuring a dark/emerald hero with a full-bleed background video, parallax glows, and a dashboard overlay with a **Video/Dashboard** toggle. Includes a floating **Theme Controls** panel for non-devs to tune:

- `--glow-strength` (0–1): emerald glow intensity  
- `--overlay` (0–1): video overlay darkness  
- `--shadow-boost` (0–1): hover shadow strength

## Quickstart

```bash
pnpm i   # or npm i / yarn
pnpm dev # or npm run dev
```

Open http://localhost:3000

### Place your media
- Put your hero video at: `public/video/nexus-hero-demo.mp4`
- Put your poster image at: `public/img/nexus-hero-poster.jpg`

Switch views via the URL: `?view=video` or `?view=dashboard`.

## Deploy

- **GitHub + Vercel**: push this repo and import in Vercel.
- **Lovable.dev / Orchids AI**: import the GitHub repo, it will auto-detect Next.js.
- Works with Node 18+.