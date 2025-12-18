import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'build',
			env: {
				port: 3000
			}
		}),

		alias: {
			$root: 'src',
			$lib: 'src/lib',
			$components: 'src/components',
			$layouts: 'src/layouts',
			$routes: 'src/routes'
		}
	}
};

export default config;
