import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'"Inter"',
					"ui-sans-serif",
					"system-ui",
					"sans-serif",
					'"Apple Color Emoji"',
					'"Segoe UI Emoji"',
					'"Segoe UI Symbol"',
					'"Noto Color Emoji"',
				],
				'lilita': ['"Lilita One"', 'sans-serif'],
				'maven': ['"Maven Pro"', 'sans-serif'],
        		'sunflower': ['"Sunflower"', 'sans-serif'],
			},
			colors: {
				dashboard_lime: "#AECF83",
				sidebar_deep_green: "#3D5846",
				sidebar_button_bg: "#4E6A55",
				dashboard_component_bg: "#9DBD7A",
			},
			backgroundImage: {
				"background-green-gradient": 'linear-gradient(180deg, #87A26A 0%, #3D5941 89%, #2B4737 100%)'
			}
		},
	},
	plugins: [],
} satisfies Config;
