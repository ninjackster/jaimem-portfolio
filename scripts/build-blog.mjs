#!/usr/bin/env node
// Generates /blog/{slug}.html from scripts/blog.data.mjs, plus the /blog/
// hub page in both languages. Spanish post pages only emit when the post
// has an `es` block; the /es/blog/ hub still renders, marking English-only
// posts with a small "English version available" badge.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { POSTS } from './blog.data.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const COMMON_HEAD = `  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GXTLN8MS57"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GXTLN8MS57');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />`;

const AUTO_REDIRECT = `  <script>
    (function () {
      try {
        var p = location.pathname;
        if (p.indexOf('/es') === 0) return;
        if (localStorage.getItem('langChoice')) return;
        var lang = (navigator.language || '').toLowerCase();
        if (lang.indexOf('es') !== 0) return;
        var target = (p === '/' || p === '/index.html') ? '/es/' : '/es' + p;
        location.replace(target);
      } catch (e) {}
    })();
  </script>`;

const POST_STYLES = `  <style>
    .page-wrap { max-width: 720px; margin: 0 auto; padding: 7rem 1.5rem 4rem; }
    .page-wrap h1 { font-size: clamp(2rem, 4vw, 2.6rem); line-height: 1.18; letter-spacing: -.02em; margin-bottom: .5rem; }
    .page-wrap .sub { font-size: .85rem; color: var(--text-3); margin-bottom: 2rem; display: block; }
    .page-wrap .lead { font-size: 1.18rem; color: var(--text-2); line-height: 1.7; margin-bottom: 2.5rem; }
    .page-wrap h2 { font-size: 1.5rem; line-height: 1.25; letter-spacing: -.01em; margin: 3rem 0 1rem; }
    .page-wrap h3 { font-size: 1.1rem; font-weight: 600; margin: 2rem 0 .5rem; }
    .page-wrap p { color: var(--text); line-height: 1.78; margin-bottom: 1.25rem; font-size: 1rem; }
    .page-wrap ul, .page-wrap ol { padding-left: 1.4rem; margin-bottom: 1.5rem; }
    .page-wrap li { margin-bottom: .5rem; line-height: 1.7; }
    .page-wrap a.inline-link { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
    .crumbs { font-size: .85rem; color: var(--text-3); margin-bottom: 1.5rem; }
    .crumbs a { color: var(--text-2); text-decoration: none; }
    .crumbs a:hover { color: var(--text); }
    .cta-block { margin-top: 3.5rem; padding: 2rem; background: var(--bg-alt); border-radius: 12px; text-align: center; }
    .cta-block h3 { margin: 0 0 .75rem; }
    .cta-block p { margin: 0 0 1.5rem; color: var(--text-2); }
    .cta-block .btn { display: inline-flex; }
    .related { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
    .related h3 { margin-bottom: 1rem; }
    .related ul { list-style: none; padding: 0; }
    .related ul li { margin-bottom: .5rem; }
    .post-grid { display: grid; gap: 1.5rem; margin: 2rem 0 3rem; }
    .post-card { display: block; padding: 1.75rem; border: 1px solid var(--border); border-radius: 12px; text-decoration: none; color: inherit; transition: border-color .15s, transform .15s; }
    .post-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .post-card h2 { font-size: 1.2rem; margin: 0 0 .35rem; color: var(--text); }
    .post-card .sub { font-size: .8rem; color: var(--text-3); margin-bottom: .75rem; display: block; }
    .post-card p { color: var(--text-2); margin: 0 0 1rem; line-height: 1.65; font-size: .95rem; }
    .post-card .arrow { color: var(--accent); font-weight: 500; font-size: .9rem; }
    .lang-badge { display: inline-block; font-size: .72rem; padding: 2px 8px; border-radius: 4px; background: var(--bg-alt); color: var(--text-3); margin-left: .5rem; }
  </style>`;

const TOGGLE_SCRIPT = `  <script>
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        const p = location.pathname;
        const onEs = p.indexOf('/es') === 0;
        if ((lang === 'en' && !onEs) || (lang === 'es' && onEs)) return;
        try { localStorage.setItem('langChoice', lang); } catch (e) {}
        const enPath = onEs ? (p === '/es' || p === '/es/' ? '/' : p.slice(3)) : p;
        // If the user is on a post page without a counterpart, fall back to the blog hub.
        const fallbackHub = lang === 'es' ? '/es/blog/' : '/blog/';
        // Heuristic: if path matches a known post slug without an ES twin and lang=es, route to /es/blog/
        const noEsSlugs = ${JSON.stringify(POSTS.filter(p => !p.es).map(p => p.slug))};
        const slugMatch = enPath.match(/^\\/blog\\/(.+)$/);
        if (lang === 'es' && slugMatch && noEsSlugs.indexOf(slugMatch[1]) !== -1) {
          location.href = fallbackHub;
          return;
        }
        location.href = lang === 'es' ? (enPath === '/' ? '/es/' : '/es' + enPath) : enPath;
      });
    });
  </script>`;

