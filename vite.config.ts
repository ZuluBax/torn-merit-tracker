import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.user.ts',
      userscript: {
        name: 'Torn Honors & Medals Tracker',
        namespace: 'https://github.com/torn-merits',
        version: '4.0.4',
        description: 'Track your honors and medals progress in Torn.com',
        author: 'Torn Player',
        match: ['*://*.torn.com/*'],
        grant: ['GM_getValue', 'GM_setValue', 'GM_deleteValue', 'GM_xmlhttpRequest'],
        license: 'MIT',
      },
      build: {
        outFileName: 'torn-honors-medals-tracker.user.js',
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
