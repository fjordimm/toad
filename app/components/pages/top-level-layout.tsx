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
		<div className="grow flex flex-col justify-stretch items-stretch bg-lime-200">
			<Outlet />
		</div>
	);
}
