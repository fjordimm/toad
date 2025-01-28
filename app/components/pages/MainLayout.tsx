import { Link, Navigate, Outlet, redirect, useNavigate, useOutletContext } from "react-router";
import Sidebar from "../modules/sidebar";
import MenuBar from "../modules/MenuBar";
import { useState } from "react";
import { authenticateUser } from "~/src/databaseUtil";
import type { DocumentSnapshot } from "firebase/firestore";
import { useTopLevelLayoutContext, type TopLevelLayoutContext } from "./TopLevelLayout";

export default function MainLayout() {

	console.log("MAIN LAYOUT RERENDERING");

	const topLevelLayoutContext: TopLevelLayoutContext = useTopLevelLayoutContext();

	// TODO: the `var as type` will cause errors, so do it in a different way
	return topLevelLayoutContext.userDbDoc !== null
		? (
			<div className="grow flex flex-row">
				<MenuBar userDbDoc={topLevelLayoutContext.userDbDoc as DocumentSnapshot} />
				<div className="p-5 grow flex">
					<Outlet context={{ userDbDoc: topLevelLayoutContext.userDbDoc as DocumentSnapshot }}/>
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

// To be used by subroutes
export type MainLayoutContext = { userDbDoc: DocumentSnapshot };
export function useMainLayoutContext(): MainLayoutContext { return useOutletContext(); }
