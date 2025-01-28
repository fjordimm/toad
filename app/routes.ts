import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("components/pages/TopLevelLayout.tsx", [
		route("/sign-in", "components/pages/SignInPage.tsx"),
		route("/sign-up", "components/pages/SignUpPage.tsx"),
		layout("components/pages/MainLayout.tsx", [
			index("components/pages/LandingPage.tsx"),
			route("/create-trip", "components/pages/CreateTrip.tsx"),
			route("/test-trip", "components/pages/TripPage.tsx")
		])
	])
] satisfies RouteConfig;
