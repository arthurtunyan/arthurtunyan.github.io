// Packs dist/ into one self-contained page (dist/portfolio.html) for publishing as a claude.ai artifact.
// The artifact host adds <!doctype>, <head> and <body>, so this emits only the head bits we need + the body.
import {readFileSync, writeFileSync} from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const html = readFileSync(new URL('index.html', dist), 'utf8');
const read = (href) => readFileSync(new URL('.' + href, dist), 'utf8');

const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];

const keep = [
  head.match(/<title>[\s\S]*?<\/title>/)[0],
  ...head.match(/<meta name="claude:[^>]*>/g),
  ...head.match(/<link rel="preconnect"[^>]*>/g),
  ...head.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/g),
];

const css = [...head.matchAll(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g)]
  .map(([, href]) => `<style>${read(href).replace(/<\/style/gi, '<\\/style')}</style>`);
const js = [...head.matchAll(/<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"[^>]*><\/script>/g)]
  .map(([, src]) => `<script type="module">${read(src).replace(/<\/script/gi, '<\\/script').replace(/\uFFFD/g, '\\uFFFD')}</script>`);

if (!css.length || !js.length) throw new Error('No built CSS/JS found in dist/index.html');

const out = [...keep, ...css, body.trim(), ...js].join('\n');
writeFileSync(new URL('portfolio.html', dist), out);
console.log(`dist/portfolio.html  ${(out.length / 1024).toFixed(0)} KB`);
