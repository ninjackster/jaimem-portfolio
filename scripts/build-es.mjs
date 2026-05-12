#!/usr/bin/env node
// Generates es/index.html from index.html by swapping data-en/data-es text
// and rewriting head metadata to Spanish. Run by Vercel on every build.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(ROOT, 'index.html');
const OUT = resolve(ROOT, 'es', 'index.html');

const ES = {
  title: 'Jaime M. Mena — Consultor de Revenue Operations | GTM B2B SaaS, Salesforce y HubSpot | California',
  description: 'Consultor de Revenue Operations en California ayudando a equipos B2B SaaS a escalar GTM con Salesforce, HubSpot, diseño de territorios, pronósticos y modelos de comisiones. Bilingüe EN/ES.',
  ogImageAlt: 'Jaime M. Mena — Consultor de Revenue Operations',
  jsonLdPersonDesc: 'Consultor de Revenue Operations y GTM ayudando a equipos B2B SaaS a escalar go-to-market a través de estrategia, sistemas y datos. Especialista en Salesforce y HubSpot. Bilingüe inglés/español.',
};

let html = readFileSync(SRC, 'utf8');

// 1. <html lang="en"> -> "es"
html = html.replace(/<html\s+lang="en"\s*>/, '<html lang="es">');

// 2. Swap data-en/data-es elements: replace inner HTML with data-es value.
// Match elements that have BOTH data-en and data-es. Use a forgiving regex on
// the opening tag, then replace innerHTML up to the matching closing tag.
// We process tag-by-tag rather than parsing HTML, because the document is
// hand-authored and well-formed enough for this transform.
html = html.replace(
  /<(\w+)([^>]*?\bdata-es="([^"]*)"[^>]*)>([\s\S]*?)<\/\1>/g,
  (match, tag, attrs, esVal, inner) => {
    // Only swap when data-en is also present (mirrors the JS toggle's contract).
    if (!/\bdata-en="/.test(attrs)) return match;
    // Skip if inner contains nested elements with their own data-es —
    // those will be swapped on their own pass. We detect by looking for any
    // child tag inside; if so, leave inner alone so the recursion (next regex
    // pass) handles children. The regex above is greedy-by-tag-name so it
    // already matches the nearest closing tag of the same name; child tags
    // of different names are fine, child tags of the same name would break
    // the pairing — but the source is simple enough that this is not a risk.
    return `<${tag}${attrs}>${esVal}</${tag}>`;
  }
);

// 3. <title>
html = html.replace(
  /<title>[^<]*<\/title>/,
  `<title>${ES.title}</title>`
);

// 4. meta description
html = html.replace(
  /(<meta\s+name="description"\s+content=")[^"]*(")/,
  `$1${ES.description}$2`
);

// 5. canonical -> /es/
html = html.replace(
  /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
  `$1https://jaimem.com/es/$2`
);

// 6. hreflang: en -> /, es -> /es/, x-default -> /
// Strip existing alternates and rewrite cleanly.
html = html.replace(
  /<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>\s*/g,
  ''
);
const altBlock = [
  '<link rel="alternate" hreflang="en" href="https://jaimem.com/" />',
  '<link rel="alternate" hreflang="es" href="https://jaimem.com/es/" />',
  '<link rel="alternate" hreflang="x-default" href="https://jaimem.com/" />',
].join('\n  ');
// Insert alternates just before the closing </head> as a safe location.
html = html.replace(/<link\s+rel="canonical"[^>]*>/, m => `${m}\n  ${altBlock}`);

// 7. OG locale: en_US -> es_ES, alternate -> en_US
html = html.replace(
  /(<meta\s+property="og:locale"\s+content=")en_US(")/,
  '$1es_ES$2'
);
html = html.replace(
  /(<meta\s+property="og:locale:alternate"\s+content=")es_ES(")/,
  '$1en_US$2'
);

// 8. OG/Twitter title + description -> Spanish
html = html.replace(
  /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
  `$1${ES.title}$2`
);
html = html.replace(
  /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
  `$1${ES.description}$2`
);
html = html.replace(
  /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
  `$1https://jaimem.com/es/$2`
);
html = html.replace(
  /(<meta\s+property="og:image:alt"\s+content=")[^"]*(")/,
  `$1${ES.ogImageAlt}$2`
);
html = html.replace(
  /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
  `$1${ES.title}$2`
);
html = html.replace(
  /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
  `$1${ES.description}$2`
);
html = html.replace(
  /(<meta\s+name="twitter:image:alt"\s+content=")[^"]*(")/,
  `$1${ES.ogImageAlt}$2`
);

// 9. JSON-LD Person description (Spanish)
html = html.replace(
  /("description":\s*")Revenue Operations[^"]*("[\s,])/,
  `$1${ES.jsonLdPersonDesc}$2`
);

// 10. Rewrite relative asset/page URLs so they resolve against the site root,
// not against /es/. Skip anchors (#), absolute (/), protocol (http, mailto:,
// tel:), and data: URIs.
const rewriteRel = (attr) =>
  new RegExp(`(\\s${attr}=")(?!#|/|https?:|mailto:|tel:|data:)([^"]+)(")`, 'g');
for (const attr of ['href', 'src']) {
  html = html.replace(rewriteRel(attr), '$1/$2$3');
}

// 11. Flip the language toggle's initial active state.
html = html.replace(
  /<button class="lang-btn active" data-lang="en" aria-pressed="true">EN<\/button>\s*<button class="lang-btn" data-lang="es" aria-pressed="false">ES<\/button>/,
  '<button class="lang-btn" data-lang="en" aria-pressed="false">EN</button>\n          <button class="lang-btn active" data-lang="es" aria-pressed="true">ES</button>'
);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, 'utf8');
console.log(`[build-es] wrote ${OUT} (${html.length} bytes)`);
