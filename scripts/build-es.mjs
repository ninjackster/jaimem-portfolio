#!/usr/bin/env node
// Generates Spanish mirrors under es/ for every source page listed in PAGES.
// Each page provides its own Spanish title/description/canonical/etc.; the
// shared transform swaps data-en/data-es text, sets <html lang="es">, fixes
// hreflang, and rewrites relative URLs so they resolve from /es/.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// One entry per English page that should have a Spanish twin.
// `canonicalEn` is the public URL of the English page; the Spanish mirror is
// served from the same path under /es/.
const PAGES = [
  {
    src: 'index.html',
    out: 'es/index.html',
    canonicalEn: 'https://jaimem.com/',
    canonicalEs: 'https://jaimem.com/es/',
    title: 'Jaime M. Mena — Consultor de Revenue Operations | GTM B2B SaaS, Salesforce y HubSpot | California',
    description: 'Consultor de Revenue Operations en California ayudando a equipos B2B SaaS a escalar GTM con Salesforce, HubSpot, diseño de territorios, pronósticos y modelos de comisiones. Bilingüe EN/ES.',
    ogImageAlt: 'Jaime M. Mena — Consultor de Revenue Operations',
    jsonLdPersonDesc: 'Consultor de Revenue Operations y GTM ayudando a equipos B2B SaaS a escalar go-to-market a través de estrategia, sistemas y datos. Especialista en Salesforce y HubSpot. Bilingüe inglés/español.',
  },
  {
    src: 'services/index.html',
    out: 'es/services/index.html',
    canonicalEn: 'https://jaimem.com/services/',
    canonicalEs: 'https://jaimem.com/es/services/',
    title: 'Servicios — Consultoría de Revenue Operations, Desarrollo Web y Análisis STR | Jaime M. Mena',
    description: 'Tres servicios: consultoría de Revenue Operations para B2B SaaS, desarrollo web bilingüe para pequeñas empresas, y análisis de rentas a corto plazo y bienes raíces. Bilingüe EN/ES.',
    ogImageAlt: 'Servicios de Jaime M. Mena',
  },
  {
    src: 'services/revops-consulting.html',
    out: 'es/services/revops-consulting.html',
    canonicalEn: 'https://jaimem.com/services/revops-consulting',
    canonicalEs: 'https://jaimem.com/es/services/revops-consulting',
    title: 'Consultoría de Revenue Operations para B2B SaaS | Jaime M. Mena',
    description: 'Consultoría de Revenue Operations para equipos B2B SaaS: implementaciones de Salesforce y HubSpot, diseño de territorios, pronósticos, deal desk y planes de comisiones. Bilingüe inglés/español.',
    ogImageAlt: 'Consultoría de Revenue Operations — Jaime M. Mena',
  },
  {
    src: 'services/web-development.html',
    out: 'es/services/web-development.html',
    canonicalEn: 'https://jaimem.com/services/web-development',
    canonicalEs: 'https://jaimem.com/es/services/web-development',
    title: 'Desarrollo Web y Presencia Digital para Pequeñas Empresas | Jaime M. Mena',
    description: 'Sitios web bilingües, rápidos y optimizados para SEO para pequeñas empresas, restaurantes y operadores inmobiliarios. Construidos para velocidad, mobile-first y conversión.',
    ogImageAlt: 'Desarrollo Web — Jaime M. Mena',
  },
  {
    src: 'services/str-real-estate-analytics.html',
    out: 'es/services/str-real-estate-analytics.html',
    canonicalEn: 'https://jaimem.com/services/str-real-estate-analytics',
    canonicalEs: 'https://jaimem.com/es/services/str-real-estate-analytics',
    title: 'Análisis para Alquileres a Corto Plazo y Bienes Raíces | Jaime M. Mena',
    description: 'Análisis de pricing, sistemas de reservas y dashboards de operaciones para anfitriones de alquileres a corto plazo (Airbnb, VRBO) y portafolios inmobiliarios pequeños.',
    ogImageAlt: 'Análisis para Alquileres a Corto Plazo — Jaime M. Mena',
  },
];

