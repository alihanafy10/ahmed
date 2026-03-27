import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(), 
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
				// Don't cache API requests - especially file uploads!
				navigateFallbackDenylist: [/^\/api/],
				runtimeCaching: [
					{
						// Cache images from the app itself
						urlPattern: /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'images-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
							},
						},
					},
					{
						// Don't cache API calls - always go to network
						urlPattern: /^https?:\/\/.*\/api\/.*/,
						handler: 'NetworkOnly',
					},
				],
			},
			manifest: {
				name: 'Accident Report App',
				short_name: 'Accident Report',
				description: 'Report accidents with ease',
				theme_color: '#ffffff',
				icons: [
					{
						src: '/Image/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/Image/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
});
