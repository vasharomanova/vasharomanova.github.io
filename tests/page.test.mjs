import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const count = (re) => (html.match(re) || []).length;

test('document is Ukrainian with title and meta', () => {
	assert.match(html, /<html lang="uk"/);
	assert.match(html, /<title>[^<]*Англійська та іспанська[^<]*<\/title>/);
	assert.match(html, /<meta name="description" content="[^"]+"/);
	assert.match(html, /<meta property="og:title" content="[^"]+"/);
});

test('page has exactly one h1', () => {
	assert.equal(count(/<h1[\s>]/g), 1);
});
