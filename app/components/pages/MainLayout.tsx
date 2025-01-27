import { Link, Navigate, Outlet, redirect, useNavigate } from "react-router";
import Sidebar from "../modules/sidebar";
import MenuBar from "../modules/MenuBar";
import { useState } from "react";
import { authenticateUser } from "~/src/userAuthenticationUtil";
import type { DocumentSnapshot } from "firebase/firestore";

// export async function clientLoader({ request }) {
// 	const authResult = await authenticateUser();
// 	if (authResult != null) {
// 		console.log(`hehheheheheeeeeeeeee name is ${authResult.data()?.first_name}`);
// 	} else {
// 		console.log("hell nawwwwwwwwwwwww");
// 	}
// }

export default function MainLayout() {

	const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);

	// const navigate = useNavigate();

	// authenticateUser((result: DocumentSnapshot) => {
	// 	console.log("AHHHHHHHHHHHHHHHHHHHHHHHHDKJFJSKDJFK");
	// 	if (true) {
	// 		navigate("/sign-in");
	// 	}
	// });

	authenticateUser(
		(result: DocumentSnapshot) => {
			setUserIsAuthenticated(true)
		},
		() => {
			setUserIsAuthenticated(false)
		}
	);

	return userIsAuthenticated
		? (
			<div className="grow flex flex-row">
				<MenuBar name="John Doe" />
				<div className="p-5 grow">
					<Outlet />
				</div>
			</div>
		)
		: (
			<div>
				<p>You are not signed in.</p>
				<Link to="/sign-in" className="underline">Sign In</Link>
			</div>
		);
	
	// return (
	// 	<div className="grow flex flex-row">
	// 		<MenuBar name="John Doe" />
	// 		<div className="p-5 grow">
	// 			<Outlet />
	// 		</div>
	// 	</div>
	// );
}
