import { Link, Navigate, Outlet, redirect, useNavigate, useOutletContext } from "react-router";
import Sidebar from "../modules/sidebar";
import MenuBar from "../modules/MenuBar";
import { useState } from "react";
import type { DocumentReference, DocumentSnapshot } from "firebase/firestore";
import { useTopLevelLayoutContext, type TopLevelLayoutContext } from "./TopLevelLayout";

export default function MainLayout() {

	console.log("MAIN LAYOUT RERENDERING");

	const topLevelLayoutContext: TopLevelLayoutContext = useTopLevelLayoutContext();

	console.log(topLevelLayoutContext.userDbDoc);

	if (topLevelLayoutContext.userDbDoc !== null) {
		return (
			<div className="grow flex flex-row">
				<MenuBar userDbDoc={topLevelLayoutContext.userDbDoc} />
				<div className="p-5 grow flex">
					<Outlet context={{ userDbDoc: topLevelLayoutContext.userDbDoc }}/>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<p>You are not signed in.</p>
				<Link to="/sign-in" className="underline">Sign In</Link>
			</div>
		);
	}
}

// To be used by subroutes
export type MainLayoutContext = { userDbDoc: DocumentSnapshot };
export function useMainLayoutContext(): MainLayoutContext { return useOutletContext(); }
