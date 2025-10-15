// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://asdf8601.github.io',
  base: '/asdfff.dev',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
});
