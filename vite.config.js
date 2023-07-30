import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	base: '',
	plugins: [
		vue(),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	build: {
		// https://rollupjs.org/configuration-options/
		rollupOptions: {
			output: {
				entryFileNames: 'assets/[name].js',
				assetFileNames: 'assets/sake.min[extname]',
			}
		}
	}
})
