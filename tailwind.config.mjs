/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				onest : ['Onest Variable', ...defaultTheme.fontFamily.sans],
				lexend : ['Lexend Variable', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
}
