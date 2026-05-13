# Build scripts

This directory drives the static build for jaimem.com. Three generators run in sequence on every Vercel deploy:

1. `build-case-studies.mjs` — reads `case-studies.data.mjs`, emits `case-studies/*.html` and `es/case-studies/*.html`
2. `build-blog.mjs` — reads `blog.data.mjs`, emits `blog/*.html` and `es/blog/*.html`. **Date-gates posts**: a post with `datePublished` in the future is hidden until that date arrives.
3. `build-es.mjs` — reads `index.html` and `services/*.html`, emits Spanish mirrors under `es/` by swapping `data-en`/`data-es` text.

The chain runs via `buildCommand` in `vercel.json`.

## Adding a blog post

Edit `blog.data.mjs`, append a new entry to the `POSTS` array:

```js
{
  slug: 'your-url-slug',                    // becomes /blog/your-url-slug
  datePublished: '2026-11-24',              // post stays hidden until this date
  keywords: 'comma-separated, keywords',
  en: {
    title: '...',                           // <title> + og:title
    description: '...',                     // meta description + og:description
    ogAlt: '...',                           // og:image alt
    h1: '...',                              // page H1 (often same as title)
    sub: 'Nov 24, 2026 · 7 min read · Category',
    lead: 'Opening paragraph. May contain <em>HTML</em>.',
    body: `
      <h2>Section</h2>
      <p>Body HTML goes here as a template literal.</p>
    `,
  },
  // Optional: add an es: { ... } block with the same shape to also emit
  // /es/blog/your-url-slug. Without it, the post is English-only and the
  // Spanish blog hub shows it with an "EN only" badge.
}
```

Then either push to `main` (deploys immediately) or just commit — the weekly GitHub Actions cron picks up the post on its publish date automatically.

## The weekly cron

`.github/workflows/weekly-rebuild.yml` runs every Monday at 14:00 UTC, hits a Vercel deploy hook, and triggers a rebuild. The build script reads `new Date()` and renders only posts whose `datePublished` is today or earlier.

**One-time setup** (see comments in the workflow file): create a Vercel deploy hook for `main`, save the URL as a GitHub repo secret named `VERCEL_DEPLOY_HOOK`.

You can also trigger the workflow manually from GitHub → Actions → Weekly rebuild → Run workflow.

## Local development

```sh
# Regenerate everything
node scripts/build-case-studies.mjs && node scripts/build-blog.mjs && node scripts/build-es.mjs

# Preview a scheduled post locally (overrides the date gate for one build):
TODAY_OVERRIDE=2026-12-31 node scripts/build-blog.mjs   # not yet implemented; use git stash + edit datePublished if you need to preview
```

## Sitemap

`build-blog.mjs` auto-regenerates the blog section of `sitemap.xml` between the `<!-- AUTO_BLOG_URLS_START -->` and `<!-- AUTO_BLOG_URLS_END -->` markers. Don't hand-edit URLs between those markers — they get overwritten. Hand-edits outside the markers stick.
