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
				'maven': ['"Maven Pro"', 'sans-serif'],
        		'sunflower': ['"Sunflower"', 'sans-serif'],
			},
			colors: {
				dashboard_lime: "#AECF83",
				sidebar_deep_green: "#3D5846",
				sidebar_button_bg: "#4E6A55",
				dashboard_component_bg: "#9DBD7A",
			},
		},
	},
	plugins: [],
} satisfies Config;
