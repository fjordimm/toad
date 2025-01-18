import type { Route } from "./+types/top-level-layout";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "TOAD" },
		{ name: "description", content: "To Outline A Destination" },
	];
}

export default function TopLevelLayout() {
	return (
		<div>
			<h1>Toad Website</h1>
			<p>Yayyyy its toading time!</p>
		</div>
	);
}
