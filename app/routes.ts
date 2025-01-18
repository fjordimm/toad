import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
	layout("components/pages/top-level-layout.tsx", [
		index("components/pages/landing.tsx")
	])
	// index("components/pages/top-level-layout.tsx")
] satisfies RouteConfig;
