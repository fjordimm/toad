import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
	// layout("top-layout.tsx", [
	// 	index("")
	// ])
	index("components/pages/top-level-layout.tsx")
] satisfies RouteConfig;
