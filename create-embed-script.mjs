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
    const element = document.createElement('link');
    element.href = link.href;
    if (link.integrity) element.integrity = link.integrity;
    if (link.crossOrigin) element.crossOrigin = link.crossOrigin;
    document.head.appendChild(element);
}

const scripts = ${JSON.stringify(scripts)};

for (const script of scripts) {
    const element = document.createElement('script');
    element.src = script.src;
    if (script.integrity) element.integrity = script.integrity;
    if (script.crossOrigin) element.crossOrigin = script.crossOrigin;
    if (script.defer) element.defer = true;
    if (script.async) element.async = true;
    document.body.appendChild(element);
}`);
