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

test('telegram links open safely in a new tab', () => {
	const links = html.match(/<a [^>]*href="https:\/\/t\.me\/[^"]*"[^>]*>/g) || [];
	assert.ok(links.length >= 1, `expected >=1 telegram links, got ${links.length}`);
	for (const a of links) {
		assert.match(a, /target="_blank"/);
		assert.match(a, /rel="[^"]*noopener[^"]*"/);
	}
});

test('hero links to the language section; about section present', () => {
	assert.match(html, /href="#languages"/);
	assert.match(html, /Хто я така/);
});

const section = (id) => {
	const m = html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`));
	assert.ok(m, `section #${id} missing`);
	return m[0];
};

test('lessons list has six sticky notes', () => {
	const notes = section('lessons').match(/<ul[^>]*class="[^"]*notes[^"]*"[\s\S]*?<\/ul>/);
	assert.ok(notes, 'notes list missing');
	assert.equal((notes[0].match(/<li[\s>]/g) || []).length, 6);
});

test('pricing shows both prices', () => {
	const s = section('pricing');
	assert.match(s, /20 €/);
	assert.match(s, /30 €/);
});

test('language details blocks exist, visible without JS, with price and telegram', () => {
	for (const id of ['english', 'spanish']) {
		const s = section(id);
		const open = s.match(/<section[^>]*>/)[0];
		assert.match(open, /data-lang-details/);
		assert.doesNotMatch(open, /\shidden/);
		assert.match(s, /20 €/);
		assert.match(s, /href="https:\/\/t\.me\//);
		assert.match(html, new RegExp(`href="#${id}"`));
	}
});

test('page has at least four telegram links', () => {
	assert.ok(count(/href="https:\/\/t\.me\//g) >= 4);
});
