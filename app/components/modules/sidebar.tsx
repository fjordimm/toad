import { Link } from "react-router";

export default function Sidebar() {
	return (
		<div className="flex flex-col items-center bg-lime-700 w-72 p-2">
			<p>Welcome back, Sophie!</p>
			<Link to="/" className="underline text-blue-800 visited:text-purple-800">Home</Link>
			<Link to="/page-b" className="underline text-blue-800 visited:text-purple-800">Page B</Link>
			<Link to="/page-c" className="underline text-blue-800 visited:text-purple-800">Page C</Link>
			<Link to="/create-trip" className="underline text-blue-800 visited:text-purple-800">Create New Trip</Link>
		</div>
	);
}
