import { JSDOM } from 'jsdom';
import { open } from 'node:fs/promises';

const inPath = 'build/index.html';
const document = (await JSDOM.fromFile(inPath)).window.document;

const outPath = 'build/embed.js';
const outFile = await open(outPath, 'w');
const outStream = outFile.createWriteStream();

const links = [...document.querySelectorAll('link[rel=stylesheet]')].map(el => {
  return {
    href: el.hasAttribute('href') ? el.getAttribute('href') : undefined,
    integrity: el.hasAttribute('integrity') ? el.getAttribute('integrity') : undefined,
    crossOrigin: el.hasAttribute('crossOrigin') ? el.getAttribute('crossOrigin') : undefined,
  };
});

const scripts = [...document.querySelectorAll('script')].map(el => {
  return {
    src: el.hasAttribute('src') ? el.getAttribute('src') : undefined,
    integrity: el.hasAttribute('integrity') ? el.getAttribute('integrity') : undefined,
    crossOrigin: el.hasAttribute('crossOrigin') ? el.getAttribute('crossOrigin') : undefined,
    defer: el.hasAttribute('defer') ? true : undefined,
    async: el.hasAttribute('async') ? true : undefined,
  };
});

outStream.write(`const links = ${JSON.stringify(links)};

for (const link of links) {
    const el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = link.href;
    if (link.integrity) el.integrity = link.integrity;
    if (link.crossOrigin) el.crossOrigin = link.crossOrigin;
    document.head.appendChild(el);
}

const scripts = ${JSON.stringify(scripts)};

for (const script of scripts) {
    const el = document.createElement('script');
    el.src = script.src;
    if (script.integrity) el.integrity = script.integrity;
    if (script.crossOrigin) el.crossOrigin = script.crossOrigin;
    if (script.defer) el.defer = true;
    if (script.async) el.async = true;
    document.body.appendChild(el);
}`);
