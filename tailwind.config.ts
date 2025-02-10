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

				trip_member_col_1: "#E4BF3B",
				trip_member_col_2: "#DA934C",
				trip_member_col_3: "#D66A38",
				trip_member_col_4: "#B298BF",
				trip_member_col_5: "#8B618F",
				trip_member_col_6: "#624865",
				trip_member_col_7: "#85CCCC",
				trip_member_col_8: "#6BB0DD",
				trip_member_col_9: "#277893",
				trip_member_col_10: "#BD7B7B",
				trip_member_col_11: "#A25656",
				trip_member_col_12: "#501C1C",
				trip_member_col_13: "#97CA7B",
				trip_member_col_14: "#6AAC4A",
				trip_member_col_15: "#335735",
			},
			backgroundImage: {
				"background-green-gradient": 'linear-gradient(180deg, #87A26A 0%, #3D5941 89%, #2B4737 100%)'
			}
		},
	},
	plugins: [require("tailwind-scrollbar")],
} satisfies Config;
