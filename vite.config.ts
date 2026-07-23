import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.user.ts',
      userscript: {
        name: 'Torn Merits Tracker',
        namespace: 'https://github.com/torn-merits',
        version: '1.4.1',
        description: 'Track and warn about near-completed merits in Torn.com',
        author: 'Torn Player',
        match: ['*://*.torn.com/*'],
        grant: ['GM_getValue', 'GM_setValue', 'GM_xmlhttpRequest'],
        license: 'MIT',
      },
      build: {
        outFileName: 'torn-merits.user.js',
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
