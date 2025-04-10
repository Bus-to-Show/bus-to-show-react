import { JSDOM } from 'jsdom';
import { open } from 'node:fs/promises';

const inPath = 'build/index.html';
const dom = await JSDOM.fromFile(inPath);

const outPath = 'build/embed-snippet.html';
const outFile = await open(outPath, 'w');
const outStream = outFile.createWriteStream();

const links = dom.window.document.querySelectorAll('link[rel=stylesheet]');

for (const link of links) {
  outStream.write(link.outerHTML + '\n');
}

outStream.write('<div id="root">Insert app here</div>\n');

const scripts = dom.window.document.querySelectorAll('script');

for (const script of scripts) {
  outStream.write(script.outerHTML + '\n');
}
