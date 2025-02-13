import { Link, Navigate, Outlet, redirect, useNavigate, useOutletContext } from "react-router";
import MenuBar from "../modules/MenuBar";
import { useState } from "react";
import type { DocumentReference, DocumentSnapshot } from "firebase/firestore";
import { useTopLevelLayoutContext, type TopLevelLayoutContext } from "./TopLevelLayout";
import { debugLogComponentRerender } from "~/src/debugUtil";

export default function MainLayout() {

	debugLogComponentRerender("MainLayout");

	const topLevelLayoutContext: TopLevelLayoutContext = useTopLevelLayoutContext();

	if (topLevelLayoutContext.userDbDoc !== null) {
		return (
			<div className="grow flex flex-row overflow-hidden">
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
