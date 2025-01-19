import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("components/pages/top-level-layout.tsx", [
		layout("components/pages/main-layout.tsx", [
			index("components/pages/landing.tsx"),
			route("/page-b", "components/pages/page-b.tsx"),
			route("/page-c", "components/pages/page-c.tsx")
		])
	])
] satisfies RouteConfig;
