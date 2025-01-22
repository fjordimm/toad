import { Form } from "react-router";
import type { Route } from "./+types/landing";

async function testBruh() {
	console.log("Yipeeeeeeeeee weheeeeeeeeeeee!");
}

export default function Landing() {
	return (
		<div className="bg-lime-500">
			<h1>Landing Page</h1>
			<p>Hello I am the landing page.</p>
		</div>
	);
}
