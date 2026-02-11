import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/sql.js/dist/sql-wasm.wasm',
					dest: './'
				}
			]
		}),
		Icons({
			compiler: 'svelte',
		})
	],
	optimizeDeps: {
		include: ['sql.js']
	}
});
