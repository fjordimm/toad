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

				user_col_1: "#E4BF3B",
				user_col_2: "#DA934C",
				user_col_3: "#D66A38",
				user_col_4: "#B298BF",
				user_col_5: "#8B618F",
				user_col_6: "#624865",
				user_col_7: "#85CCCC",
				user_col_8: "#6BB0DD",
				user_col_9: "#277893",
				user_col_10: "#BD7B7B",
				user_col_11: "#A25656",
				user_col_12: "#501C1C",
				user_col_13: "#97CA7B",
				user_col_14: "#6AAC4A",
				user_col_15: "#335735",
			},
			backgroundImage: {
				"background-green-gradient": 'linear-gradient(180deg, #87A26A 0%, #3D5941 89%, #2B4737 100%)'
			}
		},
	},
	plugins: [require("tailwind-scrollbar")],
} satisfies Config;
