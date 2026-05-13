#!/usr/bin/env node
// Generates /case-studies/{slug}.html (EN) and /es/case-studies/{slug}.html
// (ES) from scripts/case-studies.data.mjs, plus the /case-studies/ hub page
// in both languages. Runs on every Vercel build.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASE_STUDIES } from './case-studies.data.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const COMMON_HEAD_TAGS = `  <script async src="https://www.googletagmanager.com/gtag/js?id=G-GXTLN8MS57"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-GXTLN8MS57');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />`;

const AUTO_REDIRECT_SCRIPT = `  <script>
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

const PAGE_STYLES = `  <style>
    .page-wrap { max-width: 760px; margin: 0 auto; padding: 7rem 1.5rem 4rem; }
    .page-wrap h1 { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.15; letter-spacing: -.02em; margin-bottom: .5rem; }
    .page-wrap .sub { font-size: .9rem; color: var(--text-3); margin-bottom: 1.5rem; display: block; }
    .page-wrap .lead { font-size: 1.15rem; color: var(--text-2); line-height: 1.7; margin-bottom: 2.5rem; }
    .page-wrap h2 { font-size: 1.55rem; line-height: 1.25; letter-spacing: -.01em; margin: 3rem 0 1rem; }
    .page-wrap h3 { font-size: 1.15rem; font-weight: 600; margin: 2rem 0 .5rem; }
    .page-wrap p { color: var(--text); line-height: 1.75; margin-bottom: 1.25rem; }
    .page-wrap ul { padding-left: 1.4rem; margin-bottom: 1.25rem; }
    .page-wrap ul li { margin-bottom: .5rem; line-height: 1.7; }
    .page-wrap a.inline-link { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
    .crumbs { font-size: .85rem; color: var(--text-3); margin-bottom: 1.5rem; }
    .crumbs a { color: var(--text-2); text-decoration: none; }
    .crumbs a:hover { color: var(--text); }
    .pdf-row { display: flex; gap: .75rem; flex-wrap: wrap; margin: 2rem 0 1rem; }
    .pdf-row a { display: inline-flex; align-items: center; gap: .4rem; padding: .55rem 1rem; border: 1px solid var(--accent); color: var(--accent); border-radius: 6px; text-decoration: none; font-size: .9rem; font-weight: 500; transition: background .15s, color .15s; }
    .pdf-row a:hover { background: var(--accent); color: #fff; }
    .cta-block { margin-top: 3.5rem; padding: 2rem; background: var(--bg-alt); border-radius: 12px; text-align: center; }
    .cta-block h3 { margin: 0 0 .75rem; }
    .cta-block p { margin: 0 0 1.5rem; color: var(--text-2); }
    .cta-block .btn { display: inline-flex; }
    .related { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
    .related h3 { margin-bottom: 1rem; }
    .related ul { list-style: none; padding: 0; }
    .related ul li { margin-bottom: .5rem; }
    .case-grid { display: grid; gap: 1.5rem; margin: 2rem 0 3rem; }
    .case-card { display: block; padding: 1.75rem; border: 1px solid var(--border); border-radius: 12px; text-decoration: none; color: inherit; transition: border-color .15s, transform .15s; }
    .case-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .case-card h2 { font-size: 1.2rem; margin: 0 0 .35rem; color: var(--text); }
    .case-card .sub { font-size: .8rem; color: var(--text-3); margin-bottom: .75rem; display: block; }
    .case-card p { color: var(--text-2); margin: 0 0 1rem; line-height: 1.65; font-size: .95rem; }
    .case-card .arrow { color: var(--accent); font-weight: 500; font-size: .9rem; }
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
  // The lang-toggle initial state flips based on which page we're emitting.
  const enBtn = activeEs
    ? `<button class="lang-btn" data-lang="en" aria-pressed="false">EN</button>`
    : `<button class="lang-btn active" data-lang="en" aria-pressed="true">EN</button>`;
  const esBtn = activeEs
    ? `<button class="lang-btn active" data-lang="es" aria-pressed="true">ES</button>`
    : `<button class="lang-btn" data-lang="es" aria-pressed="false">ES</button>`;
  // Nav labels are localized inline so each emitted file has the right text.
  const items = activeEs
    ? [
        ['/es/services/', 'Servicios'],
        ['/es/case-studies/', 'Casos de Estudio'],
        ['/es/blog/', 'Blog'],
        ['/es/#experience', 'Experiencia'],
        ['/es/#projects', 'Proyectos'],
        ['/es/#about', 'Sobre Mí'],
        ['/es/#contact', 'Contacto'],
      ]
    : [
        ['/services/', 'Services'],
        ['/case-studies/', 'Case Studies'],
        ['/blog/', 'Blog'],
        ['/#experience', 'Experience'],
        ['/#projects', 'Projects'],
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

function metaBlock({ title, description, canonical, canonicalAlt, locale, localeAlt, ogAlt, articleSection }) {
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
  <link rel="alternate" hreflang="en" href="${canonical.replace('/es/', '/')}" />
  <link rel="alternate" hreflang="es" href="${canonical.startsWith('https://jaimem.com/es/') ? canonical : canonical.replace('https://jaimem.com/', 'https://jaimem.com/es/')}" />
  <link rel="alternate" hreflang="x-default" href="${canonical.replace('/es/', '/')}" />`;
}

function articleJsonLd({ title, description, url, datePublished, keywords, lang }) {
  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${escapeAttr(title)}",
    "description": "${escapeAttr(description)}",
    "url": "${url}",
    "image": "https://jaimem.com/og-image.png",
    "author": { "@type": "Person", "name": "Jaime M. Mena", "url": "https://jaimem.com/" },
    "publisher": { "@type": "Person", "name": "Jaime M. Mena", "url": "https://jaimem.com/" },
    "datePublished": "${datePublished}",
    "inLanguage": "${lang}",
    "keywords": "${escapeAttr(keywords)}"
  }
  </script>`;
}

function renderCaseStudy(cs, lang) {
  const isEs = lang === 'es';
  const content = isEs ? cs.es : cs.en;
  const canonicalEn = `https://jaimem.com/case-studies/${cs.slug}`;
  const canonicalEs = `https://jaimem.com/es/case-studies/${cs.slug}`;
  const canonical = isEs ? canonicalEs : canonicalEn;
  const locale = isEs ? 'es_ES' : 'en_US';
  const localeAlt = isEs ? 'en_US' : 'es_ES';

  const labels = isEs
    ? { home: 'Inicio', cases: 'Casos de Estudio', cta: 'Iniciar una Conversación', ctaH: '¿Tienes un problema parecido?', ctaP: 'Te ayudo a aplicar este tipo de marcos a tu negocio. Empieza con una conversación de 30 minutos.', otherH: 'Otros casos de estudio', backToService: 'Ver mi servicio de Consultoría de Revenue Operations →' }
    : { home: 'Home', cases: 'Case Studies', cta: 'Start a Conversation', ctaH: 'Have a similar problem?', ctaP: 'I help apply this kind of framework to your business. Start with a 30-minute conversation.', otherH: 'Other case studies', backToService: 'See my Revenue Operations Consulting service →' };

  const breadcrumbBase = isEs ? '/es/case-studies/' : '/case-studies/';
  const homeBase = isEs ? '/es/' : '/';

  const pdfLinks = cs.pdfs.map(p => `      <a href="${p.href}" target="_blank" rel="noopener">${isEs ? p.es : p.en}</a>`).join('\n');

  const outcomeItems = content.outcome.items.map(i => `        <li>${i}</li>`).join('\n');

  // Related = the 3 case studies that are NOT this one (or first 3 if many).
  const related = CASE_STUDIES.filter(o => o.slug !== cs.slug).slice(0, 3);
  const relatedItems = related.map(o => {
    const rContent = isEs ? o.es : o.en;
    const rUrl = isEs ? `/es/case-studies/${o.slug}` : `/case-studies/${o.slug}`;
    return `        <li><a href="${rUrl}" class="inline-link">${rContent.h1}</a></li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${COMMON_HEAD_TAGS}
${AUTO_REDIRECT_SCRIPT}
${metaBlock({
    title: content.title,
    description: content.description,
    canonical,
    locale,
    localeAlt,
    ogAlt: content.ogAlt,
    articleSection: 'Revenue Operations',
  })}

${articleJsonLd({
    title: content.title,
    description: content.description,
    url: canonical,
    datePublished: '2026-05-12',
    keywords: cs.keywords,
    lang: isEs ? 'es-ES' : 'en-US',
  })}

  <link rel="preload" href="/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles/site.css?v=20260512b" />

${PAGE_STYLES}
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

${nav(lang, isEs)}

  <main id="main-content">
    <article class="page-wrap">
      <p class="crumbs"><a href="${homeBase}">${labels.home}</a> &rsaquo; <a href="${breadcrumbBase}">${labels.cases}</a> &rsaquo; <span>${content.h1}</span></p>

      <h1>${content.h1}</h1>
      <span class="sub">${content.sub}</span>

      <p class="lead">${content.lead}</p>

      <div class="pdf-row">
${pdfLinks}
      </div>

      <h2>${content.problem.heading}</h2>
      <p>${content.problem.body}</p>

      <h2>${content.approach.heading}</h2>
      <p>${content.approach.body}</p>

      <h2>${content.outcome.heading}</h2>
      <ul>
${outcomeItems}
      </ul>

      <h2>${content.lessons.heading}</h2>
      <p>${content.lessons.body}</p>

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
        <p style="margin-top:1.5rem;"><a href="${isEs ? '/es/services/revops-consulting' : '/services/revops-consulting'}" class="inline-link">${labels.backToService}</a></p>
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
  const canonical = isEs ? 'https://jaimem.com/es/case-studies/' : 'https://jaimem.com/case-studies/';
  const locale = isEs ? 'es_ES' : 'en_US';
  const localeAlt = isEs ? 'en_US' : 'es_ES';

  const title = isEs
    ? 'Casos de Estudio — Marcos y Modelos de Revenue Operations | Jaime M. Mena'
    : 'Case Studies — Revenue Operations Frameworks & Models | Jaime M. Mena';
  const description = isEs
    ? 'Siete casos de estudio detallados de marcos y modelos de Revenue Operations: diseño de territorios, pronósticos, dashboards GTM, planes de comisiones, atribución, puntaje de salud del cliente, y reconciliación de bookings vs. ingresos.'
    : 'Seven worked Revenue Operations case studies: territory design, forecasting, GTM dashboards, commission plans, attribution, customer health scoring, and bookings-to-revenue reconciliation.';
  const ogAlt = isEs ? 'Casos de Estudio — Jaime M. Mena' : 'Case Studies — Jaime M. Mena';
  const labels = isEs
    ? { home: 'Inicio', heading: 'Casos de Estudio', lead: 'Siete marcos y modelos detallados de mi trabajo en Revenue Operations. Construidos con datos ficticios para mostrar cómo abordo desafíos comunes de B2B SaaS — pronósticos, territorios, comisiones, dashboards, atribución, salud del cliente y reconciliación de ingresos.', learn: 'Leer caso de estudio →', ctaH: '¿Reconoces algunos de estos problemas?', ctaP: 'Si alguno de estos marcos resuena con tu equipo, hablemos. La primera conversación es de 30 minutos y sin compromiso.', cta: 'Iniciar una Conversación' }
    : { home: 'Home', heading: 'Case Studies', lead: 'Seven worked frameworks and models from my Revenue Operations practice. Built with fictitious data to show how I approach common B2B SaaS challenges — forecasting, territories, commissions, dashboards, attribution, customer health, and revenue reconciliation.', learn: 'Read case study →', ctaH: 'Recognize any of these problems?', ctaP: 'If any of these frameworks resonate with your team, let\'s talk. The first conversation is 30 minutes, no obligation.', cta: 'Start a Conversation' };

  const cards = CASE_STUDIES.map(cs => {
    const content = isEs ? cs.es : cs.en;
    const url = isEs ? `/es/case-studies/${cs.slug}` : `/case-studies/${cs.slug}`;
    return `        <a href="${url}" class="case-card">
          <h2>${content.h1}</h2>
          <span class="sub">${content.sub}</span>
          <p>${content.lead}</p>
          <span class="arrow">${labels.learn}</span>
        </a>`;
  }).join('\n');

  const collectionJsonLd = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": ${JSON.stringify(labels.heading + ' — Jaime M. Mena')},
    "url": "${canonical}",
    "description": ${JSON.stringify(description)},
    "hasPart": [
${CASE_STUDIES.map(cs => {
  const content = isEs ? cs.es : cs.en;
  const url = isEs ? `https://jaimem.com/es/case-studies/${cs.slug}` : `https://jaimem.com/case-studies/${cs.slug}`;
  return `      { "@type": "Article", "name": ${JSON.stringify(content.h1)}, "url": "${url}" }`;
}).join(',\n')}
    ]
  }
  </script>`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
${COMMON_HEAD_TAGS}
${AUTO_REDIRECT_SCRIPT}
${metaBlock({
    title,
    description,
    canonical,
    locale,
    localeAlt,
    ogAlt,
  })}

${collectionJsonLd}

  <link rel="preload" href="/fonts/InterVariable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles/site.css?v=20260512b" />

${PAGE_STYLES}
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

${nav(lang, isEs)}

  <main id="main-content">
    <article class="page-wrap" style="max-width:880px;">
      <p class="crumbs"><a href="${isEs ? '/es/' : '/'}">${labels.home}</a> &rsaquo; <span>${labels.heading}</span></p>

      <h1>${labels.heading}</h1>

      <p class="lead">${labels.lead}</p>

      <div class="case-grid">
${cards}
      </div>

      <div class="cta-block">
        <h3>${labels.ctaH}</h3>
        <p>${labels.ctaP}</p>
        <a href="${isEs ? '/es/services/revops-consulting' : '/services/revops-consulting'}" class="btn btn-primary">${labels.cta}</a>
      </div>
    </article>
  </main>

${FOOTER}

${TOGGLE_SCRIPT}
</body>
</html>
`;
}

let totalBytes = 0;
let totalFiles = 0;

function emit(relPath, content) {
  const outPath = resolve(ROOT, relPath);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content, 'utf8');
  totalBytes += content.length;
  totalFiles += 1;
  console.log(`[build-case-studies] wrote ${relPath} (${content.length} bytes)`);
}

// Hubs
emit('case-studies/index.html', renderHub('en'));
emit('es/case-studies/index.html', renderHub('es'));

// Each case study × 2 languages
for (const cs of CASE_STUDIES) {
  emit(`case-studies/${cs.slug}.html`, renderCaseStudy(cs, 'en'));
  emit(`es/case-studies/${cs.slug}.html`, renderCaseStudy(cs, 'es'));
}

console.log(`[build-case-studies] ${totalFiles} files, ${totalBytes} bytes total`);
