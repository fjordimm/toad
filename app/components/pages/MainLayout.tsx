import { Link, Navigate, Outlet, redirect, useNavigate } from "react-router";
import Sidebar from "../modules/sidebar";
import MenuBar from "../modules/MenuBar";
import { useState } from "react";
import { authenticateUser } from "~/src/databaseUtil";
import type { DocumentSnapshot } from "firebase/firestore";

export default function MainLayout() {

	const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
	const [userDbDoc, setFirebaseDocSnapshot] = useState<DocumentSnapshot | null>(null);

	authenticateUser(
		(result: DocumentSnapshot) => {
			setUserIsAuthenticated(true);
			setFirebaseDocSnapshot(result);
		},
		() => {
			setUserIsAuthenticated(false);
		}
	);

	return userIsAuthenticated
		? (
			<div className="grow flex flex-row">
				<MenuBar userDbDoc={userDbDoc as DocumentSnapshot} />
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
}
