import { Navigate, Outlet } from "react-router";
import Sidebar from "../modules/sidebar";
import MenuBar from "../modules/MenuBar";
import { useState } from "react";

export default function MainLayout() {

	// authenticateUser((result: DocumentSnapshot) => {});

	const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);

	return userIsAuthenticated
		? (
			<div className="grow flex flex-row">
				<MenuBar name="John Doe" />
				<div className="p-5 grow">
					<Outlet />
				</div>
			</div>
		)
		: <Navigate to="/sign-in" /> ;
}
