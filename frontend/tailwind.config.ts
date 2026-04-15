import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
	extend: {
		colors: {
			background: '#FDFBF7', // Warmer, softer off-white for a more trustworthy feel
			foreground: '#2C3E38', // Dark slate/green for text, easier on eyes than pure black
			primary: {
				DEFAULT: '#00574B', // Slightly deeper, richer green for stability/nature
				foreground: '#FFFFFF'
			},
			accent: {
				DEFAULT: '#E67E22', // A warm, professional orange/amber for energy/action
				foreground: '#FFFFFF'
			},
			card: {
				DEFAULT: '#FFFFFF',
				foreground: '#2C3E38'
			},
			popover: {
				DEFAULT: '#FFFFFF',
				foreground: '#2C3E38'
			},
			secondary: {
				DEFAULT: '#D35400', // Deeper terracotta for secondary elements
				foreground: '#FFFFFF'
			},
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			}
		},
		fontFamily: {
			manrope: ['var(--font-manrope)', 'sans-serif'],
			publicSans: ['var(--font-public-sans)', 'sans-serif']
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		}
	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