const FOOTER = `  <footer>
    <p class="footer-copy">&copy; 2020&ndash;2026 Jaime M. Mena</p>
    <div class="footer-links">
      <a href="mailto:jaimemurillomena@gmail.com">jaimemurillomena@gmail.com</a>
      <a href="https://www.linkedin.com/in/jaimemmena/" target="_blank" rel="noopener">LinkedIn</a>
    </div>
  </footer>`;

function nav(lang, activeEs) {
  const enBtn = activeEs
    ? `<button class="lang-btn" data-lang="en" aria-pressed="false">EN</button>`
    : `<button class="lang-btn active" data-lang="en" aria-pressed="true">EN</button>`;
  const esBtn = activeEs
    ? `<button class="lang-btn active" data-lang="es" aria-pressed="true">ES</button>`
    : `<button class="lang-btn" data-lang="es" aria-pressed="false">ES</button>`;
  const items = activeEs
    ? [
        ['/es/services/', 'Servicios'],
        ['/es/case-studies/', 'Casos de Estudio'],
        ['/es/blog/', 'Blog'],
        ['/es/#about', 'Sobre Mí'],
        ['/es/#contact', 'Contacto'],
      ]
    : [
        ['/services/', 'Services'],
        ['/case-studies/', 'Case Studies'],
        ['/blog/', 'Blog'],
        ['/#about', 'About'],
        ['/#contact', 'Contact'],
      ];
  const lis = items.map(([href, label]) => `        <li><a href="${href}">${label}</a></li>`).join('\n');
  const home = activeEs ? '/es/' : '/';
  return `  <nav aria-label="Main navigation">
    <div class="nav-inner">
      <a href="${home}" class="nav-logo">Jaime M. Mena</a>
      <ul class="nav-links" id="nav-links">
${lis}
      </ul>
      <div class="nav-right">
        <div class="lang-toggle" aria-label="Language selector">
          ${enBtn}
          ${esBtn}
        </div>
      </div>
    </div>
  </nav>`;
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function metaBlock({ title, description, canonical, canonicalEn, canonicalEs, locale, localeAlt, ogAlt, articleSection }) {
  return `  <title>${title}</title>

  <meta name="description" content="${escapeAttr(description)}" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${escapeAttr(title)}" />
  <meta property="og:description" content="${escapeAttr(description)}" />
  <meta property="og:locale" content="${locale}" />
  <meta property="og:locale:alternate" content="${localeAlt}" />
  <meta property="og:site_name" content="Jaime M. Mena" />
  <meta property="og:image" content="https://jaimem.com/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeAttr(ogAlt)}" />
${articleSection ? `  <meta property="article:section" content="${escapeAttr(articleSection)}" />\n` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeAttr(title)}" />
  <meta name="twitter:description" content="${escapeAttr(description)}" />
  <meta name="twitter:image" content="https://jaimem.com/og-image.png" />
  <meta name="twitter:image:alt" content="${escapeAttr(ogAlt)}" />

  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta name="theme-color" content="#111111" />

  <meta name="author" content="Jaime M. Mena" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="alternate" hreflang="en" href="${canonicalEn}" />
${canonicalEs ? `  <link rel="alternate" hreflang="es" href="${canonicalEs}" />\n` : ''}  <link rel="alternate" hreflang="x-default" href="${canonicalEn}" />`;
}

function blogPostingJsonLd({ title, description, url, datePublished, keywords, lang }) {
  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": ${JSON.stringify(title)},
    "description": ${JSON.stringify(description)},
    "url": "${url}",
    "image": "https://jaimem.com/og-image.png",
    "author": { "@type": "Person", "name": "Jaime M. Mena", "url": "https://jaimem.com/" },
    "publisher": { "@type": "Person", "name": "Jaime M. Mena", "url": "https://jaimem.com/" },
    "datePublished": "${datePublished}",
    "dateModified": "${datePublished}",
    "inLanguage": "${lang}",
    "keywords": ${JSON.stringify(keywords)},
    "mainEntityOfPage": "${url}"
  }
  </script>`;
}

function renderPost(post, lang) {
  const isEs = lang === 'es';
  const content = isEs ? post.es : post.en;
  if (!content) return null; // no Spanish version exists
  const canonicalEn = `https://jaimem.com/blog/${post.slug}`;
  const canonicalEs = post.es ? `https://jaimem.com/es/blog/${post.slug}` : null;
  const canonical = isEs ? canonicalEs : canonicalEn;
  const locale = isEs ? 'es_ES' : 'en_US';
  const localeAlt = isEs ? 'en_US' : 'es_ES';

  const labels = isEs
    ? { home: 'Inicio', blog: 'Blog', cta: 'Iniciar una Conversación', ctaH: '¿Quieres aplicar esto a tu equipo?', ctaP: 'Trabajo con equipos B2B SaaS y operadores en EE.UU. y México. Empieza con una conversación de 30 minutos.', otherH: 'Más en el blog' }
    : { home: 'Home', blog: 'Blog', cta: 'Start a Conversation', ctaH: 'Want to apply this to your team?', ctaP: 'I work with B2B SaaS teams and operators in the US and Mexico. Start with a 30-minute conversation.', otherH: 'More from the blog' };

  const breadBlog = isEs ? '/es/blog/' : '/blog/';
  const homeBase = isEs ? '/es/' : '/';

  // Related = up to 3 other posts (in the same language if available)
  const related = POSTS.filter(o => o.slug !== post.slug).slice(0, 3);
  const relatedItems = related.map(o => {
    const otherHasEs = !!o.es;
    const useEs = isEs && otherHasEs;
    const rContent = useEs ? o.es : o.en;
    const rUrl = useEs ? `/es/blog/${o.slug}` : `/blog/${o.slug}`;
    const badge = (isEs && !otherHasEs) ? `<span class="lang-badge">EN only</span>` : '';
    return `        <li><a href="${rUrl}" class="inline-link">${rContent.h1}</a>${badge}</li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${COMMON_HEAD}
${AUTO_REDIRECT}
${metaBlock({
    title: content.title,
    description: content.description,
    canonical,
    canonicalEn,
    canonicalEs,
    locale,
    localeAlt,
    ogAlt: content.ogAlt,
    articleSection: 'RevOps',
  })}

${blogPostingJsonLd({
    title: content.title,
    description: content.description,
    url: canonical,
    datePublished: post.datePublished,
    keywords: post.keywords,
    lang: isEs ? 'es-ES' : 'en-US',
  })}

  <link rel="preload" href="/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles/site.css?v=20260512b" />

${POST_STYLES}
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

${nav(lang, isEs)}

  <main id="main-content">
    <article class="page-wrap">
      <p class="crumbs"><a href="${homeBase}">${labels.home}</a> &rsaquo; <a href="${breadBlog}">${labels.blog}</a> &rsaquo; <span>${content.h1}</span></p>

      <h1>${content.h1}</h1>
      <span class="sub">${content.sub}</span>

      <p class="lead">${content.lead}</p>

${content.body}

      <div class="cta-block">
        <h3>${labels.ctaH}</h3>
        <p>${labels.ctaP}</p>
        <a href="${isEs ? '/es/services/revops-consulting' : '/services/revops-consulting'}" class="btn btn-primary">${labels.cta}</a>
      </div>

      <div class="related">
        <h3>${labels.otherH}</h3>
        <ul>
${relatedItems}
        </ul>
      </div>
    </article>
  </main>

${FOOTER}

${TOGGLE_SCRIPT}
</body>
</html>
`;
}

function renderHub(lang) {
  const isEs = lang === 'es';
  const canonical = isEs ? 'https://jaimem.com/es/blog/' : 'https://jaimem.com/blog/';
  const canonicalEn = 'https://jaimem.com/blog/';
  const canonicalEs = 'https://jaimem.com/es/blog/';
  const locale = isEs ? 'es_ES' : 'en_US';
  const localeAlt = isEs ? 'en_US' : 'es_ES';

  const title = isEs
    ? 'Blog — Revenue Operations, GTM B2B SaaS y operaciones bilingües | Jaime M. Mena'
    : 'Blog — Revenue Operations, B2B SaaS GTM, and bilingual operations | Jaime M. Mena';
  const description = isEs
    ? 'Posts prácticos sobre Revenue Operations, comparaciones de stack tecnológico (Salesforce vs HubSpot), marcos de calificación (MEDDPICC, MEDDIC), y RevOps transfronterizo entre EE.UU. y México.'
    : 'Practical posts on Revenue Operations, tech-stack comparisons (Salesforce vs HubSpot), qualification frameworks (MEDDPICC, MEDDIC), and cross-border US-Mexico RevOps.';
  const ogAlt = isEs ? 'Blog — Jaime M. Mena' : 'Blog — Jaime M. Mena';
  const labels = isEs
    ? { home: 'Inicio', heading: 'Blog', lead: 'Posts sobre Revenue Operations, comparaciones de herramientas, marcos de calificación y la realidad operativa de equipos B2B SaaS — incluyendo el ángulo transfronterizo entre EE.UU. y México que pocos escriben.', learn: 'Leer post →', enOnly: 'Solo en inglés', enOnlyNote: 'Este post está disponible solo en inglés por ahora.' }
    : { home: 'Home', heading: 'Blog', lead: 'Posts on Revenue Operations, tool comparisons, qualification frameworks, and the operational reality of B2B SaaS teams — including the US-Mexico cross-border angle few people write about.', learn: 'Read post →' };

  const cards = POSTS.map(post => {
    const hasEs = !!post.es;
    const useEs = isEs && hasEs;
    const content = useEs ? post.es : post.en;
    const url = useEs ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
    const badge = (isEs && !hasEs) ? ` <span class="lang-badge">${labels.enOnly}</span>` : '';
    const enOnlyNote = (isEs && !hasEs) ? `<p style="font-size:.85rem;color:var(--text-3);margin-top:.5rem;">${labels.enOnlyNote}</p>` : '';
    return `        <a href="${url}" class="post-card">
          <h2>${content.h1}${badge}</h2>
          <span class="sub">${content.sub}</span>
          <p>${stripLeadHtml(content.lead)}</p>
          ${enOnlyNote}
          <span class="arrow">${labels.learn}</span>
        </a>`;
  }).join('\n');

  const blogSchema = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": ${JSON.stringify(labels.heading + ' — Jaime M. Mena')},
    "url": "${canonical}",
    "description": ${JSON.stringify(description)},
    "inLanguage": "${isEs ? 'es-ES' : 'en-US'}",
    "author": { "@type": "Person", "name": "Jaime M. Mena", "url": "https://jaimem.com/" },
    "blogPost": [
${POSTS.map(post => {
  const hasEs = !!post.es;
  const useEs = isEs && hasEs;
  const c = useEs ? post.es : post.en;
  const url = useEs ? `https://jaimem.com/es/blog/${post.slug}` : `https://jaimem.com/blog/${post.slug}`;
  return `      { "@type": "BlogPosting", "headline": ${JSON.stringify(c.h1)}, "url": "${url}", "datePublished": "${post.datePublished}" }`;
}).join(',\n')}
    ]
  }
  </script>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${COMMON_HEAD}
${AUTO_REDIRECT}
${metaBlock({
    title,
    description,
    canonical,
    canonicalEn,
    canonicalEs,
    locale,
    localeAlt,
    ogAlt,
  })}

${blogSchema}

  <link rel="preload" href="/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles/site.css?v=20260512b" />

${POST_STYLES}
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

${nav(lang, isEs)}

  <main id="main-content">
    <article class="page-wrap" style="max-width:880px;">
      <p class="crumbs"><a href="${isEs ? '/es/' : '/'}">${labels.home}</a> &rsaquo; <span>${labels.heading}</span></p>

      <h1>${labels.heading}</h1>

      <p class="lead">${labels.lead}</p>

      <div class="post-grid">
${cards}
      </div>
    </article>
  </main>

${FOOTER}

${TOGGLE_SCRIPT}
</body>
</html>
`;
}

// Strip basic HTML tags from the lead for use in card excerpts (the card has
// its own typography and we don't want <strong> bolding spilling in).
function stripLeadHtml(s) {
  return String(s).replace(/<[^>]+>/g, '');
}

let totalBytes = 0;
let totalFiles = 0;

function emit(relPath, content) {
  if (!content) return;
  const outPath = resolve(ROOT, relPath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content, 'utf8');
  totalBytes += content.length;
  totalFiles += 1;
  console.log(`[build-blog] wrote ${relPath} (${content.length} bytes)`);
}

// Hubs
emit('blog/index.html', renderHub('en'));
emit('es/blog/index.html', renderHub('es'));

// Posts
for (const post of POSTS) {
  emit(`blog/${post.slug}.html`, renderPost(post, 'en'));
  if (post.es) emit(`es/blog/${post.slug}.html`, renderPost(post, 'es'));
}

console.log(`[build-blog] ${totalFiles} files, ${totalBytes} bytes total`);