function transform(html, page) {
  // 1. <html lang="en"> -> "es"
  html = html.replace(/<html\s+lang="en"\s*>/, '<html lang="es">');

  // 2. Swap data-en/data-es: replace innerHTML with the Spanish value.
  // Forgiving regex; relies on hand-authored, well-formed source.
  html = html.replace(
    /<(\w+)([^>]*?\bdata-es="([^"]*)"[^>]*)>([\s\S]*?)<\/\1>/g,
    (match, tag, attrs, esVal) => {
      if (!/\bdata-en="/.test(attrs)) return match;
      return `<${tag}${attrs}>${esVal}</${tag}>`;
    }
  );

  // 3. <title>
  if (page.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  }

  // 4. meta description
  if (page.description) {
    html = html.replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${page.description}$2`
    );
  }

  // 5. canonical -> Spanish URL
  html = html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
    `$1${page.canonicalEs}$2`
  );

  // 6. hreflang: rewrite cleanly. Drop any existing alternates first.
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>\s*/g,
    ''
  );
  const altBlock = [
    `<link rel="alternate" hreflang="en" href="${page.canonicalEn}" />`,
    `<link rel="alternate" hreflang="es" href="${page.canonicalEs}" />`,
    `<link rel="alternate" hreflang="x-default" href="${page.canonicalEn}" />`,
  ].join('\n  ');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/, m => `${m}\n  ${altBlock}`);

  // 7. OG locale + OG/Twitter URL+title+description+image alt
  html = html.replace(
    /(<meta\s+property="og:locale"\s+content=")en_US(")/,
    '$1es_ES$2'
  );
  html = html.replace(
    /(<meta\s+property="og:locale:alternate"\s+content=")es_ES(")/,
    '$1en_US$2'
  );
  html = html.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${page.canonicalEs}$2`
  );
  if (page.title) {
    html = html.replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
      `$1${page.title}$2`
    );
    html = html.replace(
      /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
      `$1${page.title}$2`
    );
  }
  if (page.description) {
    html = html.replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${page.description}$2`
    );
    html = html.replace(
      /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
      `$1${page.description}$2`
    );
  }
  if (page.ogImageAlt) {
    html = html.replace(
      /(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/,
      `$1${page.ogImageAlt}$2`
    );
    html = html.replace(
      /(<meta\s+name="twitter:image:alt"\s+content=")[^"]*(")/,
      `$1${page.ogImageAlt}$2`
    );
  }

  // 8. JSON-LD Person description (homepage only — won't match elsewhere)
  if (page.jsonLdPersonDesc) {
    html = html.replace(
      /("description":\s*")Revenue Operations[^"]*("[\s,])/,
      `$1${page.jsonLdPersonDesc}$2`
    );
  }

  // 9. Rewrite relative URLs to absolute. Skip anchors, root-relative,
  // absolute protocols, mailto, tel, data URIs. Applied to href, src, and
  // (rare but possible) content="url(...)" — we only touch href/src.
  const rewriteRel = (attr) =>
    new RegExp(`(\\s${attr}=")(?!#|/|https?:|mailto:|tel:|data:)([^"]+)(")`, 'g');
  for (const attr of ['href', 'src']) {
    html = html.replace(rewriteRel(attr), '$1/$2$3');
  }

  // 10. Flip the language toggle's initial active state (only present where
  // the toggle exists; safe no-op otherwise).
  html = html.replace(
    /<button class="lang-btn active" data-lang="en" aria-pressed="true">EN<\/button>\s*<button class="lang-btn" data-lang="es" aria-pressed="false">ES<\/button>/,
    '<button class="lang-btn" data-lang="en" aria-pressed="false">EN</button>\n          <button class="lang-btn active" data-lang="es" aria-pressed="true">ES</button>'
  );

  return html;
}

for (const page of PAGES) {
  const srcPath = resolve(ROOT, page.src);
  const outPath = resolve(ROOT, page.out);
  let html;
  try {
    html = readFileSync(srcPath, 'utf8');
  } catch (e) {
    console.warn(`[build-es] skip missing source: ${page.src}`);
    continue;
  }
  const out = transform(html, page);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, out, 'utf8');
  console.log(`[build-es] wrote ${page.out} (${out.length} bytes)`);
}
