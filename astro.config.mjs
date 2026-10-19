// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// The stylesheet is small; inlining it removes the only render-blocking request.
	build: { inlineStylesheets: 'always' },
});
