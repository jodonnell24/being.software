import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Polyfill File constructor for build environments
if (typeof global !== 'undefined' && typeof global.File === 'undefined') {
  global.File = globalThis.File || class File extends Blob {
    constructor(fileBits, fileName, options = {}) {
      super(fileBits, options);
      this.name = fileName;
      this.lastModified = options.lastModified || Date.now();
    }
  };
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	define: {
		global: 'globalThis',
	},
	optimizeDeps: {
		include: ['@cloudflare/workers-types']
	},
	ssr: {
		noExternal: ['@sveltejs/adapter-cloudflare']
	}
});
