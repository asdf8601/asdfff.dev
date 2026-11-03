# asdfff.dev

Minimalist personal site. Terminal aesthetic. Zero bloat.

## Stack

- Astro (static site generator)
- CSS (no frameworks)
- Font Awesome (icons via CDN)
- Deployed to GitHub Pages via GitHub Actions

## Features

- Dark/light mode toggle
- Client-side search
- TIL entries with anchor links
- Custom beveled borders (6px left/bottom, 1px top/right)
- Monospace typography
- Sitemap, robots.txt, RSS feed and Open Graph share images

## Commands

```bash
make install    # Install dependencies
make dev        # Start dev server
make build      # Build for production
make preview    # Preview production build
make clean      # Remove generated files
```

Or use npm/bun directly:

```bash
npm install
npm run dev
npm run build
```

## Structure

```
src/
├── components/
│   ├── Search.astro         # Client-side search component
│   ├── ThemeToggle.astro    # Dark/light mode toggle
│   └── ...                  # Cards, grids, charts, diagrams
├── layouts/
│   ├── BaseLayout.astro     # Base layout with nav + footer
│   └── PostLayout.astro     # Post layout
├── pages/
│   ├── index.astro          # Main page (wtfm)
│   ├── posts/               # Blog posts (.mdx)
│   ├── posts.astro          # Blog index
│   ├── til.astro            # Today I Learned notes
│   ├── projects.astro       # Projects showcase
│   ├── quotes.astro         # Quotes
│   ├── search.astro         # Search page
│   ├── about.astro          # About page
│   ├── rss.xml.ts           # RSS feed
│   ├── og/                  # Open Graph share images
│   └── 404.astro            # Error page
└── styles/
    └── global.css           # Global styles + theme variables
```

## Search

Search data is generated at build time via `generate-search-data.js`. The script crawls all pages and creates a JSON index at `public/search-data.json`.

## Analytics

Visits are tracked with [GoatCounter](https://www.goatcounter.com/). The script is in `src/layouts/BaseLayout.astro` and points to `https://asdfff.goatcounter.com`. Stats are in the GoatCounter dashboard.

## Deployment

GitHub Actions automatically deploys to GitHub Pages on push to main.

Enable GitHub Pages in repo settings:

1. Settings → Pages
2. Source: GitHub Actions
3. Site will be available at `https://asdf8601.github.io/asdfff.dev/`

## License

MIT
