import { Outlet } from "react-router";
import type { Route } from "./+types/top-level-layout";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "TOAD" },
		{ name: "description", content: "To Outline A Destination" },
	];
}

export default function TopLevelLayout() {
	return (
		<div className="grow flex flex-col justify-start bg-lime-200">
			<h1>Toad Website</h1>
			<p>Yayyyy its toading time!</p>
			<Outlet />
		</div>
	);
}
