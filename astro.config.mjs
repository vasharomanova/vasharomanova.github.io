// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://vasharomanova.github.io',
	// The stylesheet is small; inlining it removes the only render-blocking request.
	build: { inlineStylesheets: 'always' },
});
